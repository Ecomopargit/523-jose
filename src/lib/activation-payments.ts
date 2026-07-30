import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

import {
  ACTIVATION_AMOUNT,
  ACTIVATION_COLLECTION,
  ACTIVATION_FEE_AMOUNT,
  ACTIVATION_RESERVE_AMOUNT,
  type ActivationPayment,
  type ActivationPaymentStatus,
} from "@/lib/activation-constants";
import { adminDb } from "@/lib/firebase-admin";
import {
  createActivationPixPayment,
  getMercadoPagoPayment,
  mapMpStatus,
} from "@/lib/mercadopago";
import { buildActivationReceiptPdf, sendActivationReceiptEmail } from "@/lib/receipt";
import {
  activateReferralForMember,
  withdrawalLockUntil,
} from "@/lib/referrals";

function nowIso() {
  return new Date().toISOString();
}

function mapDoc(id: string, data: Record<string, unknown>): ActivationPayment {
  return {
    id,
    memberId: String(data.memberId || ""),
    memberEmail: String(data.memberEmail || ""),
    memberName: String(data.memberName || ""),
    amount: Number(data.amount || ACTIVATION_AMOUNT),
    feeAmount: Number(data.feeAmount || ACTIVATION_FEE_AMOUNT),
    reserveAmount: Number(data.reserveAmount || ACTIVATION_RESERVE_AMOUNT),
    status: (data.status as ActivationPaymentStatus) || "pending",
    mpPaymentId: String(data.mpPaymentId || ""),
    qrCode: String(data.qrCode || ""),
    qrCodeBase64: String(data.qrCodeBase64 || ""),
    ticketUrl: String(data.ticketUrl || ""),
    expiresAt: data.expiresAt ? String(data.expiresAt) : null,
    emailSentAt: data.emailSentAt ? String(data.emailSentAt) : null,
    receiptGeneratedAt: data.receiptGeneratedAt ? String(data.receiptGeneratedAt) : null,
    createdAt: String(data.createdAt || nowIso()),
    updatedAt: String(data.updatedAt || nowIso()),
    approvedAt: data.approvedAt ? String(data.approvedAt) : null,
  };
}

export async function findOpenActivationPayment(memberId: string) {
  const snap = await adminDb
    .collection(ACTIVATION_COLLECTION)
    .where("memberId", "==", memberId)
    .where("status", "==", "pending")
    .limit(5)
    .get();

  if (snap.empty) return null;
  const docs = snap.docs
    .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return docs[0] || null;
}

export async function getActivationPayment(id: string) {
  const snap = await adminDb.collection(ACTIVATION_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return mapDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function getActivationPaymentByMpId(mpPaymentId: string) {
  const snap = await adminDb
    .collection(ACTIVATION_COLLECTION)
    .where("mpPaymentId", "==", mpPaymentId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapDoc(doc.id, doc.data() as Record<string, unknown>);
}

export async function createMemberActivationPayment(input: {
  memberId: string;
  email: string;
  nome: string;
  notificationUrl?: string;
}) {
  const existing = await findOpenActivationPayment(input.memberId);
  if (existing) return existing;

  const created = await createActivationPixPayment({
    memberId: input.memberId,
    email: input.email,
    nome: input.nome,
    notificationUrl: input.notificationUrl,
    idempotencyKey: `activation-${input.memberId}-${randomUUID()}`,
  });

  const ref = adminDb.collection(ACTIVATION_COLLECTION).doc();
  const payload = {
    memberId: input.memberId,
    memberEmail: input.email,
    memberName: input.nome,
    amount: ACTIVATION_AMOUNT,
    feeAmount: ACTIVATION_FEE_AMOUNT,
    reserveAmount: ACTIVATION_RESERVE_AMOUNT,
    status: "pending" as const,
    mpPaymentId: created.mpPaymentId,
    qrCode: created.qrCode,
    qrCodeBase64: created.qrCodeBase64,
    ticketUrl: created.ticketUrl,
    expiresAt: created.expiresAt,
    emailSentAt: null,
    receiptGeneratedAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    approvedAt: null,
  };

  await ref.set(payload);
  return mapDoc(ref.id, payload);
}

async function deliverReceiptOnce(payment: ActivationPayment) {
  if (payment.emailSentAt) return payment;

  const pdf = await buildActivationReceiptPdf(payment);
  const emailResult = await sendActivationReceiptEmail(payment, pdf);
  const stamp = nowIso();

  await adminDb.collection(ACTIVATION_COLLECTION).doc(payment.id).set(
    {
      receiptGeneratedAt: stamp,
      emailSentAt: emailResult.sent ? stamp : null,
      emailSkippedReason: emailResult.sent ? null : emailResult.reason,
      updatedAt: stamp,
    },
    { merge: true },
  );

  return {
    ...payment,
    receiptGeneratedAt: stamp,
    emailSentAt: emailResult.sent ? stamp : null,
    updatedAt: stamp,
  };
}

export async function applyApprovedActivation(payment: ActivationPayment) {
  const paymentRef = adminDb.collection(ACTIVATION_COLLECTION).doc(payment.id);
  const userRef = adminDb.collection("users").doc(payment.memberId);

  let alreadyApproved = false;

  await adminDb.runTransaction(async (tx) => {
    const [snap, userSnap] = await Promise.all([
      tx.get(paymentRef),
      tx.get(userRef),
    ]);
    if (!snap.exists) throw new Error("Pagamento de ativação não encontrado.");
    const data = snap.data()!;
    if (data.status === "approved") {
      alreadyApproved = true;
      return;
    }

    const stamp = nowIso();
    const member = userSnap.data() || {};
    const lockedUntil = member.aderiuIndicacao
      ? withdrawalLockUntil(stamp)
      : null;
    tx.update(paymentRef, {
      status: "approved",
      approvedAt: stamp,
      updatedAt: stamp,
    });
    tx.set(
      userRef,
      {
        status: "ativo",
        updatedAt: FieldValue.serverTimestamp(),
        activatedAt: stamp,
        withdrawalLockedUntil: lockedUntil,
        activationPaymentId: payment.id,
        activationMpPaymentId: payment.mpPaymentId,
      },
      { merge: true },
    );
  });

  await activateReferralForMember(payment.memberId);

  const refreshed = await getActivationPayment(payment.id);
  if (!refreshed) throw new Error("Falha ao recarregar pagamento aprovado.");
  if (alreadyApproved && refreshed.emailSentAt) return refreshed;

  return deliverReceiptOnce(refreshed);
}

export async function syncActivationPaymentStatus(payment: ActivationPayment) {
  if (payment.status === "approved") {
    return deliverReceiptOnce(payment);
  }

  const mp = await getMercadoPagoPayment(payment.mpPaymentId);
  const nextStatus = mapMpStatus(mp.status);

  if (nextStatus === "approved") {
    return applyApprovedActivation(payment);
  }

  if (nextStatus !== payment.status) {
    const stamp = nowIso();
    await adminDb.collection(ACTIVATION_COLLECTION).doc(payment.id).set(
      {
        status: nextStatus,
        updatedAt: stamp,
      },
      { merge: true },
    );
    return { ...payment, status: nextStatus, updatedAt: stamp };
  }

  return payment;
}

export async function getActivationReceiptPdf(payment: ActivationPayment) {
  const current =
    payment.status === "approved" ? await deliverReceiptOnce(payment) : payment;
  if (current.status !== "approved") {
    throw new Error("Comprovante disponível apenas após aprovação do PIX.");
  }
  return buildActivationReceiptPdf(current);
}
