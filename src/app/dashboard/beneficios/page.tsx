import DashboardShell from "@/components/DashboardShell";
import { ArrowUpRight, Car, CheckCircle2, Layers, PiggyBank, Scale, Stethoscope, TrendingUp } from "lucide-react";

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
    desc: "Apoio financeiro em condições especiais para associados ativos, sujeito à análise do instituto.",
  },
  {
    icon: Stethoscope,
    tag: "Saúde",
    title: "Assistência odontológica",
    desc: "Cuidados odontológicos conforme as regras do plano de benefícios da associação.",
  },
  {
    icon: Scale,
    tag: "Jurídico",
    title: "Assistência jurídica",
    desc: "Orientação jurídica especializada para questões relacionadas à atividade do motorista parceiro.",
  },
  {
    icon: Car,
    tag: "Veicular",
    title: "Seguro da franquia",
    desc: "Em caso de sinistro, você paga uma taxa reduzida e o instituto cobre o valor da franquia.",
  },
];

export default function BeneficiosDashboardPage() {
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
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-green-100">
          <CheckCircle2 className="w-4 h-4" />
          5 benefícios ativos
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">Cobertura do associado</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight mt-1.5">Benefícios para cada momento</h2>
        <p className="text-sm text-ink-soft mt-1.5 max-w-2xl">Uma rede de apoio que combina segurança financeira, cuidado e assistência para a rotina do motorista.</p>
      </div>

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
                <ArrowUpRight className="w-4 h-4 text-green-600 opacity-70" />
              </div>
              <p className="text-[13px] text-ink-soft leading-relaxed mt-2 max-w-xl">{b.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
