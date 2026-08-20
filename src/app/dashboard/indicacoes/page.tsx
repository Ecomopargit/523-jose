"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import {
  Users,
  CheckCircle,
  Share2,
  Gift,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  ensureReferralProfile,
  getReferralDashboard,
  type ReferralDashboard,
} from "@/lib/referral-client";

export default function IndicacoesPage() {
  const [dashboard, setDashboard] = useState<ReferralDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"codigo" | "link" | null>(null);
  const codigoIndicacao = dashboard?.code ?? "—";
  const linkIndicacao = dashboard?.code
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://ecomopar.netlify.app"}/cadastrar?ref=${encodeURIComponent(dashboard.code)}`
    : "";

  useEffect(() => {
    let active = true;
    void ensureReferralProfile({ joinCampaign: true })
      .then(() => getReferralDashboard())
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Falha ao carregar.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const copy = async (value: string, which: "codigo" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const share = async () => {
    const text = `Venha para a ECOMOPAR. Use meu código ${codigoIndicacao} e cadastre-se pelo link: ${linkIndicacao}`;
    if (navigator.share) {
      await navigator.share({ title: "Indicação ECOMOPAR", text, url: linkIndicacao });
    } else {
      await copy(text, "link");
    }
  };

  if (loading) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-10 flex items-center justify-center gap-3 text-ink-soft">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando suas indicações…
        </div>
      </DashboardShell>
    );
  }

  const indicados = dashboard?.referrals ?? [];

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {[
          { icon: Users, label: "Total indicados", value: String(dashboard?.total ?? 0) },
          { icon: CheckCircle, label: "Ativados", value: String(dashboard?.valid ?? 0) },
          { icon: Gift, label: "Bônus liberado", value: `R$ ${(dashboard?.bonus ?? 0).toFixed(2).replace(".", ",")}` },
          { icon: Share2, label: "Pendentes", value: String(dashboard?.pending ?? 0) },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <div className="icon-badge">
              <c.icon />
            </div>
            <p className="text-[12.5px] text-ink-soft mb-1">{c.label}</p>
            <p className="font-display font-mono-num text-xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="note-inline mb-5">
        <Gift className="w-4 h-4 text-green-700 shrink-0" />
        <p className="text-[12.5px] text-ink-soft">
          Cada cadastro pelo seu código entra no contador. A cada 3 parceiros que ativarem o
          cadastro, você recebe R$ 150,00. Ao aderir, seus saques têm carência de 90 dias após
          sua ativação.
        </p>
      </div>

      <div className="withdraw-hero mb-5">
        <div className="w-full">
          <p className="text-[12.5px] opacity-70 mb-4">Seu código de indicação</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] opacity-55 uppercase tracking-wide mb-2 font-semibold">
                Código
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 font-mono-num text-xl truncate">
                  {codigoIndicacao}
                </div>
                <button
                  type="button"
                  onClick={() => copy(codigoIndicacao, "codigo")}
                  aria-label="Copiar código"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  {copied === "codigo" ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-[11px] opacity-55 uppercase tracking-wide mb-2 font-semibold">
                Link
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm truncate">
                  {linkIndicacao}
                </div>
                <button
                  type="button"
                  onClick={() => void share()}
                  aria-label="Copiar link"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  {copied === "link" ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="section-title">Seus indicados</p>
      <div className="card p-1.5">
        {indicados.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-soft">
            Nenhuma indicação ainda. Compartilhe seu link para começar.
          </div>
        ) : indicados.map((ind) => (
          <div key={ind.id} className="detail-row">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`icon-badge-lg mb-0 ${
                  ind.status === "activated" ? "" : "icon-badge-amber bg-amber-100"
                }`}
              >
                {ind.status === "activated" ? (
                  <CheckCircle className="w-4 h-4 text-green-700" />
                ) : (
                  <Share2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{ind.nome}</p>
                <p className="text-[12.5px] text-ink-soft truncate">
                  {ind.email} · {new Date(ind.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <span
              className={
                ind.status === "activated" ? "badge-confirmado shrink-0" : "badge-pago shrink-0"
              }
            >
              {ind.status === "activated" ? "Ativado" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
      {error ? <p className="text-sm text-brick-600 mt-4">{error}</p> : null}
    </DashboardShell>
  );
}
