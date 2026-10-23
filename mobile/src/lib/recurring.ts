import { auth } from "./firebase";

export type RecurringPayment = { id: string; amount: number; days: number; totalAmount: number; status: "pending" | "authorized" | "paused" | "cancelled"; checkoutUrl: string; startDate: string; endDate: string; createdAt: string };
const apiBase = () => (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar-523.netlify.app").replace(/\/$/, "");
async function headers() { const user = auth.currentUser; if (!user) throw new Error("Faça login para continuar."); return { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" }; }
export async function createRecurringPayment(amount: number, days: number) {
  const response = await fetch(`${apiBase()}/api/payments/recurring`, { method: "POST", headers: await headers(), body: JSON.stringify({ amount, days }) });
  const data = await response.json().catch(() => ({})) as { payment?: RecurringPayment; error?: string };
  if (!response.ok || !data.payment) throw new Error(data.error || "Não foi possível criar a recorrência.");
  return data.payment;
}
