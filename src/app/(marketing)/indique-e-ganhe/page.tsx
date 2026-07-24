import { 
  Gift, 
  Users, 
  Share2, 
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function IndiqueEGanhePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Gift className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Programa de Indicação</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Indique e Ganhe <span className="text-accent">R$ 150,00</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Participe do plano de alavancagem da ECOMOPAR. Indique novos parceiros 
              e ganhe bônus em dinheiro.
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Passo a Passo</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand mt-3">
              Como funciona o programa
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Share2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">1. Compartilhe</h3>
              <p className="text-gray-600">
                Envie seu código de indicação ou link personalizado para amigos 
                e conhecidos que são motoristas autônomos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">2. Eles se Associam</h3>
              <p className="text-gray-600">
                Seus indicados fazem o cadastro, são aprovados e começam a 
                contribuir ativamente na ECOMOPAR.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">3. Você Ganha</h3>
              <p className="text-gray-600">
                Ao completar 3 indicações válidas, você recebe R$ 150,00 
                de bônus direto na sua conta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regras e Condições */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Regras */}
            <div>
              <h2 className="text-3xl font-bold text-brand mb-8">
                Regras da Campanha
              </h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Indicação Válida</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      O indicado deve ser aprovado, ativar a conta e realizar 
                      pelo menos 30 dias de contribuição.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Bônus por 3 Indicações</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      A cada 3 indicações válidas completadas, você recebe R$ 150,00.
                      Não há limite de indicações!
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Crédito Automático</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      O bônus é creditado automaticamente na sua conta assim 
                      que as 3 indicações forem validadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviso Importante */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <h3 className="text-2xl font-bold text-yellow-800">Importante</h3>
              </div>
              <div className="space-y-4 text-yellow-900">
                <p className="font-semibold">
                  Ao aderir à campanha de indicação, o associado fica sujeito 
                  a um período de carência para saques.
                </p>
                <div className="bg-white/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <span className="font-bold">Bloqueio de Saque: 90 dias</span>
                  </div>
                  <p className="text-sm">
                    O associado só poderá solicitar saque após 90 dias da 
                    ativação da campanha de indicação.
                  </p>
                </div>
                <p className="text-sm">
                  Este período de carência é necessário para garantir a 
                  sustentabilidade do programa e evitar fraudes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulação de Ganhos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Potencial de Ganhos</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand mt-3">
              Quanto você pode ganhar?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { indicacoes: "3", bonus: "R$ 150,00", color: "from-brand to-brand-dark" },
              { indicacoes: "6", bonus: "R$ 300,00", color: "from-accent to-brand-dark" },
              { indicacoes: "9", bonus: "R$ 450,00", color: "from-brand to-brand-dark" },
              { indicacoes: "12", bonus: "R$ 600,00", color: "from-accent to-brand-dark" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white`}>
                  <div className="text-sm opacity-80 mb-2">{item.indicacoes} indicações</div>
                  <div className="text-3xl font-bold">{item.bonus}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Não há limite de indicações! Quanto mais motoristas você indicar, mais você ganha.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Gift className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Comece a indicar e ganhar hoje mesmo
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Faça parte do programa de indicação da ECOMOPAR e transforme 
            sua rede de contatos em renda extra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastrar"
              className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-[brand-dark] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <span>Cadastrar-se</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
