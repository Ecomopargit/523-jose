import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";

import {
  ACTIVATION_AMOUNT,
  ACTIVATION_FEE_AMOUNT,
  ACTIVATION_RESERVE_AMOUNT,
} from "@/lib/activation-constants";
import { adminDb } from "@/lib/firebase-admin";
import {
  createDepositPixPayment,
  getMercadoPagoPayment,
  isMercadoPagoMissingPaymentError,
  mapMpStatus,
} from "@/lib/mercadopago";

export const DEPOSIT_COLLECTION = "depositPayments";
export type DepositStatus = "pending" | "approved" | "rejected" | "cancelled" | "expired";
export type DepositPayment = {
  id: string;
  memberId: string;
  amount: number;
  feeAmount: number;
  reserveAmount: number;
  status: DepositStatus;
  mpPaymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  simulated: boolean;
};

/** Plano diário R$ 7 → R$ 5 reserva + R$ 2 taxa (proporcional para outros valores). */
export function splitDepositAmount(amount: number) {
  const totalCents = Math.round(Number(amount) * 100);
  if (!Number.isFinite(totalCents) || totalCents <= 0) {
    return { reserveAmount: 0, feeAmount: 0 };
  }
  if (totalCents === Math.round(ACTIVATION_AMOUNT * 100)) {
    return {
      reserveAmount: ACTIVATION_RESERVE_AMOUNT,
      feeAmount: ACTIVATION_FEE_AMOUNT,
    };
  }
  const reserveCents = Math.round((totalCents * ACTIVATION_RESERVE_AMOUNT) / ACTIVATION_AMOUNT);
  const feeCents = totalCents - reserveCents;
  return {
    reserveAmount: reserveCents / 100,
    feeAmount: feeCents / 100,
  };
}

const nowIso = () => new Date().toISOString();
const mapDoc = (id: string, data: Record<string, unknown>): DepositPayment => {
  const amount = Number(data.amount || 0);
  const split = splitDepositAmount(amount);
  return {
    id,
    memberId: String(data.memberId || ""),
    amount,
    feeAmount: Number(data.feeAmount ?? split.feeAmount),
    reserveAmount: Number(data.reserveAmount ?? split.reserveAmount),
    status: (data.status as DepositStatus) || "pending",
    mpPaymentId: String(data.mpPaymentId || ""),
    qrCode: String(data.qrCode || ""),
    qrCodeBase64: String(data.qrCodeBase64 || ""),
    ticketUrl: String(data.ticketUrl || ""),
    expiresAt: data.expiresAt ? String(data.expiresAt) : null,
    createdAt: String(data.createdAt || nowIso()),
    updatedAt: String(data.updatedAt || nowIso()),
    approvedAt: data.approvedAt ? String(data.approvedAt) : null,
    simulated: Boolean(data.simulated),
  };
};

export const publicDepositPayload = (payment: DepositPayment) => ({
  id: payment.id,
  amount: payment.amount,
  feeAmount: payment.feeAmount,
  reserveAmount: payment.reserveAmount,
  status: payment.status,
  qrCode: payment.qrCode,
  qrCodeBase64: payment.qrCodeBase64,
  ticketUrl: payment.ticketUrl,
  expiresAt: payment.expiresAt,
  approvedAt: payment.approvedAt,
  createdAt: payment.createdAt,
  simulated: payment.simulated,
});

export async function createMemberDeposit(input: {
  memberId: string;
  email: string;
  nome: string;
  amount: number;
  notificationUrl?: string;
}) {
  const created = await createDepositPixPayment({
    ...input,
    idempotencyKey: `deposit-${input.memberId}-${randomUUID()}`,
  });
  const split = splitDepositAmount(input.amount);
  const ref = adminDb.collection(DEPOSIT_COLLECTION).doc();
  const stamp = nowIso();
  const payload = {
    memberId: input.memberId,
    amount: input.amount,
    ...split,
    ...created,
    status: "pending" as const,
    createdAt: stamp,
    updatedAt: stamp,
    approvedAt: null,
  };
  await ref.set(payload);
  return mapDoc(ref.id, payload);
}

export async function getDeposit(id: string) {
  const snap = await adminDb.collection(DEPOSIT_COLLECTION).doc(id).get();
  return snap.exists ? mapDoc(snap.id, snap.data() as Record<string, unknown>) : null;
}

export async function getDepositByMpId(mpPaymentId: string) {
  const snap = await adminDb
    .collection(DEPOSIT_COLLECTION)
    .where("mpPaymentId", "==", mpPaymentId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapDoc(doc.id, doc.data() as Record<string, unknown>);
}

export async function applyApprovedDeposit(payment: DepositPayment) {
  const paymentRef = adminDb.collection(DEPOSIT_COLLECTION).doc(payment.id);
  const userRef = adminDb.collection("users").doc(payment.memberId);
  const credit = payment.reserveAmount > 0 ? payment.reserveAmount : splitDepositAmount(payment.amount).reserveAmount;
  const feeAmount =
    payment.feeAmount > 0 ? payment.feeAmount : splitDepositAmount(payment.amount).feeAmount;

  await adminDb.runTransaction(async (tx) => {
    const current = await tx.get(paymentRef);
    if (!current.exists) throw new Error("Depósito não encontrado.");
    if (current.data()?.status === "approved") return;
    const stamp = nowIso();
    tx.update(paymentRef, {
      status: "approved",
      approvedAt: stamp,
      updatedAt: stamp,
      reserveAmount: credit,
      feeAmount,
    });
    tx.set(
      userRef,
      {
        saldoDisponivel: FieldValue.increment(credit),
        depositosCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
  return (await getDeposit(payment.id))!;
}

export async function syncDeposit(payment: DepositPayment) {
  if (payment.status === "approved") return payment;
  let mp;
  try {
    mp = await getMercadoPagoPayment(payment.mpPaymentId);
  } catch (error) {
    if (!isMercadoPagoMissingPaymentError(error)) throw error;
    const updatedAt = nowIso();
    await adminDb
      .collection(DEPOSIT_COLLECTION)
      .doc(payment.id)
      .set({ status: "expired", updatedAt }, { merge: true });
    return { ...payment, status: "expired" as const, updatedAt };
  }
  const status = mapMpStatus(mp.status);
  if (status === "approved") return applyApprovedDeposit(payment);
  if (status !== payment.status) {
    const updatedAt = nowIso();
    await adminDb.collection(DEPOSIT_COLLECTION).doc(payment.id).set({ status, updatedAt }, { merge: true });
    return { ...payment, status, updatedAt };
  }
  return payment;
}
