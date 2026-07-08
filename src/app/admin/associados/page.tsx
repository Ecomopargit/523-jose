"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const associados = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", status: "ativo", saldo: 1850.0, dataCadastro: "01/01/2024" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(11) 91234-5678", status: "ativo", saldo: 3200.0, dataCadastro: "15/01/2024" },
  { id: 3, nome: "Pedro Costa", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(11) 99876-5432", status: "inadimplente", saldo: 450.0, dataCadastro: "20/12/2023" },
  { id: 4, nome: "Ana Paula", cpf: "789.123.456-00", email: "ana@email.com", telefone: "(11) 96543-2187", status: "ativo", saldo: 2100.0, dataCadastro: "05/02/2024" },
  { id: 5, nome: "Carlos Lima", cpf: "321.654.987-00", email: "carlos@email.com", telefone: "(11) 94321-8765", status: "bloqueado", saldo: 0.0, dataCadastro: "10/01/2024" },
];

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
      {/* Filtros */}
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              className="field !pl-12"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500 shrink-0" />
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

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Associado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {associadosFiltrados.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand whitespace-nowrap">{a.nome}</p>
                    <p className="text-sm text-gray-500">{a.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{a.cpf}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{a.telefone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        a.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : a.status === "inadimplente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {a.status === "ativo" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {a.status === "inadimplente" && <Clock className="w-3 h-3 mr-1" />}
                      {a.status === "bloqueado" && <XCircle className="w-3 h-3 mr-1" />}
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brand whitespace-nowrap">
                    R$ {a.saldo.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {a.dataCadastro}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      aria-label="Mais ações"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-gray-100"
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
