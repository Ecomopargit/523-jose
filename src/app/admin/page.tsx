"use client";

import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { useAdminSession } from "@/hooks/useAdminSession";
import { brl } from "@/lib/dashboard-meta";
import { initialsFromName, updateMemberAdmin } from "@/lib/member-store";
import {
  Users,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Shield,
} from "lucide-react";

export default function AdminPage() {
  const { stats, refresh } = useAdminSession();

  const approve = async (id: string) => {
    await updateMemberAdmin(id, { status: "ativo" });
    await refresh();
  };

  return (
    <AdminShell title="Dashboard" subtitle="Visão geral dos associados e reservas">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {[
          {
            icon: Users,
            label: "Total cadastrados",
            value: String(stats.total),
            hint: stats.novosHoje > 0 ? `+${stats.novosHoje} hoje` : "Cadastros",
          },
          {
            icon: CheckCircle,
            label: "Ativos",
            value: String(stats.ativos),
            hint: "Liberados",
          },
          {
            icon: Clock,
            label: "Pendentes",
            value: String(stats.pendentes),
            hint: "Aguardando análise",
          },
          {
            icon: AlertCircle,
            label: "Inadimplentes",
            value: String(stats.inadimplentes),
            hint: "Atenção",
          },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <div className="icon-badge">
              <c.icon strokeWidth={2} />
            </div>
            <p className="text-[12.5px] text-ink-soft mb-1">{c.label}</p>
            <p className="font-display font-mono-num text-xl font-semibold">{c.value}</p>
            <p className="text-[11px] text-ink-faint mt-1">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3.5 mb-6">
        <div className="bal-card avail">
          <p className="text-xs opacity-75 mb-1 relative z-[1]">Total em reservas</p>
          <p className="font-display font-mono-num text-2xl font-bold relative z-[1]">
            {brl(stats.totalReserva)}
          </p>
        </div>
        <div className="bal-card locked">
          <p className="text-xs opacity-75 mb-1 relative z-[1]">Total bloqueado</p>
          <p className="font-display font-mono-num text-2xl font-bold relative z-[1]">
            {brl(stats.totalBloqueado)}
          </p>
        </div>
        <div className="bal-card bonus">
          <p className="text-xs opacity-75 mb-1 relative z-[1]">Total bônus</p>
          <p className="font-display font-mono-num text-2xl font-bold relative z-[1]">
            {brl(stats.totalBonus)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-line-soft flex items-center justify-between">
            <h2 className="font-display font-semibold text-[15px]">Últimos cadastros</h2>
            <Link href="/admin/associados" className="text-[12.5px] font-semibold text-green-700 hover:underline">
              Ver todos
            </Link>
          </div>
          {stats.recentes.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-soft">
              Ainda não há cadastros. Peça para alguém se registrar em /cadastrar.
            </div>
          ) : (
            <div className="divide-y divide-line-soft">
              {stats.recentes.map((m) => (
                <div key={m.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {initialsFromName(m.nome)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.nome}</p>
                      <p className="text-[12px] text-ink-soft truncate">{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-ink-faint capitalize">{m.status}</p>
                    <p className="text-[12px] text-ink-soft">
                      {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-green-700" />
              <h3 className="font-display font-semibold text-[15px]">Resumo rápido</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Bloqueados</span>
                <span className="font-semibold">{stats.bloqueados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Depósitos registrados</span>
                <span className="font-semibold font-mono-num">{stats.totalDepositos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">PIX aprovados</span>
                <span className="font-semibold font-mono-num">{stats.pagamentosAprovados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Receita administrativa</span>
                <span className="font-semibold font-mono-num text-green-700">{brl(stats.totalReceitaAdmin)}</span>
              </div>
              <div className="flex justify-between border-t border-line-soft pt-2.5">
                <span className="text-ink-soft">Patrimônio sob custódia</span>
                <span className="font-semibold font-mono-num text-green-700">
                  {brl(stats.totalReserva + stats.totalBloqueado + stats.totalBonus)}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <h3 className="font-display font-semibold text-[15px]">Aprovar pendentes</h3>
            </div>
            {stats.pendentes === 0 ? (
              <p className="text-sm text-ink-soft">Nenhum cadastro pendente.</p>
            ) : (
              <div className="space-y-2">
                {stats.recentes
                  .filter((m) => m.status === "pendente")
                  .slice(0, 4)
                  .map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-2 rounded-[12px] bg-green-50 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{m.nome}</p>
                        <p className="text-[11px] text-ink-soft truncate">{m.email}</p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary btn-sm shrink-0 !min-h-0 !py-1.5 !px-3 text-xs"
                        onClick={() => approve(m.id)}
                      >
                        Ativar
                      </button>
                    </div>
                  ))}
                <Link href="/admin/pendentes" className="block text-center text-[12.5px] font-semibold text-green-700 pt-1 hover:underline">
                  Ver todos os pendentes
                </Link>
              </div>
            )}
          </div>

          <Link href="/admin/associados" className="btn-primary btn-md w-full">
            <DollarSign className="w-4 h-4" />
            Gerenciar associados
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
