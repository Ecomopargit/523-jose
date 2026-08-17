"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, TrendingUp, WalletCards } from "lucide-react";

import DashboardShell from "@/components/DashboardShell";
import { useMemberSession } from "@/hooks/useMemberSession";
import { listMemberActivationPayments } from "@/lib/activation-store";
import type { ActivationPayment } from "@/lib/activation-constants";
import { brl } from "@/lib/dashboard-meta";

export default function ExtratoPage() {
  const { member, ready } = useMemberSession();
  const [payments, setPayments] = useState<ActivationPayment[]>([]);

  useEffect(() => {
    if (!ready || !member?.id) return;
    void listMemberActivationPayments(member.id).then(setPayments).catch(console.error);
  }, [member?.id, ready]);

  const approved = useMemo(() => payments.filter((item) => item.status === "approved"), [payments]);
  const total = approved.reduce((sum, item) => sum + item.amount, 0);
  const reserve = approved.reduce((sum, item) => sum + item.reserveAmount, 0);

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid sm:grid-cols-3 gap-4 mb-6 animate-fade-up">
        <div className="stat-card"><div className="icon-badge"><WalletCards /></div><p className="text-xs text-ink-soft">PIX aprovados</p><p className="font-display text-2xl font-semibold mt-1">{approved.length}</p></div>
        <div className="stat-card"><div className="icon-badge"><TrendingUp /></div><p className="text-xs text-ink-soft">Total pago</p><p className="font-mono-num text-xl font-semibold mt-1">{brl(total)}</p></div>
        <div className="stat-card"><div className="icon-badge"><CheckCircle2 /></div><p className="text-xs text-ink-soft">Crédito em reserva</p><p className="font-mono-num text-xl font-semibold mt-1 text-green-700">{brl(reserve)}</p></div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-line-soft"><h2 className="font-display text-lg font-semibold">Movimentações PIX</h2><p className="text-xs text-ink-soft mt-1">Pagamentos vinculados à sua conta</p></div>
        {payments.length === 0 ? <p className="p-8 text-center text-sm text-ink-soft">Nenhum PIX registrado.</p> : payments.map((item) => (
          <div key={item.id} className="txn-row border-t border-line-soft first:border-t-0">
            <div className="icon-badge mb-0 w-9 h-9">{item.status === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}</div>
            <div><p className="text-sm font-semibold">Ativação via PIX</p><p className="text-xs text-ink-soft mt-1">{new Date(item.createdAt).toLocaleString("pt-BR")}</p></div>
            <div className="hidden sm:block text-xs text-ink-soft text-right">reserva <b className="text-green-700">{brl(item.reserveAmount)}</b> · taxa {brl(item.feeAmount)}</div>
            <div className="text-right"><p className="font-mono-num font-semibold text-sm">{brl(item.amount)}</p><span className={item.status === "approved" ? "badge-confirmado" : "badge-pago"}>{item.status === "approved" ? "Confirmado" : "Pendente"}</span></div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
