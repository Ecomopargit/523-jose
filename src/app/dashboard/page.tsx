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
  Camera,
  ChevronRight,
  CircleDollarSign,
  Layers,
  PiggyBank,
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

  return (
    <DashboardShell>
      <p className="text-sm text-ink-soft mb-4 animate-fade-up">
        Olá, <span className="font-semibold text-ink">{primeiroNome}</span>
        {member?.email ? (
          <span className="text-ink-faint"> · {member.email}</span>
        ) : null}
      </p>

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
          <p className="font-mono-num font-display text-4xl sm:text-[38px] font-bold tracking-tight">
            {brl(dados.saldo).replace(",00", "")}
            <span className="text-[22px] opacity-70">,00</span>
          </p>
          <div className="status-pill">
            <span className="dot" />
            Cadastro pendente de ativação
          </div>
          <div className="mt-4">
            <Link href="/dashboard/ativar-cadastro" className="btn-hero">
              Ativar cadastro
              <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
        <DepositRing days={dados.diasSeguidos} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {[
          { icon: Layers, label: "Reserva/mês", value: brl(dados.reservaMensal) },
          { icon: TrendingUp, label: "Depósitos", value: String(dados.depositos) },
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 mb-5">
        <div className="card p-5 sm:p-6 flex gap-4 bg-gradient-to-br from-green-50 to-white">
          <div className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center shrink-0">
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

        <div className="card p-4 flex flex-col gap-2.5">
          <Link href="/dashboard/saque" className="shortcut-btn">
            <div className="icon-mini">
              <Banknote className="w-[15px] h-[15px] text-white" strokeWidth={2} />
            </div>
            Solicitar saque
          </Link>
          <Link href="/dashboard/pagamentos" className="shortcut-btn">
            <div className="icon-mini">
              <Camera className="w-[15px] h-[15px] text-white" strokeWidth={2} />
            </div>
            Envio de pagamento
          </Link>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
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
