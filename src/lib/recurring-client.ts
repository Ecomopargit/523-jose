import { auth } from "@/lib/firebase";

export type PublicRecurringPayment = { id: string; amount: number; days: number; totalAmount: number; status: "pending" | "authorized" | "paused" | "cancelled"; checkoutUrl: string; startDate: string; endDate: string; createdAt: string };
async function headers() { const user = auth.currentUser; if (!user) throw new Error("Faça login para continuar."); return { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" }; }
async function parse(res: Response) { const data = await res.json().catch(() => ({})) as { payment?: PublicRecurringPayment; payments?: PublicRecurringPayment[]; error?: string }; if (!res.ok) throw new Error(data.error || "Falha na recorrência."); return data; }
export async function createRecurringPayment(amount: number, days: number) { return (await parse(await fetch("/api/payments/recurring", { method: "POST", headers: await headers(), body: JSON.stringify({ amount, days }) }))).payment!; }
export async function listRecurringPayments() { return (await parse(await fetch("/api/payments/recurring", { headers: await headers(), cache: "no-store" }))).payments || []; }
export async function cancelRecurringPayment(id: string) { return (await parse(await fetch(`/api/payments/recurring/${id}`, { method: "DELETE", headers: await headers() }))).payment!; }
