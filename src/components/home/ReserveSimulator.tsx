"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Gift, PiggyBank, Wallet } from "lucide-react";

const DAILY_TOTAL = 7;
const DAILY_RESERVE = 5;
const DAILY_FEE = 2;
const REFERRAL_BONUS = 150;
const REFERRALS_PER_BONUS = 3;

function brl(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export default function ReserveSimulator() {
  const [meses, setMeses] = useState(6);
  const [indicacoes, setIndicacoes] = useState(3);

  const resultado = useMemo(() => {
    const dias = meses * 30;
    const bonusGrupos = Math.floor(indicacoes / REFERRALS_PER_BONUS);
    const reserva = dias * DAILY_RESERVE;
    const bonus = bonusGrupos * REFERRAL_BONUS;
    return {
      dias,
      investido: dias * DAILY_TOTAL,
      custeio: dias * DAILY_FEE,
      reserva,
      bonus,
      total: reserva + bonus,
      faltam: indicacoes % REFERRALS_PER_BONUS,
    };
  }, [meses, indicacoes]);

  const barraReserva = resultado.total > 0 ? (resultado.reserva / resultado.total) * 100 : 100;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Faça as contas
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mt-3">
            Simule quanto você acumula
          </h2>
          <p className="text-ink-soft mt-4 text-base sm:text-lg">
            Mova os controles e veja sua reserva crescer com o Plano Adesão Um.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="card p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="sim-meses" className="text-sm font-semibold text-ink">
                  Tempo de contribuição
                </label>
                <span className="font-display font-mono-num text-xl font-bold text-brand">
                  {meses} {meses === 1 ? "mês" : "meses"}
                </span>
              </div>
              <input
                id="sim-meses"
                type="range"
                min={1}
                max={24}
                step={1}
                value={meses}
                onChange={(e) => setMeses(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
                aria-describedby="sim-meses-hint"
              />
              <p id="sim-meses-hint" className="text-xs text-ink-faint mt-2">
                {resultado.dias} dias de PIX de {brl(DAILY_TOTAL)}
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="sim-indicacoes" className="text-sm font-semibold text-ink">
                  Parceiros indicados
                </label>
                <span className="font-display font-mono-num text-xl font-bold text-brand">
                  {indicacoes}
                </span>
              </div>
              <input
                id="sim-indicacoes"
                type="range"
                min={0}
                max={12}
                step={1}
                value={indicacoes}
                onChange={(e) => setIndicacoes(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
                aria-describedby="sim-indicacoes-hint"
              />
              <p id="sim-indicacoes-hint" className="text-xs text-ink-faint mt-2">
                {resultado.faltam === 0
                  ? "A cada 3 parceiros ativados você recebe R$ 150,00."
                  : `Faltam ${REFERRALS_PER_BONUS - resultado.faltam} parceiro(s) para o próximo bônus.`}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                <p className="text-xs text-ink-soft mb-1">Total depositado</p>
                <p className="font-display font-mono-num text-lg font-bold text-brand">
                  {brl(resultado.investido)}
                </p>
              </div>
              <div className="rounded-2xl bg-bg border border-line-soft p-4">
                <p className="text-xs text-ink-soft mb-1">Custeio da associação</p>
                <p className="font-display font-mono-num text-lg font-bold text-ink-soft">
                  {brl(resultado.custeio)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-gradient-to-br from-brand via-brand-dark to-brand-deep text-white p-6 sm:p-8 flex flex-col">
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Você teria disponível
            </p>
            <p className="font-display font-mono-num text-4xl sm:text-5xl font-extrabold mt-2 mb-6 tabular-nums">
              {brl(resultado.total)}
            </p>

            <div
              className="h-3 w-full rounded-full bg-white/15 overflow-hidden flex"
              role="img"
              aria-label={`Reserva ${brl(resultado.reserva)} e bônus ${brl(resultado.bonus)}`}
            >
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${barraReserva}%` }}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${100 - barraReserva}%` }}
              />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 border border-white/10">
                <PiggyBank className="w-6 h-6 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70">Reserva pessoal</p>
                  <p className="font-mono-num font-bold">{brl(resultado.reserva)}</p>
                </div>
                <span className="text-xs text-white/50 shrink-0">R$ 5,00/dia</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 border border-white/10">
                <Gift className="w-6 h-6 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70">Bônus de indicação</p>
                  <p className="font-mono-num font-bold">{brl(resultado.bonus)}</p>
                </div>
                <span className="text-xs text-white/50 shrink-0">R$ 150 / 3 ativos</span>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-xs text-white/60">
              <Wallet className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Simulação informativa. Saques seguem as regras da associação e, na campanha de
                indicação, a carência de 90 dias após a ativação.
              </p>
            </div>

            <Link href="/cadastrar" className="btn-accent btn-md w-full mt-6">
              <span>Começar minha reserva</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
