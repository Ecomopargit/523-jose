"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import {
  Users,
  CheckCircle,
  Share2,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";

const indicados = [
  { nome: "Carlos Silva", email: "carlos@email.com", status: "convertido", data: "10/01/2024" },
  { nome: "Ana Maria", email: "ana@email.com", status: "convertido", data: "08/01/2024" },
  { nome: "Pedro Costa", email: "pedro@email.com", status: "convertido", data: "05/01/2024" },
  { nome: "Mariana Lima", email: "mariana@email.com", status: "pendente", data: "15/01/2024" },
  { nome: "João Pedro", email: "joao@email.com", status: "pendente", data: "14/01/2024" },
];

export default function IndicacoesPage() {
  const codigoIndicacao = "JOAO2024";
  const linkIndicacao = `https://ecomopar.org/associar-se?ref=${codigoIndicacao}`;
  const [copied, setCopied] = useState<"codigo" | "link" | null>(null);

  const copy = async (value: string, which: "codigo" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <DashboardShell title="Minhas Indicações" showBack backHref="/dashboard">
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { icon: Users, bg: "bg-blue-100", fg: "text-blue-600", label: "Total Indicados", value: "5", valueColor: "text-brand" },
          { icon: CheckCircle, bg: "bg-green-100", fg: "text-green-600", label: "Convertidos", value: "3", valueColor: "text-brand" },
          { icon: TrendingUp, bg: "bg-yellow-100", fg: "text-yellow-600", label: "Bônus Liberado", value: "R$ 150,00", valueColor: "text-accent" },
          { icon: Share2, bg: "bg-purple-100", fg: "text-purple-600", label: "Pendentes", value: "2", valueColor: "text-brand" },
        ].map((c, i) => (
          <div key={i} className="card p-5 sm:p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.bg}`}>
              <c.icon className={`w-6 h-6 ${c.fg}`} />
            </div>
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${c.valueColor}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Código de indicação */}
      <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 sm:p-8 text-white mb-8">
        <h2 className="text-xl font-bold mb-6">Seu Código de Indicação</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 text-sm mb-2">Código</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 rounded-xl px-5 py-4 font-mono text-xl sm:text-2xl truncate">
                {codigoIndicacao}
              </div>
              <button
                type="button"
                onClick={() => copy(codigoIndicacao, "codigo")}
                aria-label="Copiar código"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {copied === "codigo" ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm mb-2">Link de Indicação</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 rounded-xl px-5 py-4 text-sm truncate">
                {linkIndicacao}
              </div>
              <button
                type="button"
                onClick={() => copy(linkIndicacao, "link")}
                aria-label="Copiar link"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {copied === "link" ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de indicados */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-brand">Seus Indicados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {indicados.map((ind, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-brand whitespace-nowrap">
                    {ind.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{ind.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {ind.data}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        ind.status === "convertido"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ind.status === "convertido" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Convertido
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" /> Pendente
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
