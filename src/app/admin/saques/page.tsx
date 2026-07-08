"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import {
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Check,
} from "lucide-react";

const saques = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", valor: 500.0, chavePix: "joao@email.com", dataSolicitacao: "15/01/2024", status: "solicitado" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", valor: 1000.0, chavePix: "maria@email.com", dataSolicitacao: "14/01/2024", status: "solicitado" },
  { id: 3, nome: "Pedro Costa", cpf: "456.789.123-00", valor: 300.0, chavePix: "(11) 99876-5432", dataSolicitacao: "13/01/2024", status: "processando" },
  { id: 4, nome: "Ana Paula", cpf: "789.123.456-00", valor: 750.0, chavePix: "ana@email.com", dataSolicitacao: "12/01/2024", status: "pago" },
  { id: 5, nome: "Carlos Lima", cpf: "321.654.987-00", valor: 200.0, chavePix: "321.654.987-00", dataSolicitacao: "10/01/2024", status: "rejeitado" },
];

export default function SaquesPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const saquesFiltrados = saques.filter((s) =>
    filtroStatus === "todos" ? true : s.status === filtroStatus,
  );

  return (
    <AdminShell title="Saques" subtitle="Gerenciar solicitações de saque">
      {/* Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="card p-5 sm:p-6">
          <p className="text-gray-500 text-sm">Total Solicitado</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">R$ 2.750,00</p>
        </div>
        <div className="card p-5 sm:p-6">
          <p className="text-gray-500 text-sm">Pendentes</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">2</p>
        </div>
        <div className="card p-5 sm:p-6">
          <p className="text-gray-500 text-sm">Processando</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">1</p>
        </div>
        <div className="card p-5 sm:p-6">
          <p className="text-gray-500 text-sm">Pagos (mês)</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">R$ 15.400,00</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filtrar por status:
          </span>
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

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Associado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Chave PIX</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {saquesFiltrados.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand whitespace-nowrap">{s.nome}</p>
                    <p className="text-sm text-gray-500">{s.cpf}</p>
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-brand whitespace-nowrap">
                    R$ {s.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono whitespace-nowrap">
                    {s.chavePix}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {s.dataSolicitacao}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === "solicitado"
                          ? "bg-yellow-100 text-yellow-800"
                          : s.status === "processando"
                            ? "bg-blue-100 text-blue-800"
                            : s.status === "pago"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.status === "solicitado" && <Clock className="w-3 h-3 mr-1" />}
                      {s.status === "processando" && <TrendingDown className="w-3 h-3 mr-1" />}
                      {s.status === "pago" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {s.status === "rejeitado" && <XCircle className="w-3 h-3 mr-1" />}
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {s.status === "solicitado" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="Aprovar saque"
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Rejeitar saque"
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
