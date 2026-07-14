"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import {
  Users,
  CheckCircle,
  Share2,
  Gift,
  Copy,
  Check,
} from "lucide-react";

const indicados = [
  { nome: "Carlos Silva", email: "carlos@email.com", status: "convertido", data: "10/01/2024" },
  { nome: "Ana Maria", email: "ana@email.com", status: "convertido", data: "08/01/2024" },
  { nome: "Pedro Costa", email: "pedro@email.com", status: "convertido", data: "05/01/2024" },
  { nome: "Mariana Lima", email: "mariana@email.com", status: "pendente", data: "15/01/2024" },
  { nome: "João Pedro", email: "joao@email.com", status: "pendente", data: "14/01/2024" },
];

export default function IndicacoesPage() {
  const codigoIndicacao = "JOAO2024";
  const linkIndicacao = `https://ecomopar.org/associar-se?ref=${codigoIndicacao}`;
  const [copied, setCopied] = useState<"codigo" | "link" | null>(null);

  const copy = async (value: string, which: "codigo" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {[
          { icon: Users, label: "Total indicados", value: "5" },
          { icon: CheckCircle, label: "Convertidos", value: "3" },
          { icon: Gift, label: "Bônus liberado", value: "R$ 150,00" },
          { icon: Share2, label: "Pendentes", value: "2" },
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
                  onClick={() => copy(linkIndicacao, "link")}
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
        {indicados.map((ind) => (
          <div key={ind.email} className="detail-row">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`icon-badge-lg mb-0 ${
                  ind.status === "convertido" ? "" : "icon-badge-amber bg-amber-100"
                }`}
              >
                {ind.status === "convertido" ? (
                  <CheckCircle className="w-4 h-4 text-green-700" />
                ) : (
                  <Share2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{ind.nome}</p>
                <p className="text-[12.5px] text-ink-soft truncate">
                  {ind.email} · {ind.data}
                </p>
              </div>
            </div>
            <span
              className={
                ind.status === "convertido" ? "badge-confirmado shrink-0" : "badge-pago shrink-0"
              }
            >
              {ind.status === "convertido" ? "Convertido" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
