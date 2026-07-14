"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { TrendingDown, CheckCircle, XCircle, Clock, Check } from "lucide-react";
import { brl } from "@/lib/dashboard-meta";

const saques = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", valor: 500.0, chavePix: "joao@email.com", dataSolicitacao: "15/01/2024", status: "solicitado" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", valor: 1000.0, chavePix: "maria@email.com", dataSolicitacao: "14/01/2024", status: "solicitado" },
  { id: 3, nome: "Pedro Costa", cpf: "456.789.123-00", valor: 300.0, chavePix: "(11) 99876-5432", dataSolicitacao: "13/01/2024", status: "processando" },
  { id: 4, nome: "Ana Paula", cpf: "789.123.456-00", valor: 750.0, chavePix: "ana@email.com", dataSolicitacao: "12/01/2024", status: "pago" },
  { id: 5, nome: "Carlos Lima", cpf: "321.654.987-00", valor: 200.0, chavePix: "321.654.987-00", dataSolicitacao: "10/01/2024", status: "rejeitado" },
];

function statusClass(status: string) {
  if (status === "pago") return "badge-confirmado";
  if (status === "solicitado" || status === "processando") return "badge-pago";
  return "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brick-100 text-brick-600";
}

export default function SaquesPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const saquesFiltrados = saques.filter((s) =>
    filtroStatus === "todos" ? true : s.status === filtroStatus,
  );

  return (
    <AdminShell title="Saques" subtitle="Gerenciar solicitações de saque">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Total solicitado", value: brl(2750) },
          { label: "Pendentes", value: "2" },
          { label: "Processando", value: "1" },
          { label: "Pagos (mês)", value: brl(15400) },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <p className="text-[12.5px] text-ink-soft mb-1">{c.label}</p>
            <p className="font-display font-mono-num text-xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] font-medium text-ink-soft">Filtrar por status:</span>
          <select
            className="field sm:w-auto"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="solicitado">Solicitado</option>
            <option value="processando">Processando</option>
            <option value="pago">Pago</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50/60">
              <tr>
                {["Associado", "Valor", "Chave PIX", "Data", "Status", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10.5px] font-semibold text-ink-faint uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {saquesFiltrados.map((s) => (
                <tr key={s.id} className="hover:bg-green-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink text-sm whitespace-nowrap">{s.nome}</p>
                    <p className="text-[12.5px] text-ink-soft font-mono-num">{s.cpf}</p>
                  </td>
                  <td className="px-5 py-3.5 font-display font-mono-num text-lg font-bold text-green-700 whitespace-nowrap">
                    {brl(s.valor)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink font-mono-num whitespace-nowrap">
                    {s.chavePix}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink-soft whitespace-nowrap">
                    {s.dataSolicitacao}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={statusClass(s.status)}>
                      {s.status === "solicitado" && <Clock className="w-3 h-3" />}
                      {s.status === "processando" && <TrendingDown className="w-3 h-3" />}
                      {s.status === "pago" && <CheckCircle className="w-3 h-3" />}
                      {s.status === "rejeitado" && <XCircle className="w-3 h-3" />}
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {s.status === "solicitado" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="Aprovar saque"
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-100/80 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Rejeitar saque"
                          className="p-2 bg-brick-100 text-brick-600 rounded-lg hover:bg-brick-100/80 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
