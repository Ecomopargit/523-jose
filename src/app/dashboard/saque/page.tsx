"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { CheckCircle, Clock3, Info, KeyRound, ShieldCheck } from "lucide-react";
import { useMemberSession } from "@/hooks/useMemberSession";
import { requestWithdrawal } from "@/lib/withdrawal-store";

export default function SaquePage() {
  const [valor, setValor] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [observacao, setObservacao] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { member } = useMemberSession();
  const saldoDisponivel =
    (member?.saldoDisponivel ?? 0) + (member?.saldoBonus ?? 0);
  const [nowMs] = useState(() => Date.now());
  const lockedUntil = member?.withdrawalLockedUntil
    ? new Date(member.withdrawalLockedUntil)
    : null;
  const withdrawalLocked = Boolean(
    member?.aderiuIndicacao && lockedUntil && lockedUntil.getTime() > nowMs,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || sending || withdrawalLocked) return;
    setError("");
    setSending(true);
    const result = await requestWithdrawal({
      memberId: member.id,
      memberName: member.nome,
      memberCpf: member.cpf,
      value: Number(valor),
      pixKey: chavePix,
      note: observacao,
    });
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
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

      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_380px] gap-6 items-start">
      {enviado ? (
        <div className="card p-8 sm:p-12 text-center">
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
        <div className="card p-6 sm:p-8">
          <div className="mb-7 pb-6 border-b border-line-soft">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600 mb-2">Nova transferência</p>
            <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Dados do saque</h2>
            <p className="text-sm text-ink-soft mt-1.5">Confira os dados antes de confirmar a solicitação.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {withdrawalLocked && lockedUntil ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-ink-soft">
                Você aderiu ao Indique e Ganhe. Seus saques serão liberados em{" "}
                <strong className="text-ink">{lockedUntil.toLocaleDateString("pt-BR")}</strong>,
                após a carência de 90 dias.
              </div>
            ) : null}
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

            {error ? <p role="alert" className="rounded-xl bg-brick-100 px-3 py-2.5 text-xs text-brick-600">{error}</p> : null}
            <button disabled={sending || saldoDisponivel < 10 || withdrawalLocked} type="submit" className="btn-primary w-full py-3.5">
              Confirmar solicitação de saque
            </button>
          </form>
        </div>
      )}

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="card p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600 mb-5">Resumo do processo</p>
            {[
              { icon: KeyRound, title: "Recebimento via PIX", text: "O valor será enviado para a chave informada." },
              { icon: Clock3, title: "Até 3 dias úteis", text: "Você acompanha a análise pelo histórico." },
              { icon: ShieldCheck, title: "Processo protegido", text: "Seus dados são usados apenas nesta operação." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3.5 py-4 border-t border-line-soft first:border-t-0 first:pt-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <item.icon className="w-[18px] h-[18px] text-green-700" strokeWidth={1.9} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-ink-soft leading-relaxed mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[22px] border border-amber-100 bg-amber-100/55 p-5">
            <p className="text-sm font-semibold text-ink">Antes de solicitar</p>
            <p className="text-xs text-ink-soft leading-relaxed mt-1.5">O valor precisa estar disponível e a chave PIX deve pertencer ao titular do cadastro.</p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
