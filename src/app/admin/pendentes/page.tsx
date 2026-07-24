"use client";

import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { useAdminSession } from "@/hooks/useAdminSession";
import { initialsFromName, updateMemberAdmin, vehicleLabel } from "@/lib/member-store";
import { CheckCircle, XCircle } from "lucide-react";

export default function PendentesPage() {
  const { members, refresh } = useAdminSession();
  const pendentes = members.filter((m) => m.status === "pendente");

  const setStatus = async (id: string, status: "ativo" | "bloqueado") => {
    await updateMemberAdmin(id, { status });
    await refresh();
  };

  return (
    <AdminShell
      title="Cadastros pendentes"
      subtitle={`${pendentes.length} aguardando aprovação`}
    >
      {pendentes.length === 0 ? (
        <div className="card p-10 text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <p className="font-display font-semibold mb-1">Fila limpa</p>
          <p className="text-sm text-ink-soft mb-5">Não há cadastros pendentes no momento.</p>
          <Link href="/admin/associados" className="btn-primary btn-md">
            Ver associados
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pendentes.map((m) => (
            <div key={m.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center shrink-0">
                  {initialsFromName(m.nome)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">{m.nome}</p>
                  <p className="text-[12.5px] text-ink-soft truncate">
                    {m.email} · {m.telefone}
                  </p>
                  <p className="text-[12px] text-ink-faint mt-0.5 truncate">
                    {vehicleLabel(m)} · {m.cidade}/{m.estado} ·{" "}
                    {new Date(m.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => setStatus(m.id, "ativo")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar
                </button>
                <button
                  type="button"
                  className="btn-outline btn-sm text-brick-600"
                  onClick={() => setStatus(m.id, "bloqueado")}
                >
                  <XCircle className="w-4 h-4" />
                  Bloquear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
