import { auth } from "@/lib/firebase";

export type ReferralDashboard = {
  code: string;
  joined: boolean;
  total: number;
  valid: number;
  pending: number;
  bonus: number;
  withdrawalLockedUntil: string | null;
  referrals: Array<{
    id: string;
    nome: string;
    email: string;
    status: string;
    createdAt: string;
    activatedAt: string | null;
  }>;
};

async function headers() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para continuar.");
  return {
    Authorization: `Bearer ${await user.getIdToken()}`,
    "Content-Type": "application/json",
  };
}

async function parse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Falha ao processar indicação.");
  return data;
}

export async function ensureReferralProfile(input: {
  referralCode?: string;
  joinCampaign?: boolean;
} = {}) {
  const response = await fetch("/api/referrals", {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(input),
  });
  return parse<{ code: string }>(response);
}

export async function getReferralDashboard() {
  const response = await fetch("/api/referrals", {
    headers: await headers(),
    cache: "no-store",
  });
  return parse<ReferralDashboard>(response);
}
