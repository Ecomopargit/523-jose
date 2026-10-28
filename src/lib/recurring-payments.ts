import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { splitDepositAmount } from "@/lib/deposit-payments";
import {
  coverageDaysFromAmount,
  extendCoverageUntilDate,
} from "@/lib/member-status";
import { getMercadoPagoAccessToken, mapMpStatus } from "@/lib/mercadopago";

export const RECURRING_COLLECTION = "recurringPayments";
export const RECURRING_CHARGE_COLLECTION = "recurringCharges";
export type RecurringStatus = "pending" | "authorized" | "paused" | "cancelled";
export type RecurringPayment = {
  id: string;
  memberId: string;
  amount: number;
  days: number;
  totalAmount: number;
  status: RecurringStatus;
  mpPreapprovalId: string;
  checkoutUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

const stamp = () => new Date().toISOString();
const fromDoc = (id: string, data: Record<string, unknown>): RecurringPayment => ({
  id,
  memberId: String(data.memberId || ""),
  amount: Number(data.amount || 0),
  days: Number(data.days || 0),
  totalAmount: Number(data.totalAmount || 0),
  status: (data.status as RecurringStatus) || "pending",
  mpPreapprovalId: String(data.mpPreapprovalId || ""),
  checkoutUrl: String(data.checkoutUrl || ""),
  startDate: String(data.startDate || ""),
  endDate: String(data.endDate || ""),
  createdAt: String(data.createdAt || ""),
  updatedAt: String(data.updatedAt || ""),
});

export const publicRecurringPayload = (item: RecurringPayment) => ({
  id: item.id,
  amount: item.amount,
  days: item.days,
  totalAmount: item.totalAmount,
  status: item.status,
  checkoutUrl: item.checkoutUrl,
  startDate: item.startDate,
  endDate: item.endDate,
  createdAt: item.createdAt,
});

export async function createRecurringPayment(input: {
  memberId: string;
  email: string;
  amount: number;
  days: number;
  backUrl: string;
  notificationUrl?: string;
}) {
  const ref = adminDb.collection(RECURRING_COLLECTION).doc();
  const externalReference = `recurring_${ref.id}`;
  const start = new Date();
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + input.days);
  const startDate = start.toISOString();
  const endDate = end.toISOString();
  const request = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": `recurring-${input.memberId}-${randomUUID()}`,
    },
    body: JSON.stringify({
      reason: "ECOMOPAR - contribuição diária",
      external_reference: externalReference,
      payer_email: input.email,
      back_url: input.backUrl,
      ...(input.notificationUrl ? { notification_url: input.notificationUrl } : {}),
      status: "pending",
      auto_recurring: {
        frequency: 1,
        frequency_type: "days",
        start_date: startDate,
        end_date: endDate,
        transaction_amount: input.amount,
        currency_id: "BRL",
      },
    }),
    cache: "no-store",
  });
  const result = (await request.json().catch(() => ({}))) as { id?: string; init_point?: string; message?: string; error?: string };
  if (!request.ok || !result.id || !result.init_point) {
    throw new Error(result.message || result.error || "Não foi possível preparar a cobrança recorrente no Mercado Pago.");
  }
  const createdAt = stamp();
  const payload = {
    memberId: input.memberId,
    amount: input.amount,
    days: input.days,
    totalAmount: Math.round(input.amount * input.days * 100) / 100,
    status: "pending" as const,
    mpPreapprovalId: result.id,
    externalReference,
    checkoutUrl: result.init_point,
    startDate,
    endDate,
    createdAt,
    updatedAt: createdAt,
  };
  await ref.set(payload);
  return fromDoc(ref.id, payload);
}

export async function listRecurringPayments(memberId: string) {
  const snap = await adminDb.collection(RECURRING_COLLECTION).where("memberId", "==", memberId).get();
  return snap.docs.map((doc) => fromDoc(doc.id, doc.data())).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function cancelRecurringPayment(id: string, memberId: string) {
  const ref = adminDb.collection(RECURRING_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.memberId !== memberId) throw new Error("Assinatura não encontrada.");
  const item = fromDoc(snap.id, snap.data() as Record<string, unknown>);
  if (item.status === "cancelled") return item;
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(item.mpPreapprovalId)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getMercadoPagoAccessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "cancelled" }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Não foi possível cancelar a recorrência no Mercado Pago.");
  await ref.set({ status: "cancelled", updatedAt: stamp() }, { merge: true });
  return (await ref.get()).exists ? fromDoc(id, (await ref.get()).data() as Record<string, unknown>) : item;
}

type MpPreapproval = { id?: string; status?: string; external_reference?: string };
type MpAuthorizedPayment = {
  id?: string | number;
  preapproval_id?: string;
  status?: string;
  transaction_amount?: number;
  external_reference?: string;
  payment?: { id?: string | number; status?: string; transaction_amount?: number };
};

async function mpGet<T>(path: string) {
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    headers: { Authorization: `Bearer ${getMercadoPagoAccessToken()}` },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as T & { message?: string; error?: string };
  if (!response.ok) throw new Error(body.message || body.error || "Falha ao consultar o Mercado Pago.");
  return body;
}

function mapPreapprovalStatus(status?: string | null): RecurringStatus {
  switch (status) {
    case "authorized":
      return "authorized";
    case "paused":
      return "paused";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

function recurringIdFromReference(externalReference?: string | null) {
  const value = String(externalReference || "");
  if (value.startsWith("recurring_")) return value.slice("recurring_".length);
  if (value.startsWith("recurring:")) return value.slice("recurring:".length);
  return "";
}

async function findRecurring(input: { externalReference?: string | null; preapprovalId?: string | null }) {
  const id = recurringIdFromReference(input.externalReference);
  if (id) {
    const snap = await adminDb.collection(RECURRING_COLLECTION).doc(id).get();
    if (snap.exists) return fromDoc(snap.id, snap.data() as Record<string, unknown>);
  }
  if (input.preapprovalId) {
    const snap = await adminDb
      .collection(RECURRING_COLLECTION)
      .where("mpPreapprovalId", "==", input.preapprovalId)
      .limit(1)
      .get();
    if (!snap.empty) {
      const doc = snap.docs[0]!;
      return fromDoc(doc.id, doc.data() as Record<string, unknown>);
    }
  }
  return null;
}

export async function syncRecurringPreapproval(preapprovalId: string) {
  const remote = await mpGet<MpPreapproval>(`/preapproval/${encodeURIComponent(preapprovalId)}`);
  const item = await findRecurring({
    externalReference: remote.external_reference,
    preapprovalId: remote.id || preapprovalId,
  });
  if (!item) return null;
  const status = mapPreapprovalStatus(remote.status);
  if (status === item.status) return item;
  const updatedAt = stamp();
  await adminDb.collection(RECURRING_COLLECTION).doc(item.id).set({ status, updatedAt }, { merge: true });
  return { ...item, status, updatedAt };
}

async function creditRecurringCharge(input: {
  mpPaymentId: string;
  amount: number;
  approved: boolean;
  externalReference?: string | null;
  preapprovalId?: string | null;
}) {
  if (!input.mpPaymentId || !input.approved) return null;
  const subscription = await findRecurring(input);
  if (!subscription || subscription.status === "cancelled") return null;

  const amount = input.amount > 0 ? input.amount : subscription.amount;
  const split = splitDepositAmount(amount);
  const chargeRef = adminDb.collection(RECURRING_CHARGE_COLLECTION).doc(input.mpPaymentId);
  const userRef = adminDb.collection("users").doc(subscription.memberId);
  const subscriptionRef = adminDb.collection(RECURRING_COLLECTION).doc(subscription.id);

  await adminDb.runTransaction(async (tx) => {
    const [current, userSnap] = await Promise.all([tx.get(chargeRef), tx.get(userRef)]);
    if (current.exists && current.data()?.status === "approved") return;
    const updatedAt = stamp();
    const userData = userSnap.data() || {};
    const blocked = userData.status === "bloqueado";
    const days = coverageDaysFromAmount(amount);
    const coverageUntilDate = extendCoverageUntilDate(
      typeof userData.coverageUntilDate === "string" ? userData.coverageUntilDate : null,
      days,
    );
    tx.set(chargeRef, {
      recurringId: subscription.id,
      memberId: subscription.memberId,
      mpPaymentId: input.mpPaymentId,
      amount,
      reserveAmount: split.reserveAmount,
      feeAmount: split.feeAmount,
      coverageDays: days,
      status: "approved",
      createdAt: updatedAt,
      approvedAt: updatedAt,
    });
    tx.set(
      userRef,
      {
        saldoDisponivel: FieldValue.increment(split.reserveAmount),
        depositosCount: FieldValue.increment(1),
        lastDepositAt: updatedAt,
        coverageUntilDate,
        ...(blocked ? {} : { status: "ativo" }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    if (subscription.status === "pending") {
      tx.set(subscriptionRef, { status: "authorized", updatedAt }, { merge: true });
    }
  });
  return subscription;
}

export async function applyRecurringAuthorizedPayment(authorizedPaymentId: string) {
  const item = await mpGet<MpAuthorizedPayment>(`/authorized_payments/${encodeURIComponent(authorizedPaymentId)}`);
  const paymentId = item.payment?.id != null ? String(item.payment.id) : "";
  const paymentStatus = mapMpStatus(item.payment?.status);
  if (!paymentId || paymentStatus !== "approved") return null;
  return creditRecurringCharge({
    mpPaymentId: paymentId,
    amount: Number(item.payment?.transaction_amount || item.transaction_amount || 0),
    approved: true,
    externalReference: item.external_reference,
    preapprovalId: item.preapproval_id,
  });
}

export async function creditRecurringPaymentWebhook(mp: {
  id?: string | number;
  status?: string | null;
  external_reference?: string | null;
  transaction_amount?: number | null;
}) {
  const external = String(mp.external_reference || "");
  if (!recurringIdFromReference(external)) return false;
  await creditRecurringCharge({
    mpPaymentId: String(mp.id || ""),
    amount: Number(mp.transaction_amount || 0),
    approved: mapMpStatus(mp.status) === "approved",
    externalReference: external,
  });
  return true;
}
