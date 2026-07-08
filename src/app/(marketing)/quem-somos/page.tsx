import { Target, Eye, Heart, CheckCircle } from "lucide-react";

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0E3A5D] to-[#1a5a3d] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Quem Somos</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Conheça a ECOMOPAR, o instituto dedicado a proteger e apoiar 
              o motorista autônomo em sua jornada.
            </p>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#1FA35B] font-semibold text-sm uppercase tracking-wider">Nossa História</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0E3A5D] mt-3 mb-6">
                ECOMOPAR – Instituto de Apoio ao Motorista Autônomo
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A ECOMOPAR nasceu para dar suporte, visibilidade e segurança ao motorista autônomo, 
                  uma categoria que cresce a cada dia e que muitas vezes não encontra o amparo 
                  necessário nos modelos tradicionais.
                </p>
                <p>
                  Nosso objetivo é oferecer soluções práticas para ajudar o associado a construir 
                  sua reserva financeira, enfrentar imprevistos e ter acesso a benefícios importantes 
                  para o seu dia a dia.
                </p>
                <p>
                  Entendemos os desafios enfrentados por quem vive da direção: longas jornadas, 
                  imprevistos mecânicos, necessidade de apoio jurídico e a constante preocupação 
                  com a renda. Por isso, criamos um modelo que realmente funciona para o motorista.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0E3A5D] to-[#1FA35B] rounded-3xl p-1">
                <div className="bg-white rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-[#F5F7FA] rounded-2xl">
                      <div className="text-4xl font-bold text-[#0E3A5D]">+5k</div>
                      <div className="text-sm text-gray-600 mt-1">Associados</div>
                    </div>
                    <div className="text-center p-4 bg-[#F5F7FA] rounded-2xl">
                      <div className="text-4xl font-bold text-[#1FA35B]">R$ 2M+</div>
                      <div className="text-sm text-gray-600 mt-1">Em Reservas</div>
                    </div>
                    <div className="text-center p-4 bg-[#F5F7FA] rounded-2xl">
                      <div className="text-4xl font-bold text-[#0E3A5D]">98%</div>
                      <div className="text-sm text-gray-600 mt-1">Satisfação</div>
                    </div>
                    <div className="text-center p-4 bg-[#F5F7FA] rounded-2xl">
                      <div className="text-4xl font-bold text-[#1FA35B]">24h</div>
                      <div className="text-sm text-gray-600 mt-1">Suporte</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Propósito */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-[#0E3A5D] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3A5D] mb-3">Missão</h3>
              <p className="text-gray-600">
                Proporcionar segurança financeira e acesso a benefícios essenciais 
                para o motorista autônomo, contribuindo para sua estabilidade e 
                qualidade de vida.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-[#1FA35B] rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3A5D] mb-3">Visão</h3>
              <p className="text-gray-600">
                Ser referência nacional em proteção e apoio ao motorista autônomo, 
                reconhecida pela eficiência, transparência e compromisso com 
                nossos associados.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-[#0E3A5D] rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E3A5D] mb-3">Propósito</h3>
              <p className="text-gray-600">
                Valorizar e proteger quem movimenta a economia do país. Acreditamos 
                que todo motorista autônomo merece dignidade, segurança e 
                oportunidades de crescimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#1FA35B] font-semibold text-sm uppercase tracking-wider">Nossos Valores</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0E3A5D] mt-3">
              O que nos guia todos os dias
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Transparência", desc: "Todas as operações são claras e acessíveis aos associados." },
              { title: "Compromisso", desc: "Cumprimos nossas promessas e respeitamos nossos associados." },
              { title: "Inovação", desc: "Buscamos constantemente melhorias para beneficiar nossos associados." },
              { title: "Solidariedade", desc: "Acreditamos na força da união e no apoio mútuo." },
            ].map((valor, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-[#1FA35B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#0E3A5D]">{valor.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{valor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="py-20 bg-gradient-to-br from-[#0E3A5D] to-[#1a5a3d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Por que escolher a ECOMOPAR?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1FA35B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Modelo justo e acessível</h4>
                    <p className="text-gray-300">Contribuição diária de apenas R$ 7,00 via PIX</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1FA35B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Reserva que realmente cresce</h4>
                    <p className="text-gray-300">R$ 5,00 por dia acumulados na sua reserva pessoal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1FA35B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Benefícios reais</h4>
                    <p className="text-gray-300">Assistências odontológica, jurídica e seguro da franquia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1FA35B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Ganhe indicando</h4>
                    <p className="text-gray-300">R$ 150,00 de bônus a cada 3 indicações válidas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <blockquote className="text-xl italic leading-relaxed">
                  &ldquo;A ECOMOPAR mudou minha vida. Antes vivia preocupado com imprevistos,
                  agora tenho uma reserva e benefícios que me dão tranquilidade.&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#1FA35B] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold">João Silva</div>
                    <div className="text-sm text-gray-300">Motorista de App há 4 anos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
