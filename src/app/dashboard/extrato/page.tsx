import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { Calendar, CheckCircle2, Filter, Star, TrendingUp, WalletCards } from "lucide-react";

const transacoes = [
  { data: "15/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" as const },
  { data: "14/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" as const },
  { data: "13/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" as const },
  { data: "10/01/2024", tipo: "Bônus", valorTotal: 150.0, valorReserva: 0, valorAdmin: 0, status: "Pago" as const },
  { data: "09/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" as const },
];

export default function ExtratoPage() {
  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid sm:grid-cols-3 gap-4 mb-6 animate-fade-up">
        <div className="stat-card">
          <div className="icon-badge"><WalletCards strokeWidth={1.9} /></div>
          <p className="text-xs text-ink-soft">Movimentações</p>
          <p className="font-display text-2xl font-semibold mt-1">5</p>
        </div>
        <div className="stat-card">
          <div className="icon-badge"><TrendingUp strokeWidth={1.9} /></div>
          <p className="text-xs text-ink-soft">Total em depósitos</p>
          <p className="font-mono-num text-xl font-semibold mt-1">{brl(28)}</p>
        </div>
        <div className="stat-card">
          <div className="icon-badge icon-badge-amber"><Star strokeWidth={1.9} /></div>
          <p className="text-xs text-ink-soft">Total em bônus</p>
          <p className="font-mono-num text-xl font-semibold mt-1 text-amber-600">{brl(150)}</p>
        </div>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Filter className="w-4 h-4 text-green-700" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold">Filtrar período</p>
            <p className="text-xs text-ink-soft mt-0.5">Selecione as datas para consultar</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <input aria-label="Data inicial" type="date" className="field !pl-10 !py-2.5 !min-h-0 w-auto text-[13px]" />
          </div>
          <span className="text-[13px] text-ink-faint">até</span>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <input aria-label="Data final" type="date" className="field !pl-10 !py-2.5 !min-h-0 w-auto text-[13px]" />
          </div>
        </div>
      </div>

      <div className="card p-2 sm:p-3">
        <div className="px-4 sm:px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Movimentações recentes</h2>
            <p className="text-xs text-ink-soft mt-1">Depósitos e recompensas da sua conta</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tudo processado
          </span>
        </div>
        {transacoes.map((t, i) => (
          <div key={i} className="txn-row border-t border-line-soft first:border-t-0">
            <div
              className={`icon-badge mb-0 w-9 h-9 ${t.tipo === "Bônus" ? "icon-badge-amber" : ""}`}
            >
              {t.tipo === "Bônus" ? (
                <Star className="w-4 h-4" strokeWidth={2} />
              ) : (
                <TrendingUp className="w-4 h-4" strokeWidth={2} />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">{t.tipo}</p>
              <p className="text-xs text-ink-soft mt-1">{t.data}</p>
            </div>

            <div className="hidden sm:block text-xs text-ink-soft text-right col-start-3">
              {t.tipo === "Bônus" ? (
                "indicação premiada"
              ) : (
                <>
                  reserva <b className="font-mono-num text-green-700">+{brl(t.valorReserva)}</b>
                  {" · "}admin {brl(t.valorAdmin)}
                </>
              )}
            </div>

            <div className="text-right sm:col-start-4">
              <p className="font-mono-num font-semibold text-sm">{brl(t.valorTotal)}</p>
              <span className={t.status === "Pago" ? "badge-pago" : "badge-confirmado"}>
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
