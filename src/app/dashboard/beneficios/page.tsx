"use client";

import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { useMemberSession } from "@/hooks/useMemberSession";
import { effectiveMemberStatus, remainingCoverageDays } from "@/lib/member-status";
import { ArrowUpRight, Car, CheckCircle2, HeartPulse, Layers, PiggyBank, Scale, Stethoscope, TrendingUp } from "lucide-react";

const beneficios = [
  {
    icon: PiggyBank,
    tag: "Financeiro",
    title: "Economia (reserva)",
    desc: "Com depósitos diários de R$ 7,00 você constrói uma reserva para urgências, caução de locadora ou franquia de seguro.",
  },
  {
    icon: TrendingUp,
    tag: "Crédito",
    title: "Empréstimo subsidiado",
    desc: "Carência de 30 dias: cadastro há mais de 30 dias e permanência ativa no período. Apoio financeiro sujeito à análise do instituto.",
  },
  {
    icon: Stethoscope,
    tag: "Saúde",
    title: "Assistência odontológica",
    desc: "Descontos exclusivos em tratamentos odontológicos, conforme o procedimento realizado.",
  },
  {
    icon: Scale,
    tag: "Jurídico",
    title: "Assistência jurídica",
    desc: "Orientação em acidentes de trânsito e questões relacionadas às plataformas, além de consultas e direitos do motorista parceiro.",
  },
  {
    icon: Car,
    tag: "Veicular",
    title: "Carro reserva",
    desc: "Carência de 30 dias: cadastro há mais de 30 dias e permanência ativa no período. Acesso conforme as regras do benefício.",
  },
  {
    icon: HeartPulse,
    tag: "Recuperação",
    title: "Bônus Recuperação",
    desc: "Ajuda de custo de R$ 500,00 por semana, durante até 4 semanas, para acidente de trânsito com fratura e impedimento temporário de trabalho. Sujeito à confirmação da diretoria.",
  },
];

export default function BeneficiosDashboardPage() {
  const { member } = useMemberSession();
  const isActive = member ? effectiveMemberStatus(member) === "ativo" : false;
  const daysLeft = member ? remainingCoverageDays(member.coverageUntilDate) : 0;
  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="plan-banner">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-green-900 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs text-white/55">Seu clube de proteção</p>
            <p className="font-display text-xl sm:text-2xl font-semibold mt-1">Plano diário · R$ 7,00</p>
            {isActive && daysLeft > 1 ? (
              <p className="text-xs text-green-200/80 mt-1">{daysLeft} dias de cobertura restantes</p>
            ) : null}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-green-100">
          <CheckCircle2 className="w-4 h-4" />
          {isActive ? "6 benefícios disponíveis" : "Ative o cadastro para liberar benefícios"}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">Cobertura do associado</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight mt-1.5">Benefícios para cada momento</h2>
        <p className="text-sm text-ink-soft mt-1.5 max-w-2xl">Os serviços, benefícios e bônus são destinados a associados com cadastro ativo e seguem critérios próprios de análise.</p>
      </div>

      <div className="mb-5 rounded-2xl border border-green-100 bg-green-50/80 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700">Regulamento de acesso</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
          <li>Para ter acesso aos benefícios da plataforma, o parceiro precisa estar <strong className="font-semibold text-ink">ativo</strong>.</li>
          <li>A ativação é validada no momento do PIX de <strong className="font-semibold text-ink">R$ 7,00</strong> e vale pelo dia civil (até 24h / fim do dia em Brasília).</li>
          <li>É opcional antecipar ativações: o sistema cobre quantos dias o valor permitir (ex.: R$ 49,00 = 7 dias; o mesmo vale para um mês ou mais).</li>
        </ul>
      </div>

      {!isActive ? (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">Seu cadastro ainda não está ativo. Ative pelo PIX para solicitar benefícios e bônus.</p>
          <Link href="/dashboard/ativar-cadastro" className="btn-primary btn-sm shrink-0">Ativar cadastro</Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        {beneficios.map((b, index) => (
          <article key={b.title} className={`benefit-card min-h-[190px] flex-col justify-between ${index < 2 ? "xl:col-span-6" : "xl:col-span-4"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-green-700" strokeWidth={1.9} />
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-green-700">{b.tag}</span>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                {b.title === "Bônus Recuperação" && isActive ? <Link href="/dashboard/suporte" className="text-xs font-semibold text-green-700 hover:underline">Solicitar análise</Link> : <ArrowUpRight className="w-4 h-4 text-green-600 opacity-70" />}
              </div>
              <p className="text-[13px] text-ink-soft leading-relaxed mt-2 max-w-xl">{b.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
