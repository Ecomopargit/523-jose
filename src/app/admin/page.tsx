import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const dadosAdmin = {
  totalAssociados: 1250,
  associadosAtivos: 980,
  pendentes: 45,
  inadimplentes: 225,
  totalArrecadado: 875000.0,
  totalReserva: 625000.0,
  totalAdministrativo: 250000.0,
  totalSaques: 125000.0,
  totalBonus: 45000.0,
  saquesPendentes: 12,
};

const ultimasAtividades = [
  { tipo: "cadastro", mensagem: "Novo associado cadastrado: Maria Santos", hora: "10 min atrás" },
  { tipo: "pagamento", mensagem: "Pagamento confirmado: João Silva", hora: "15 min atrás" },
  { tipo: "saque", mensagem: "Saque solicitado: Pedro Costa - R$ 500,00", hora: "30 min atrás" },
  { tipo: "indicacao", mensagem: "Bônus liberado: Ana Paula - R$ 150,00", hora: "1 hora atrás" },
];

const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export default function AdminPage() {
  return (
    <AdminShell
      title="Dashboard"
      subtitle="Visão geral do sistema"
      headerRight={
        <div className="w-11 h-11 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center text-white font-bold">
          AD
        </div>
      }
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +5 hoje
            </span>
          </div>
          <p className="text-gray-500 text-sm">Total de Associados</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            {dadosAdmin.totalAssociados}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Ativos</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            {dadosAdmin.associadosAtivos}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              Ação
            </span>
          </div>
          <p className="text-gray-500 text-sm">Pendentes</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            {dadosAdmin.pendentes}
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Inadimplentes</p>
          <p className="text-xl sm:text-2xl font-bold text-brand">
            {dadosAdmin.inadimplentes}
          </p>
        </div>
      </div>

      {/* Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white">
          <TrendingUp className="w-8 h-8 opacity-80 mb-4" />
          <p className="text-gray-300 text-sm">Total Arrecadado</p>
          <p className="text-2xl sm:text-3xl font-bold">
            R$ {brl(dadosAdmin.totalArrecadado)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <DollarSign className="w-8 h-8 opacity-80 mb-4" />
          <p className="text-gray-100 text-sm">Total em Reservas</p>
          <p className="text-2xl sm:text-3xl font-bold">
            R$ {brl(dadosAdmin.totalReserva)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <TrendingDown className="w-8 h-8 opacity-80 mb-4" />
          <p className="text-gray-100 text-sm">Total em Saques</p>
          <p className="text-2xl sm:text-3xl font-bold">
            R$ {brl(dadosAdmin.totalSaques)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Ações pendentes + atividades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-brand">Ações Pendentes</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-brand">Cadastros para Aprovação</p>
                    <p className="text-sm text-gray-500">
                      {dadosAdmin.pendentes} aguardando análise
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/pendentes"
                  className="text-brand hover:text-accent hover:underline text-sm font-medium whitespace-nowrap"
                >
                  Ver todos
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-brand">Saques Pendentes</p>
                    <p className="text-sm text-gray-500">
                      {dadosAdmin.saquesPendentes} solicitações
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/saques"
                  className="text-brand hover:text-accent hover:underline text-sm font-medium whitespace-nowrap"
                >
                  Ver todos
                </Link>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-brand">Últimas Atividades</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {ultimasAtividades.map((a, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        a.tipo === "cadastro"
                          ? "bg-blue-500"
                          : a.tipo === "pagamento"
                            ? "bg-green-500"
                            : a.tipo === "saque"
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                      }`}
                    />
                    <p className="text-sm text-gray-700 truncate">{a.mensagem}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {a.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo rápido */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-brand mb-4">Resumo Financeiro</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Administrativo</span>
                <span className="font-medium">
                  R$ {dadosAdmin.totalAdministrativo.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bônus Pagos</span>
                <span className="font-medium">
                  R$ {dadosAdmin.totalBonus.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="font-medium text-brand">Saldo Geral</span>
                  <span className="font-bold text-accent">
                    R${" "}
                    {(
                      dadosAdmin.totalArrecadado - dadosAdmin.totalSaques
                    ).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/admin/relatorios" className="btn-primary btn-md w-full">
            Ver Relatórios Completos
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
