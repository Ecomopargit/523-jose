"use client";

import Image from "next/image";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import DepositRing from "@/components/DepositRing";
import { useMemberSession } from "@/hooks/useMemberSession";
import { brl } from "@/lib/dashboard-meta";
import { LOGO_WATERMARK } from "@/lib/logo";
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  CircleDollarSign,
  Layers,
  MessageCircle,
  PiggyBank,
  QrCode,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";

const dados = {
  saldo: 0,
  reservaMensal: 0,
  depositos: 0,
  diasSeguidos: 0,
};

export default function DashboardPage() {
  const { member } = useMemberSession();
  const primeiroNome = member?.nome?.trim().split(/\s+/)[0] ?? "Associado";
  const isActive = member?.status === "ativo";
  const saldo = member?.saldoDisponivel ?? dados.saldo;
  const depositos = member?.depositosCount ?? dados.depositos;

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 animate-fade-up">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">Visão geral</p>
          <h2 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight mt-1">Olá, {primeiroNome}</h2>
          <p className="text-sm text-ink-soft mt-1">Acompanhe sua reserva e os benefícios da sua associação.</p>
        </div>
        {member?.email ? (
          <span className="text-xs text-ink-soft bg-white border border-line-soft rounded-full px-3.5 py-2 shadow-sm">{member.email}</span>
        ) : null}
      </div>

      <div className="dash-hero animate-fade-up">
        <Image
          src={LOGO_WATERMARK}
          alt=""
          width={320}
          height={320}
          className="dash-hero-logo"
          aria-hidden
          unoptimized
          priority={false}
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-white/55 font-semibold mb-2.5">
            Saldo atual
          </p>
          <p className="font-mono-num font-display text-4xl sm:text-[46px] font-bold tracking-[-0.05em]">
            {brl(saldo).replace(",00", "")}
            <span className="text-[22px] opacity-70">,00</span>
          </p>
          <div className="status-pill">
            <span className="dot" />
            {isActive ? "Cadastro ativo" : "Cadastro pendente de ativação"}
          </div>
          {!isActive ? (
            <div className="mt-4">
              <Link href="/dashboard/ativar-cadastro" className="btn-hero">
                Ativar cadastro
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Link>
            </div>
          ) : null}
        </div>
        <DepositRing days={dados.diasSeguidos} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Layers, label: "Reserva/mês", value: brl(dados.reservaMensal) },
          { icon: TrendingUp, label: "Depósitos", value: String(depositos) },
          { icon: Star, label: "Benefícios", value: "5 ativos" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="icon-badge">
              <s.icon strokeWidth={2} />
            </div>
            <p className="text-[12.5px] text-ink-soft mb-1">{s.label}</p>
            <p className="font-mono-num font-display text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_.75fr] gap-5 mb-6">
        <div className="card p-6 sm:p-8 flex gap-5 bg-gradient-to-br from-green-50 to-white">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center shrink-0 shadow-sm">
            <PiggyBank className="w-5 h-5 text-green-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-[15px] font-semibold mb-1.5">
              Sua reserva cresce todo dia
            </h3>
            <p className="text-[13.5px] text-ink-soft leading-relaxed">
              Com depósitos diários via PIX, você constrói uma reserva pessoal para imprevistos,
              caução ou franquia de seguro.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="text-[12.5px]">
                <b className="font-mono-num block text-sm">R$ 7,00</b>
                contribuição/dia
              </div>
              <div className="text-[12.5px]">
                <b className="font-mono-num block text-sm text-green-700">R$ 5,00</b>
                vai pra reserva
              </div>
              <div className="text-[12.5px]">
                <b className="font-mono-num block text-sm text-ink-faint">R$ 2,00</b>
                taxa admin
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-5 flex flex-col justify-center gap-3">
          <Link href="/dashboard/saque" className="shortcut-btn">
            <div className="icon-mini">
              <Banknote className="w-[15px] h-[15px] text-white" strokeWidth={2} />
            </div>
            Solicitar saque
          </Link>
          <Link href="/dashboard/pagamentos" className="shortcut-btn">
            <div className="icon-mini">
              <QrCode className="w-[15px] h-[15px] text-white" strokeWidth={2} />
            </div>
            Pagamentos
          </Link>
          <Link href="/dashboard/suporte" className="shortcut-btn">
            <div className="icon-mini">
              <MessageCircle className="w-[15px] h-[15px] text-white" strokeWidth={2} />
            </div>
            Suporte
          </Link>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="section-title mb-0">Seus benefícios ECOMOPAR</h3>
          <Link
            href="/dashboard/beneficios"
            className="text-[12.5px] text-green-700 font-semibold flex items-center gap-1 hover:underline"
          >
            Ver todos <ChevronRight className="w-3 h-3" strokeWidth={2.4} />
          </Link>
        </div>
        {[
          {
            icon: Shield,
            title: "Economia (reserva)",
            desc: "Depósitos diários viram reserva pessoal",
          },
          {
            icon: CircleDollarSign,
            title: "Empréstimo subsidiado",
            desc: "Condições especiais para associados ativos",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 py-2.5 border-t border-line-soft first:border-t-0"
          >
            <div className="icon-badge mb-0 w-[30px] h-[30px]">
              <b.icon className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold">{b.title}</p>
              <p className="text-xs text-ink-soft">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
