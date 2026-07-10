import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { Bell, Lock, PiggyBank, TrendingUp } from "lucide-react";

export default function SaldoPage() {
  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

      <h2 className="section-title">Detalhamento dos saldos</h2>
      <div className="card p-1.5">
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
    </DashboardShell>
  );
}
