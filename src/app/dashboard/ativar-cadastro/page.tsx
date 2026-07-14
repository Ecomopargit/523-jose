"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { Check, Sparkles } from "lucide-react";

export default function AtivarCadastroPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const plans = [
    {
      id: "diario",
      label: "Plano diário",
      price: "R$ 7,00",
      detail: "R$ 5,00 reserva + R$ 2,00 administrativo",
    },
  ];

  if (confirmed) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-8 text-center max-w-xl animate-fade-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-3">Cadastro ativado!</h2>
          <p className="text-ink-soft text-sm mb-6 leading-relaxed">
            Seu plano diário está ativo. Comece os depósitos via PIX para construir sua reserva.
          </p>
          <Link href="/dashboard/pagamentos" className="btn-primary btn-md">
            Ir para pagamento
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="space-y-5 animate-fade-up max-w-xl">
        <div className="plan-banner !mb-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-green-900 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-ink-soft">Adesão ECOMOPAR</p>
              <p className="font-display text-base font-semibold">Escolha o plano diário</p>
            </div>
          </div>
        </div>

        <p className="text-ink-soft text-sm leading-relaxed">
          Selecione o plano para acessar reserva, benefícios e o clube do associado.
        </p>

        <div className="grid gap-3">
          {plans.map((plan) => {
            const active = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`rounded-[20px] p-6 text-left transition-all border ${
                  active
                    ? "bg-gradient-to-br from-green-700 to-green-900 text-white border-transparent shadow-md"
                    : "bg-surface text-ink border-line-soft hover:border-green-400 hover:bg-green-50"
                }`}
              >
                <span className={`text-sm font-semibold ${active ? "opacity-90" : "text-ink-soft"}`}>
                  {plan.label}
                </span>
                <span className="font-display text-3xl font-bold mt-1 block font-mono-num">
                  {plan.price}
                  <span className={`text-sm font-medium ml-1 ${active ? "opacity-70" : "text-ink-faint"}`}>
                    /dia
                  </span>
                </span>
                <span className={`text-xs mt-2 block ${active ? "text-white/75" : "text-ink-soft"}`}>
                  {plan.detail}
                </span>
              </button>
            );
          })}
        </div>

        {!selected ? (
          <p className="text-center text-ink-faint text-sm">Selecione o plano acima para continuar</p>
        ) : (
          <div className="space-y-4">
            <div className="note-inline !mb-0">
              <div className="w-[26px] h-[26px] rounded-lg bg-surface border border-line flex items-center justify-center shrink-0">
                <InfoIcon />
              </div>
              <ul className="list-none text-[12.5px] text-ink-soft leading-[1.8]">
                <strong className="block text-[13px] text-ink mb-0.5">Sobre o plano</strong>
                <li>· PIX diário de R$ 7,00 — R$ 5,00 na reserva, R$ 2,00 do instituto</li>
                <li>· Reserva disponível para saque a qualquer momento</li>
                <li>· Indique e ganhe: R$ 150 a cada 3 parceiros (carência 90 dias)</li>
              </ul>
            </div>
            <button
              type="button"
              className="btn-primary btn-lg w-full"
              onClick={() => setConfirmed(true)}
            >
              Confirmar ativação
            </button>
          </div>
        )}

        <Link href="/dashboard" className="btn-ghost btn-md w-full text-center block">
          Voltar ao início
        </Link>
      </div>
    </DashboardShell>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-700">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}
