import { auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export type PublicActivationPayment = {
  id: string;
  amount: number;
  feeAmount: number;
  reserveAmount: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "expired";
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  expiresAt: string | null;
  emailSentAt: string | null;
  receiptAvailable: boolean;
  approvedAt: string | null;
  createdAt: string;
};

function apiBase() {
  const url = (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar.netlify.app").trim();
  return url.replace(/\/$/, "");
}

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para continuar.");
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || "Falha na requisição de ativação.");
  return data;
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

export async function createActivationPayment() {
  const headers = await authHeaders();
  const res = await pixFetch("/api/payments/activation", {
    method: "POST",
    headers,
  });
  const data = await parseJson<{ payment: PublicActivationPayment }>(res);
  return data.payment;
}

export async function replaceActivationPayment(id: string) {
  const headers = await authHeaders();
  const res = await pixFetch(`/api/payments/activation/${id}`, {
    method: "DELETE",
    headers,
  });
  await parseJson<{ ok: true }>(res);
  return createActivationPayment();
}

export async function getActivationPayment(id: string) {
  const headers = await authHeaders();
  const res = await pixFetch(`/api/payments/activation/${id}`, {
    method: "GET",
    headers,
  });
  const data = await parseJson<{ payment: PublicActivationPayment }>(res);
  return data.payment;
}

export async function fetchActivationReceipt(id: string) {
  const headers = await authHeaders();
  const res = await fetch(`${apiBase()}/api/payments/activation/${id}/receipt`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Falha ao baixar comprovante.");
  }
  return res.arrayBuffer();
}

export async function listMyActivationPayments() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para consultar o extrato.");
  const snapshot = await getDocs(
    query(collection(db, "activationPayments"), where("memberId", "==", user.uid)),
  );
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        amount: Number(data.amount ?? 0),
        feeAmount: Number(data.feeAmount ?? 0),
        reserveAmount: Number(data.reserveAmount ?? 0),
        status: (data.status ?? "pending") as PublicActivationPayment["status"],
        qrCode: "",
        qrCodeBase64: "",
        ticketUrl: "",
        expiresAt: data.expiresAt ? String(data.expiresAt) : null,
        emailSentAt: data.emailSentAt ? String(data.emailSentAt) : null,
        receiptAvailable: Boolean(data.receiptGeneratedAt || data.status === "approved"),
        approvedAt: data.approvedAt ? String(data.approvedAt) : null,
        createdAt: String(data.createdAt ?? ""),
      } satisfies PublicActivationPayment;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
