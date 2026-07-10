import DashboardShell from "@/components/DashboardShell";
import { Car, Layers, PiggyBank, Scale, Stethoscope, TrendingUp } from "lucide-react";

const beneficios = [
  {
    icon: PiggyBank,
    title: "Economia (reserva)",
    desc: "Com depósitos diários de R$ 5,00 você constrói uma reserva para urgências, caução de locadora ou franquia de seguro.",
  },
  {
    icon: TrendingUp,
    title: "Empréstimo subsidiado",
    desc: "Apoio financeiro em condições especiais para associados ativos, sujeito à análise do instituto.",
  },
  {
    icon: Stethoscope,
    title: "Assistência odontológica",
    desc: "Cuidados odontológicos conforme as regras do plano de benefícios da associação.",
  },
  {
    icon: Scale,
    title: "Assistência jurídica",
    desc: "Orientação jurídica especializada para questões relacionadas à atividade do motorista parceiro.",
  },
  {
    icon: Car,
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
            <p className="text-xs text-ink-soft">Seus benefícios ativos</p>
            <p className="font-display text-base font-semibold">Plano diário · R$ 7,00</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {beneficios.map((b) => (
          <div key={b.title} className="benefit-card">
            <div className="w-[42px] h-[42px] rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <b.icon className="w-[19px] h-[19px] text-green-700" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">{b.title}</h4>
              <p className="text-[12.5px] text-ink-soft leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
