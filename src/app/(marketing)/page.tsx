import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Stethoscope,
  Scale,
  Car,
  Users,
  ChevronRight,
  Wallet,
  PiggyBank,
  Gift,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand via-brand-dark to-brand-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(255,255,255,0.12),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                <Shield className="w-5 h-5 text-brand-100" />
                <span className="text-sm font-semibold">
                  Proteção para Motoristas Autônomos
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-balance">
                Proteção, reserva e apoio para o{" "}
                <span className="text-brand-100">motorista autônomo</span>
              </h1>
              <p className="text-base sm:text-xl text-white/75 leading-relaxed max-w-xl">
                A ECOMOPAR é o instituto que ajuda você a construir sua reserva
                financeira, enfrentar imprevistos e ter acesso a benefícios
                importantes para o seu dia a dia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/associar-se" className="btn-accent btn-lg w-full sm:w-auto">
                  <span>Quero me Associar</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="btn border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white btn-lg w-full sm:w-auto"
                >
                  Área do Associado
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="bg-white/8 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl shadow-black/10">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center">
                    <PiggyBank className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold">R$ 5,00</div>
                    <div className="text-xs sm:text-sm text-gray-400">por dia na reserva</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center">
                    <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold">R$ 150</div>
                    <div className="text-xs sm:text-sm text-gray-400">bônus por indicação</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center col-span-2">
                    <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold">R$ 7,00</div>
                    <div className="text-xs sm:text-sm text-gray-400">contribuição diária via PIX</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Simples e Acessível
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mt-3">
              Faça sua reserva com depósitos diários acessíveis
            </h2>
            <p className="text-gray-600 mt-4 text-base sm:text-lg">
              Com apenas <strong className="text-brand">R$ 7,00 por dia</strong>,
              você participa da ECOMOPAR e ainda acumula{" "}
              <strong className="text-accent">R$ 5,00 por dia</strong> em sua
              reserva pessoal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { n: "1", bg: "bg-brand", title: "Cadastre-se", desc: "Preencha seu cadastro com dados pessoais e do veículo. Aprovação rápida em poucos dias." },
              { n: "2", bg: "bg-accent", title: "Contribua Diariamente", desc: "Realize depósitos diários de R$ 7,00 via PIX. R$ 5,00 vão para sua reserva pessoal." },
              { n: "3", bg: "bg-brand", title: "Aproveite os Benefícios", desc: "Acesse reserva, empréstimo, assistências e mais. Saque quando precisar." },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-gradient-to-br from-surface to-white rounded-2xl p-6 sm:p-8 border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-white text-xl sm:text-2xl font-bold">{step.n}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Vantagens Exclusivas
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mt-3">
              Mais segurança para quem vive da direção
            </h2>
            <p className="text-gray-600 mt-4 text-base sm:text-lg">
              A ECOMOPAR oferece benefícios pensados para a realidade do motorista autônomo
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: PiggyBank, color: "bg-brand/10 text-brand", title: "Reserva Financeira", desc: "Acumule R$ 5,00 por dia na sua reserva pessoal. Ao final de 30 dias, são R$ 150,00 guardados." },
              { icon: TrendingUp, color: "bg-accent/10 text-accent", title: "Empréstimo Subsidiado", desc: "Acesso a apoio financeiro em condições especiais, sujeito à análise interna da associação." },
              { icon: Stethoscope, color: "bg-brand/10 text-brand", title: "Assistência Odontológica", desc: "Suporte para cuidados odontológicos conforme regras do plano da associação." },
              { icon: Scale, color: "bg-accent/10 text-accent", title: "Assistência Jurídica", desc: "Orientação e apoio jurídico em situações relacionadas à sua atividade como motorista." },
              { icon: Car, color: "bg-brand/10 text-brand", title: "Seguro da Franquia", desc: "Em caso de sinistro, pague uma taxa reduzida e o instituto cobre o valor da franquia." },
              { icon: Users, color: "bg-accent/10 text-accent", title: "Indique e Ganhe", desc: "Indique 3 novos parceiros e receba R$ 150,00 de bônus. Quanto mais indicar, mais ganha!" },
            ].map((b, i) => (
              <div
                key={i}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${b.color}`}>
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/beneficios"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:text-accent transition-colors"
            >
              <span>Conhecer todos os benefícios</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Indique e Ganhe */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="space-y-6">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                Programa de Indicação
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Indique e ganhe <span className="text-accent">R$ 150,00</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Participe do plano de alavancagem da ECOMOPAR. Indique 3 novos
                parceiros e, cumpridas as regras da campanha, receba{" "}
                <strong className="text-white">R$ 150,00</strong> em bônus.
              </p>
              <ul className="space-y-3">
                {[
                  "Compartilhe seu código de indicação",
                  "Seus indicados se associam e ativam a conta",
                  "Receba R$ 150,00 quando completar 3 indicações válidas",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Importante:</strong> Ao aderir à
                  campanha, o associado só poderá solicitar saque após 90 dias da
                  ativação.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-gray-900">
              <div className="text-center">
                <Gift className="w-14 h-14 sm:w-16 sm:h-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-2">
                  Quanto você pode ganhar?
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Veja o potencial de ganhos com indicações
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { qtd: "3 indicações", valor: "R$ 150,00" },
                  { qtd: "6 indicações", valor: "R$ 300,00" },
                  { qtd: "12 indicações", valor: "R$ 600,00" },
                ].map((item) => (
                  <div
                    key={item.qtd}
                    className="flex justify-between items-center p-4 bg-surface rounded-xl"
                  >
                    <span className="font-medium">{item.qtd}</span>
                    <span className="text-lg sm:text-xl font-bold text-accent">
                      {item.valor}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/indique-e-ganhe" className="btn-primary btn-md w-full mt-6">
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mb-6">
            Pronto para começar a construir sua reserva?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de motoristas autônomos que já estão protegidos
            pela ECOMOPAR. Comece hoje com apenas R$ 7,00 por dia.
          </p>
          <Link href="/associar-se" className="btn-primary btn-lg">
            <span>Quero me Associar Agora</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-6">
            Cadastro simples e aprovação em até 48 horas úteis
          </p>
        </div>
      </section>
    </main>
  );
}
