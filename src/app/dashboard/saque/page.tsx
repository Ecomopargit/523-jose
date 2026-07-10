"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { CheckCircle, Info } from "lucide-react";

const saldoDisponivel = 1850.0;

export default function SaquePage() {
  const [valor, setValor] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [observacao, setObservacao] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="withdraw-hero">
        <div>
          <p className="text-[12.5px] opacity-70 mb-1.5">Saldo disponível para saque</p>
          <p className="font-mono-num font-display text-[28px] font-bold">{brl(saldoDisponivel)}</p>
        </div>
        <p className="text-xs opacity-60">mín. R$ 10,00 · máx. {brl(saldoDisponivel)}</p>
      </div>

      {enviado ? (
        <div className="card p-8 text-center max-w-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-3">Saque solicitado!</h2>
          <p className="text-ink-soft text-sm mb-6">
            Sua solicitação foi recebida. Prazo de processamento: até 3 dias úteis.
          </p>
          <Link href="/dashboard" className="btn-primary btn-md">
            Voltar ao painel
          </Link>
        </div>
      ) : (
        <div className="card p-6 sm:p-7 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold block mb-1.5">
                Valor do saque <span className="text-brick-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono-num text-sm text-ink-soft font-semibold">
                  R$
                </span>
                <input
                  type="number"
                  required
                  min="10"
                  max={saldoDisponivel}
                  step="0.01"
                  className="field with-prefix"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <p className="text-[11.5px] text-ink-faint mt-1.5">
                Mínimo R$ 10,00 · Máximo {brl(saldoDisponivel)}
              </p>
            </div>

            <div>
              <label className="text-[13px] font-semibold block mb-1.5">
                Chave PIX para recebimento <span className="text-brick-500">*</span>
              </label>
              <input
                type="text"
                required
                className="field"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold block mb-1.5">
                Observação (opcional)
              </label>
              <textarea
                className="field"
                placeholder="Alguma informação adicional..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            <div className="note-inline">
              <div className="w-[26px] h-[26px] rounded-lg bg-surface border border-line flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5 text-green-700" />
              </div>
              <ul className="text-[12.5px] text-ink-soft leading-relaxed list-none">
                <strong className="text-ink text-[13px] block mb-0.5">Antes de confirmar</strong>
                <li>· O prazo de processamento é de até 3 dias úteis</li>
                <li>· Verifique se a chave PIX está correta</li>
                <li>· O valor será depositado na conta vinculada à chave</li>
              </ul>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5">
              Confirmar solicitação de saque
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}
