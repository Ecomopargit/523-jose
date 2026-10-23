import { randomUUID } from "crypto";

import { adminDb } from "@/lib/firebase-admin";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago";

export const RECURRING_COLLECTION = "recurringPayments";
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

export async function createRecurringPayment(input: { memberId: string; email: string; amount: number; days: number; backUrl: string }) {
  const ref = adminDb.collection(RECURRING_COLLECTION).doc();
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
      external_reference: `recurring:${ref.id}`,
      payer_email: input.email,
      back_url: input.backUrl,
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
