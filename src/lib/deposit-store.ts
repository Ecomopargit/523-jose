"use client";

import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { PublicDepositPayment } from "@/lib/deposit-client";

export async function listMemberDepositPayments(memberId: string) {
  const snap = await getDocs(
    query(collection(db, "depositPayments"), where("memberId", "==", memberId)),
  );
  return snap.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        amount: Number(data.amount ?? 0),
        status: (data.status ?? "pending") as PublicDepositPayment["status"],
        qrCode: "",
        qrCodeBase64: "",
        ticketUrl: "",
        expiresAt: data.expiresAt ? String(data.expiresAt) : null,
        approvedAt: data.approvedAt ? String(data.approvedAt) : null,
        createdAt: String(data.createdAt ?? ""),
        simulated: Boolean(data.simulated),
      } satisfies PublicDepositPayment;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
