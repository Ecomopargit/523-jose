"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

export default function AtivarCadastroPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const plans = [
    {
      id: "diario",
      label: "Diário",
      price: "R$ 7,00",
      detail: "R$ 5,00 reserva + R$ 2,00 administrativo",
    },
  ];

  return (
    <DashboardShell title="Ativar Cadastro" showBack backHref="/dashboard">
      <div className="space-y-8 animate-fade-up">
        <p className="text-muted text-sm leading-relaxed">
          Selecione o plano de adesão para usufruir de todos os serviços e
          benefícios do instituto ECOMOPAR.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={`rounded-2xl p-6 text-left transition-all min-h-[140px] flex flex-col justify-center ${
                selected === plan.id
                  ? "bg-brand text-white shadow-lg shadow-brand/30 ring-4 ring-brand/20"
                  : "bg-brand text-white shadow-md hover:bg-brand-dark"
              }`}
            >
              <span className="text-sm font-semibold opacity-90">{plan.label}</span>
              <span className="text-3xl font-extrabold mt-1">{plan.price}</span>
              <span className={`text-xs mt-2 ${selected === plan.id ? "text-white/80" : "text-white/70"}`}>
                {plan.detail}
              </span>
            </button>
          ))}
        </div>

        {!selected ? (
          <p className="text-center text-muted text-sm">Selecione uma opção acima!</p>
        ) : (
          <div className="space-y-4">
            <div className="card p-5 text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-brand">Plano Adesão UM:</strong> PIX diário de
                R$ 7,00. R$ 5,00 ficam na sua reserva (saque a qualquer momento) e
                R$ 2,00 custeiam o instituto.
              </p>
              <p>
                <strong className="text-brand">Indique e ganhe:</strong> a cada 3
                parceiros indicados, R$ 150,00 de bônus. Carência de saque de 90
                dias ao aderir à campanha.
              </p>
            </div>
            <button type="button" className="btn-primary btn-lg w-full">
              Confirmar ativação
            </button>
          </div>
        )}

        <Link href="/dashboard" className="btn-ghost btn-md w-full text-center block">
          Voltar
        </Link>
      </div>
    </DashboardShell>
  );
}
