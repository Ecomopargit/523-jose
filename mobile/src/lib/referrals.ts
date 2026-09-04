import { auth } from "./firebase";

export type ReferralDashboard = {
  code: string;
  joined: boolean;
  total: number;
  valid: number;
  pending: number;
  bonus: number;
  withdrawalLockedUntil: string | null;
};

function baseUrl() {
  return (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar.netlify.app").replace(/\/$/, "");
}

async function request<T>(method: "GET" | "POST", path: string, body?: object): Promise<T> {
  if (!auth.currentUser) throw new Error("Faça login para continuar.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${baseUrl()}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    if (!response.ok) throw new Error(data.error || "Falha ao processar indicação.");
    return data;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw new Error("O servidor demorou para responder. Tente novamente.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function ensureReferralProfile(referralCode?: string, joinCampaign = false) {
  return request<{ code: string }>("POST", "/api/referrals", { referralCode, joinCampaign });
}

/** Uma única chamada: garante o código e devolve o painel. */
export function getReferralDashboard(joinCampaign = false) {
  const query = joinCampaign ? "?join=1" : "";
  return request<ReferralDashboard>("GET", `/api/referrals${query}`);
}
