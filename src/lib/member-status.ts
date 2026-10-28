import { ACTIVATION_AMOUNT } from "@/lib/activation-constants";

export type MemberStatus = "pendente" | "ativo" | "inadimplente" | "bloqueado";

type StatusInput = {
  status?: string | null;
  lastDepositAt?: string | null;
  activatedAt?: string | null;
  /** Último dia civil (YYYY-MM-DD, Brasília) com cobertura de ativação. */
  coverageUntilDate?: string | null;
};

/** Data civil no fuso de Brasília (YYYY-MM-DD). */
export function brasiliaDateKey(value: Date | string | null | undefined = new Date()) {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addBrasiliaDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

/** Quantos dias de ativação o valor do PIX cobre (R$ 7 = 1 dia). */
export function coverageDaysFromAmount(amount: number) {
  const cents = Math.round(Number(amount) * 100);
  const dayCents = Math.round(ACTIVATION_AMOUNT * 100);
  if (!Number.isFinite(cents) || cents <= 0 || dayCents <= 0) return 1;
  return Math.max(1, Math.floor(cents / dayCents));
}

/**
 * Estende a cobertura a partir do dia atual ou do dia seguinte ao fim atual.
 * Ex.: coberto até 30/10 + 7 dias → até 06/11; expirado + 7 dias a partir de hoje.
 */
export function extendCoverageUntilDate(
  currentUntilDate: string | null | undefined,
  days: number,
  today = brasiliaDateKey(),
) {
  const safeDays = Math.max(1, Math.floor(days));
  const start =
    currentUntilDate && currentUntilDate >= today
      ? addBrasiliaDays(currentUntilDate, 1)
      : today;
  return addBrasiliaDays(start, safeDays - 1);
}

export function remainingCoverageDays(coverageUntilDate?: string | null, today = brasiliaDateKey()) {
  if (!coverageUntilDate || coverageUntilDate < today) return 0;
  const [y1, m1, d1] = today.split("-").map(Number);
  const [y2, m2, d2] = coverageUntilDate.split("-").map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.max(0, Math.round((b - a) / 86400000) + 1);
}

export function isActivatedMemberStatus(status?: string | null) {
  return status === "ativo" || status === "inadimplente";
}

/** Cadastro já ativado e liberado para contribuir (mesmo se atrasado no dia). */
export function canContributeDaily(status?: string | null) {
  return isActivatedMemberStatus(status);
}

export function hasActiveCoverage(input: Pick<StatusInput, "coverageUntilDate" | "lastDepositAt" | "activatedAt">) {
  const today = brasiliaDateKey();
  if (input.coverageUntilDate) return input.coverageUntilDate >= today;
  const reference = input.lastDepositAt || input.activatedAt;
  if (!reference) return false;
  return brasiliaDateKey(reference) === today;
}

/**
 * Status operacional do associado:
 * - pendente / bloqueado: permanece
 * - após ativação: ativo enquanto houver cobertura (dia atual ou dias antecipados); senão inadimplente
 */
export function effectiveMemberStatus(input: StatusInput): MemberStatus {
  const stored = (input.status as MemberStatus) || "pendente";
  if (stored === "bloqueado" || stored === "pendente") return stored;
  if (!isActivatedMemberStatus(stored) && !input.activatedAt) return stored;
  return hasActiveCoverage(input) ? "ativo" : "inadimplente";
}

export function memberStatusLabel(status: MemberStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
