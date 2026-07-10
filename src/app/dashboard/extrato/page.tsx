import DashboardShell from "@/components/DashboardShell";
import { brl } from "@/lib/dashboard-meta";
import { Calendar, Star, TrendingUp } from "lucide-react";

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
      <div className="card flex flex-wrap items-center gap-3.5 p-4 sm:p-5 mb-4">
        <div className="flex items-center gap-2 text-[13px] text-ink-soft font-medium">
          <Calendar className="w-4 h-4" strokeWidth={2} />
          Período:
        </div>
        <input type="date" className="field !py-2 !min-h-0 w-auto text-[13px]" />
        <span className="text-[13px] text-ink-faint">até</span>
        <input type="date" className="field !py-2 !min-h-0 w-auto text-[13px]" />
      </div>

      <div className="card p-1.5">
        {transacoes.map((t, i) => (
          <div key={i} className="txn-row">
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
              <p className="text-[13.5px] font-semibold">{t.tipo}</p>
              <p className="text-xs text-ink-soft">{t.data}</p>
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
