import { auth } from "./firebase";

export type RecurringPayment = { id: string; amount: number; days: number; totalAmount: number; status: "pending" | "authorized" | "paused" | "cancelled"; checkoutUrl: string; startDate: string; endDate: string; createdAt: string };
const apiBase = () => (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar-523.netlify.app").replace(/\/$/, "");
async function headers() { const user = auth.currentUser; if (!user) throw new Error("Faça login para continuar."); return { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" }; }
async function parse(response: Response) {
  const data = await response.json().catch(() => ({})) as { payment?: RecurringPayment; payments?: RecurringPayment[]; error?: string };
  if (!response.ok) throw new Error(data.error || "Falha na recorrência.");
  return data;
}

export async function createRecurringPayment(amount: number, days: number) {
  const data = await parse(await fetch(`${apiBase()}/api/payments/recurring`, { method: "POST", headers: await headers(), body: JSON.stringify({ amount, days }) }));
  if (!data.payment) throw new Error("Não foi possível criar a recorrência.");
  return data.payment;
}

export async function listRecurringPayments() {
  return (await parse(await fetch(`${apiBase()}/api/payments/recurring`, { headers: await headers() }))).payments || [];
}

export async function cancelRecurringPayment(id: string) {
  const data = await parse(await fetch(`${apiBase()}/api/payments/recurring/${id}`, { method: "DELETE", headers: await headers() }));
  if (!data.payment) throw new Error("Não foi possível cancelar a recorrência.");
  return data.payment;
}
