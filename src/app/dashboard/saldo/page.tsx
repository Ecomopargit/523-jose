import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { Bell, Info, Lock, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";

export default function SaldoPage() {
  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-up">
        <div className="bal-card avail">
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-white/18 flex items-center justify-center">
              <TrendingUp className="w-[15px] h-[15px]" strokeWidth={2} />
            </div>
            <span className="text-[12.5px] font-semibold opacity-85">Disponível</span>
          </div>
          <p className="relative z-10 text-xs opacity-75 mb-1.5">Saldo em reserva</p>
          <p className="relative z-10 font-mono-num font-display text-[26px] font-bold">
            {brl(1850)}
          </p>
        </div>

        <div className="bal-card locked">
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-white/18 flex items-center justify-center">
              <Lock className="w-[15px] h-[15px]" strokeWidth={2} />
            </div>
            <span className="text-[12.5px] font-semibold opacity-85">Bloqueado</span>
          </div>
          <p className="relative z-10 text-xs opacity-75 mb-1.5">Saldo bloqueado</p>
          <p className="relative z-10 font-mono-num font-display text-[26px] font-bold">
            {brl(0)}
          </p>
        </div>

        <div className="bal-card bonus">
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-white/18 flex items-center justify-center">
              <Bell className="w-[15px] h-[15px]" strokeWidth={2} />
            </div>
            <span className="text-[12.5px] font-semibold opacity-85">Bônus</span>
          </div>
          <p className="relative z-10 text-xs opacity-75 mb-1.5">Saldo de bônus</p>
          <p className="relative z-10 font-mono-num font-display text-[26px] font-bold">
            {brl(150)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.3fr)_360px] gap-6 items-start">
      <div>
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">Composição</p>
        <h2 className="font-display text-xl font-semibold tracking-tight mt-1">Detalhamento dos saldos</h2>
      </div>
      <div className="card p-2.5">
        <div className="detail-row">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="icon-badge-lg">
              <PiggyBank className="w-[17px] h-[17px] text-green-700" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold">Reserva Principal</p>
              <p className="text-[12.5px] text-ink-soft">Valor acumulado dos depósitos diários</p>
            </div>
          </div>
          <p className="font-mono-num font-semibold text-sm text-green-700 shrink-0">
            +{brl(1700)}
          </p>
        </div>

        <div className="detail-row">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="icon-badge-lg icon-badge-amber">
              <Bell className="w-[17px] h-[17px] text-amber-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold">Bônus de Indicação</p>
              <p className="text-[12.5px] text-ink-soft">Ganhos do programa Indique e Ganhe</p>
            </div>
          </div>
          <p className="font-mono-num font-semibold text-sm text-amber-600 shrink-0">
            {brl(150)}
          </p>
        </div>
      </div>
      </div>

      <aside className="card p-6 lg:mt-11">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
          <ShieldCheck className="w-5 h-5 text-green-700" strokeWidth={1.9} />
        </div>
        <h3 className="font-display text-lg font-semibold">Seu patrimônio protegido</h3>
        <p className="text-sm text-ink-soft leading-relaxed mt-2">Cada saldo tem uma finalidade clara e regras próprias de disponibilidade.</p>
        <div className="mt-6 pt-5 border-t border-line-soft flex gap-3">
          <Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-ink-soft leading-relaxed">Os valores são atualizados conforme a confirmação das contribuições e dos bônus.</p>
        </div>
      </aside>
      </div>
    </DashboardShell>
  );
}
