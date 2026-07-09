import DashboardShell from "@/components/DashboardShell";
import { PiggyBank, TrendingUp, Stethoscope, Scale, Car, Sparkles } from "lucide-react";

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
    desc: "Orientação jurídica em situações relacionadas à sua atividade como motorista autônomo.",
  },
  {
    icon: Car,
    title: "Seguro da franquia",
    desc: "Em caso de sinistro, você paga uma taxa reduzida e o instituto cobre o valor da franquia para preservar sua reserva.",
  },
];

export default function BeneficiosDashboardPage() {
  return (
    <DashboardShell title="Clube de benefícios" showBack backHref="/dashboard">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted">Seus benefícios ativos</p>
          <p className="font-bold text-brand">Plano diário R$ 7,00</p>
        </div>
      </div>

      <div className="space-y-4">
        {beneficios.map((b) => (
          <div key={b.title} className="card p-5 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
              <b.icon className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-brand mb-1">{b.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
