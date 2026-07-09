import { 
  Wallet, 
  PiggyBank, 
  Settings, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Como Funciona</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Entenda o modelo ECOMOPAR de forma simples e transparente. 
              Veja como sua reserva cresce a cada dia.
            </p>
          </div>
        </div>
      </section>

      {/* Explicação Principal */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">O Modelo</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand mt-3">
              Como acontece sua contribuição
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Passo 1 */}
            <div className="bg-gradient-to-br from-[#F5F7FA] to-white rounded-2xl p-8 border border-gray-100 text-center relative">
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand mb-3">Depósito Diário</h3>
              <p className="text-gray-600 mb-4">
                Você realiza um depósito diário de <strong className="text-brand">R$ 7,00</strong> via PIX
              </p>
              <div className="text-3xl font-bold text-brand">R$ 7,00</div>
              <div className="text-sm text-gray-500">por dia</div>
            </div>

            {/* Seta */}
            <div className="hidden lg:flex justify-center">
              <ArrowRight className="w-12 h-12 text-accent" />
            </div>

            {/* Divisão */}
            <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 text-center">Distribuição</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <PiggyBank className="w-6 h-6 text-accent" />
                    <span>Sua Reserva</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">R$ 5,00</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6 text-gray-300" />
                    <span>Administrativo</span>
                  </div>
                  <span className="text-2xl font-bold">R$ 2,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo Prático */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Simulação</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand mt-3">
              Exemplo prático
            </h2>
            <p className="text-gray-600 mt-4">
              Veja quanto você pode acumular ao longo do tempo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-2">Em 30 dias</div>
              <div className="text-4xl font-bold text-brand mb-2">R$ 150,00</div>
              <div className="text-sm text-gray-600">acumulados na reserva</div>
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                Total contribuído: R$ 210,00
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm text-center border-2 border-accent">
              <div className="text-sm text-gray-500 mb-2">Em 6 meses</div>
              <div className="text-4xl font-bold text-accent mb-2">R$ 900,00</div>
              <div className="text-sm text-gray-600">acumulados na reserva</div>
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                Total contribuído: R$ 1.260,00
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-2">Em 1 ano</div>
              <div className="text-4xl font-bold text-brand mb-2">R$ 1.800,00</div>
              <div className="text-sm text-gray-600">acumulados na reserva</div>
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                Total contribuído: R$ 2.520,00
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-brand mb-6 text-center">
              Fluxo Completo
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "1", text: "Associado faz depósito de R$ 7,00 via PIX" },
                { step: "2", text: "R$ 5,00 vão para reserva pessoal" },
                { step: "3", text: "R$ 2,00 para custeio administrativo" },
                { step: "4", text: "Reserva fica disponível na conta" },
                { step: "5", text: "Saque conforme regras da associação" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regras Importantes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-brand mb-6">
                Regras Importantes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Saque da Reserva</h4>
                    <p className="text-gray-600 text-sm">
                      O saque da reserva pode ser solicitado conforme as regras da associação, 
                      mediante análise e aprovação.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Bloqueio de 90 Dias</h4>
                    <p className="text-gray-600 text-sm">
                      Associados participantes da campanha de indicação têm bloqueio de saque 
                      por 90 dias após ativação da campanha.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand">Transparência Total</h4>
                    <p className="text-gray-600 text-sm">
                      Todo o histórico de contribuições e saldo está disponível 
                      na área do associado em tempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Perguntas Frequentes</h3>
              <div className="space-y-4">
                <div className="border-b border-white/20 pb-4">
                  <h4 className="font-semibold mb-2">Como faço o depósito?</h4>
                  <p className="text-gray-300 text-sm">
                    Via PIX, utilizando a chave fornecida após a aprovação do cadastro.
                  </p>
                </div>
                <div className="border-b border-white/20 pb-4">
                  <h4 className="font-semibold mb-2">Posso fazer depósitos maiores?</h4>
                  <p className="text-gray-300 text-sm">
                    O modelo é de R$ 7,00 por dia, mas você pode fazer adiantamentos 
                    de múltiplos dias.
                  </p>
                </div>
                <div className="border-b border-white/20 pb-4">
                  <h4 className="font-semibold mb-2">E se eu não fizer o depósito?</h4>
                  <p className="text-gray-300 text-sm">
                    O depósito é diário. Dias sem depósito não geram acúmulo na reserva.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quando posso sacar?</h4>
                  <p className="text-gray-300 text-sm">
                    Após análise e cumprimento das regras de carência quando aplicável.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand mb-6">
            Comece a construir sua reserva hoje
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Com apenas R$ 7,00 por dia, você cria uma reserva financeira e 
            ainda tem acesso a benefícios exclusivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/associar-se"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand to-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <span>Quero me Associar</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
