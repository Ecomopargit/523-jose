import DashboardShell from "@/components/DashboardShell";
import { TrendingUp, Lock, Info } from "lucide-react";

export default function SaldoPage() {
  return (
    <DashboardShell title="Meu Saldo">
      {/* Cards de saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Disponível</span>
          </div>
          <p className="text-sm opacity-80">Saldo em Reserva</p>
          <p className="text-3xl sm:text-4xl font-bold">R$ 1.850,00</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Lock className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Bloqueado</span>
          </div>
          <p className="text-sm opacity-80">Saldo Bloqueado</p>
          <p className="text-3xl sm:text-4xl font-bold">R$ 0,00</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Bônus</span>
          </div>
          <p className="text-sm opacity-80">Saldo de Bônus</p>
          <p className="text-3xl sm:text-4xl font-bold">R$ 150,00</p>
        </div>
      </div>

      {/* Detalhamento */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-brand mb-6">
          Detalhamento dos Saldos
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-brand">Reserva Principal</p>
                <p className="text-sm text-gray-500">
                  Valor acumulado dos depósitos diários
                </p>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-600 whitespace-nowrap">
              R$ 1.700,00
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-brand">Bônus de Indicação</p>
                <p className="text-sm text-gray-500">
                  Ganhos do programa Indique e Ganhe
                </p>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-purple-600 whitespace-nowrap">
              R$ 150,00
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-brand">Saldo Bloqueado</p>
                <p className="text-sm text-gray-500">
                  Valor em período de carência
                </p>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-600 whitespace-nowrap">
              R$ 0,00
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Informação sobre saques
            </p>
            <p className="text-sm text-blue-700 mt-1">
              O saldo em reserva pode ser solicitado para saque a qualquer
              momento, desde que não haja bloqueios ativos. O prazo de
              processamento é de até 3 dias úteis.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
