import { 
  PiggyBank, 
  TrendingUp, 
  Stethoscope, 
  Scale, 
  Car, 
  ChevronRight,
  Shield,
  Clock,
  FileCheck
} from "lucide-react";
import Link from "next/link";

const beneficios = [
  {
    icon: PiggyBank,
    title: "Reserva Financeira",
    description: "Com depósitos diários de R$ 7,00, o associado acumula R$ 5,00 por dia em sua reserva pessoal.",
    color: "bg-brand",
    features: [
      "Acúmulo diário de R$ 5,00",
      "Reserva disponível para saque",
      "Saldo acompanhado em tempo real",
      "Histórico completo de transações"
    ]
  },
  {
    icon: TrendingUp,
    title: "Empréstimo Subsidiado",
    description: "Acesso a apoio financeiro em condições especiais, sujeito à análise interna.",
    color: "bg-accent",
    features: [
      "Taxas reduzidas para associados",
      "Análise rápida de crédito",
      "Parcelamento flexível",
      "Sem burocracia excessiva"
    ]
  },
  {
    icon: Stethoscope,
    title: "Assistência Odontológica",
    description: "Suporte para cuidados odontológicos conforme regras do plano da associação.",
    color: "bg-brand",
    features: [
      "Consultas preventivas",
      "Tratamentos básicos",
      "Rede credenciada",
      "Atendimento em emergências"
    ]
  },
  {
    icon: Scale,
    title: "Assistência Jurídica",
    description: "Orientação e apoio jurídico ao associado em situações relacionadas à sua atividade.",
    color: "bg-accent",
    features: [
      "Consultas jurídicas",
      "Assessoria em contratos",
      "Defesa em processos trabalhistas",
      "Orientação sobre direitos"
    ]
  },
  {
    icon: Car,
    title: "Seguro da Franquia",
    description: "Em caso de sinistro, o associado paga uma taxa reduzida e o instituto cobre o valor da franquia.",
    color: "bg-brand",
    features: [
      "Cobertura do valor da franquia",
      "Taxa reduzida em sinistros",
      "Processo simplificado",
      "Preservação da reserva"
    ]
  },
  {
    icon: Shield,
    title: "Indique e Ganhe",
    description: "Indique 3 novos parceiros e ganhe R$ 150,00 de bônus na sua conta.",
    color: "bg-accent",
    features: [
      "R$ 150,00 a cada 3 indicações",
      "Bônus creditado na conta",
      "Acompanhamento de indicados",
      "Link personalizado de indicação"
    ]
  }
];

export default function BeneficiosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Nossos Benefícios</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Conheça todas as vantagens de ser um associado ECOMOPAR. 
              Benefícios pensados exclusivamente para o motorista autônomo.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {beneficios.map((beneficio, index) => (
              <div 
                key={index}
                className="bg-surface rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-14 h-14 ${beneficio.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <beneficio.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand">{beneficio.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {beneficio.description}
                </p>
                <ul className="space-y-3">
                  {beneficio.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <FileCheck className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Acessar */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Processo Simples</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand mt-3">
              Como acessar os benefícios
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h4 className="font-bold text-brand mb-2">Cadastre-se</h4>
              <p className="text-gray-600 text-sm">Preencha o formulário de associação com seus dados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h4 className="font-bold text-brand mb-2">Aguarde Aprovação</h4>
              <p className="text-gray-600 text-sm">Nossa equipe analisa seu cadastro em até 48h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h4 className="font-bold text-brand mb-2">Ative sua Conta</h4>
              <p className="text-gray-600 text-sm">Realize seu primeiro depósito e comece a acumular</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h4 className="font-bold text-brand mb-2">Aproveite</h4>
              <p className="text-gray-600 text-sm">Acesse todos os benefícios disponíveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-brand mb-6">
            Não perca mais tempo
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo a construir sua reserva financeira e tenha acesso 
            a todos esses benefícios exclusivos para motoristas autônomos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/associar-se"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand to-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <span>Associar-se Agora</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
