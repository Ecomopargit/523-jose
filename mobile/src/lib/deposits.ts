import { auth } from "./firebase";

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
  return { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" };
}

async function parse(res: Response) {
  const data = await res.json().catch(() => ({})) as { payment?: DepositPayment; error?: string };
  if (!res.ok || !data.payment) throw new Error(data.error || "Falha na operação PIX.");
  return data.payment;
}

export async function createDepositPayment(amount: number) {
  return parse(await fetch(`${apiBase()}/api/payments/deposit`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify({ amount }),
  }));
}

export async function getDepositPayment(id: string) {
  return parse(await fetch(`${apiBase()}/api/payments/deposit/${id}`, {
    method: "GET",
    headers: await headers(),
  }));
}
