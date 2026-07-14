"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";
import { brl } from "@/lib/dashboard-meta";

const associados = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", status: "ativo", saldo: 1850.0, dataCadastro: "01/01/2024" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(11) 91234-5678", status: "ativo", saldo: 3200.0, dataCadastro: "15/01/2024" },
  { id: 3, nome: "Pedro Costa", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(11) 99876-5432", status: "inadimplente", saldo: 450.0, dataCadastro: "20/12/2023" },
  { id: 4, nome: "Ana Paula", cpf: "789.123.456-00", email: "ana@email.com", telefone: "(11) 96543-2187", status: "ativo", saldo: 2100.0, dataCadastro: "05/02/2024" },
  { id: 5, nome: "Carlos Lima", cpf: "321.654.987-00", email: "carlos@email.com", telefone: "(11) 94321-8765", status: "bloqueado", saldo: 0.0, dataCadastro: "10/01/2024" },
];

function statusBadge(status: string) {
  if (status === "ativo") return "badge-confirmado";
  if (status === "inadimplente") return "badge-pago";
  return "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brick-100 text-brick-600";
}

export default function AssociadosPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  const associadosFiltrados = associados.filter((assoc) => {
    if (filtroStatus !== "todos" && assoc.status !== filtroStatus) return false;
    if (
      busca &&
      !assoc.nome.toLowerCase().includes(busca.toLowerCase()) &&
      !assoc.cpf.includes(busca)
    )
      return false;
    return true;
  });

  return (
    <AdminShell title="Associados" subtitle="Gerenciar associados cadastrados">
      <div className="card p-4 sm:p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              className="field !pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-ink-soft shrink-0" />
            <select
              className="field md:w-auto"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inadimplente">Inadimplente</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50/60">
              <tr>
                {["Associado", "CPF", "Telefone", "Status", "Saldo", "Cadastro", "Ações"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[10.5px] font-semibold text-ink-faint uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {associadosFiltrados.map((a) => (
                <tr key={a.id} className="hover:bg-green-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink text-sm whitespace-nowrap">{a.nome}</p>
                    <p className="text-[12.5px] text-ink-soft">{a.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono-num text-ink whitespace-nowrap">
                    {a.cpf}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink whitespace-nowrap">{a.telefone}</td>
                  <td className="px-5 py-3.5">
                    <span className={statusBadge(a.status)}>
                      {a.status === "ativo" && <CheckCircle className="w-3 h-3" />}
                      {a.status === "inadimplente" && <Clock className="w-3 h-3" />}
                      {a.status === "bloqueado" && <XCircle className="w-3 h-3" />}
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono-num font-semibold text-green-700 whitespace-nowrap">
                    {brl(a.saldo)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink-soft whitespace-nowrap">
                    {a.dataCadastro}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      aria-label="Mais ações"
                      className="p-1.5 rounded-lg text-ink-faint hover:text-green-700 hover:bg-green-50"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
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
