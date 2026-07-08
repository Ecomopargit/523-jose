import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import {
  Wallet,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const dadosAssociado = {
  nome: "João Silva",
  saldoReserva: 1850.0,
  saldoBonus: 150.0,
  totalPagoMes: 210.0,
  status: "Ativo",
  indicacoesValidas: 3,
  codigoIndicacao: "JOAO2024",
};

const ultimasTransacoes = [
  { data: "15/01/2024", tipo: "Depósito", valor: 7.0, status: "Confirmado" },
  { data: "14/01/2024", tipo: "Depósito", valor: 7.0, status: "Confirmado" },
  { data: "13/01/2024", tipo: "Depósito", valor: 7.0, status: "Confirmado" },
  { data: "10/01/2024", tipo: "Bônus", valor: 150.0, status: "Pago" },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Meu Painel"
      subtitle={`Bem-vindo, ${dadosAssociado.nome}`}
      headerRight={
        <>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Código de Indicação</p>
            <p className="font-mono font-bold text-brand">
              {dadosAssociado.codigoIndicacao}
            </p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-bold">
            JS
          </div>
        </>
      }
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Disponível
            </span>
          </div>
          <p className="text-gray-500 text-sm">Saldo em Reserva</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            R$ {brl(dadosAssociado.saldoReserva)}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Este mês
            </span>
          </div>
          <p className="text-gray-500 text-sm">Total Pago</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            R$ {brl(dadosAssociado.totalPagoMes)}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Bônus
            </span>
          </div>
          <p className="text-gray-500 text-sm">Saldo de Bônus</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            R$ {brl(dadosAssociado.saldoBonus)}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Indicações
            </span>
          </div>
          <p className="text-gray-500 text-sm">Indicados Válidos</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            {dadosAssociado.indicacoesValidas}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Últimas transações */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand">Últimas Transações</h2>
            <Link
              href="/dashboard/extrato"
              className="text-sm text-brand hover:text-accent hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ultimasTransacoes.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {t.data}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{t.tipo}</td>
                    <td className="px-6 py-4 text-sm font-medium text-brand whitespace-nowrap">
                      R$ {t.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Solicitar Saque</h3>
            <p className="text-gray-300 text-sm mb-4">
              Saldo disponível: R$ {brl(dadosAssociado.saldoReserva)}
            </p>
            <Link href="/dashboard/saque" className="btn-accent btn-md w-full">
              Solicitar Agora
            </Link>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-brand mb-4">Indique e Ganhe</h3>
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Seu código de indicação</p>
              <p className="font-mono font-bold text-lg text-brand">
                {dadosAssociado.codigoIndicacao}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Indicados válidos:</span>
              <span className="font-bold text-accent">
                {dadosAssociado.indicacoesValidas}/3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Você já completou 3 indicações! Bônus liberado.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Lembrete</p>
              <p className="text-xs text-yellow-700 mt-1">
                Realize seu depósito diário de R$ 7,00 para manter sua reserva
                crescendo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
