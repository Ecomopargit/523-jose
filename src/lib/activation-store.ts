"use client";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ACTIVATION_COLLECTION,
  type ActivationPayment,
  type ActivationPaymentStatus,
} from "@/lib/activation-constants";

function asIso(value: unknown) {
  if (typeof value === "string") return value;
  const timestamp = value as Timestamp | undefined;
  return timestamp?.toDate?.().toISOString() ?? new Date(0).toISOString();
}

function mapPayment(id: string, data: Record<string, unknown>): ActivationPayment {
  return {
    id,
    memberId: String(data.memberId ?? ""),
    memberEmail: String(data.memberEmail ?? ""),
    memberName: String(data.memberName ?? ""),
    amount: Number(data.amount ?? 0),
    feeAmount: Number(data.feeAmount ?? 0),
    reserveAmount: Number(data.reserveAmount ?? 0),
    status: (data.status as ActivationPaymentStatus) ?? "pending",
    mpPaymentId: String(data.mpPaymentId ?? ""),
    qrCode: String(data.qrCode ?? ""),
    qrCodeBase64: String(data.qrCodeBase64 ?? ""),
    ticketUrl: String(data.ticketUrl ?? ""),
    expiresAt: data.expiresAt ? asIso(data.expiresAt) : null,
    emailSentAt: data.emailSentAt ? asIso(data.emailSentAt) : null,
    receiptGeneratedAt: data.receiptGeneratedAt ? asIso(data.receiptGeneratedAt) : null,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
    approvedAt: data.approvedAt ? asIso(data.approvedAt) : null,
  };
}

async function readPayments(memberId?: string) {
  const base = collection(db, ACTIVATION_COLLECTION);
  const paymentQuery = memberId
    ? query(base, where("memberId", "==", memberId))
    : query(base, orderBy("createdAt", "desc"));
  const snap = await getDocs(paymentQuery);
  return snap.docs
    .map((item) => mapPayment(item.id, item.data() as Record<string, unknown>))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listMemberActivationPayments(memberId: string) {
  return readPayments(memberId);
}

export function listAllActivationPayments() {
  return readPayments();
}
