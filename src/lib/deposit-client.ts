import { auth } from "@/lib/firebase";

export type PublicDepositPayment = {
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

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para continuar.");
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parsePayment(res: Response) {
  const data = (await res.json().catch(() => ({}))) as {
    payment?: PublicDepositPayment;
    error?: string;
  };
  if (!res.ok || !data.payment) {
    throw new Error(data.error || "Falha na operação PIX.");
  }
  return data.payment;
}

export async function createDepositPayment(amount: number) {
  const headers = await authHeaders();
  return parsePayment(
    await fetch("/api/payments/deposit", {
      method: "POST",
      headers,
      body: JSON.stringify({ amount }),
    }),
  );
}

export async function getDepositPayment(id: string) {
  const headers = await authHeaders();
  return parsePayment(
    await fetch(`/api/payments/deposit/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    }),
  );
}
