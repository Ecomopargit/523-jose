import { auth } from "./firebase";

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
  return (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar-523.netlify.app").replace(/\/$/, "");
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

export async function createActivationPayment() {
  const headers = await authHeaders();
  const res = await fetch(`${apiBase()}/api/payments/activation`, {
    method: "POST",
    headers,
  });
  const data = await parseJson<{ payment: PublicActivationPayment }>(res);
  return data.payment;
}

export async function getActivationPayment(id: string) {
  const headers = await authHeaders();
  const res = await fetch(`${apiBase()}/api/payments/activation/${id}`, {
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
