import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "./firebase";

export type DepositPayment = {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "expired";
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  expiresAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  simulated: boolean;
};

function apiBase() {
  const url = (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar.netlify.app").trim();
  return url.replace(/\/$/, "");
}

async function headers() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para continuar.");
  return {
    Authorization: `Bearer ${await user.getIdToken()}`,
    "Content-Type": "application/json",
  };
}

async function parse(res: Response) {
  const data = (await res.json().catch(() => ({}))) as {
    payment?: DepositPayment;
    error?: string;
  };
  if (!res.ok || !data.payment) throw new Error(data.error || "Falha na operação PIX.");
  return data.payment;
}

async function pixFetch(path: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    return await fetch(`${apiBase()}${path}`, { ...init, signal: controller.signal });
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw new Error("O servidor demorou para gerar o PIX. Tente novamente.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function createDepositPayment(amount: number) {
  return parse(
    await pixFetch("/api/payments/deposit", {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({ amount }),
    }),
  );
}

export async function getDepositPayment(id: string) {
  return parse(
    await pixFetch(`/api/payments/deposit/${id}`, {
      method: "GET",
      headers: await headers(),
    }),
  );
}

export async function listMyDepositPayments() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para consultar as transferências.");
  const snapshot = await getDocs(
    query(collection(db, "depositPayments"), where("memberId", "==", user.uid)),
  );
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        amount: Number(data.amount ?? 0),
        status: (data.status ?? "pending") as DepositPayment["status"],
        qrCode: "",
        qrCodeBase64: "",
        ticketUrl: "",
        expiresAt: data.expiresAt ? String(data.expiresAt) : null,
        approvedAt: data.approvedAt ? String(data.approvedAt) : null,
        createdAt: String(data.createdAt ?? ""),
        simulated: Boolean(data.simulated),
      } satisfies DepositPayment;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
