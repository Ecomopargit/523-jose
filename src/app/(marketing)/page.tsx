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
  ArrowDown,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import ReserveSimulator from "@/components/home/ReserveSimulator";
import HomeFaq from "@/components/home/HomeFaq";

const beneficios = [
  { icon: PiggyBank, color: "bg-brand/10 text-brand", title: "Reserva Financeira", desc: "Acumule R$ 5,00 por dia na sua reserva pessoal. Ao final de 30 dias, são R$ 150,00 guardados." },
  { icon: TrendingUp, color: "bg-accent/10 text-accent", title: "Empréstimo Subsidiado", desc: "Acesso a apoio financeiro em condições especiais, sujeito à análise interna da associação." },
  { icon: Stethoscope, color: "bg-brand/10 text-brand", title: "Assistência Odontológica", desc: "Suporte para cuidados odontológicos conforme regras do plano da associação." },
  { icon: Scale, color: "bg-accent/10 text-accent", title: "Assistência Jurídica", desc: "Orientação e apoio jurídico em situações relacionadas à sua atividade como motorista." },
  { icon: Car, color: "bg-brand/10 text-brand", title: "Seguro da Franquia", desc: "Em caso de sinistro, pague uma taxa reduzida e o instituto cobre o valor da franquia." },
  { icon: Users, color: "bg-accent/10 text-accent", title: "Indique e Ganhe", desc: "Indique 3 novos parceiros e receba R$ 150,00 de bônus. Quanto mais indicar, mais ganha!" },
];

const passos = [
  { n: "1", title: "Cadastre-se", desc: "Preencha seus dados pessoais e do veículo em poucos minutos, direto pelo site ou pelo app." },
  { n: "2", title: "Ative com PIX", desc: "Faça o PIX diário de R$ 7,00. R$ 5,00 vão para a sua reserva e R$ 2,00 para o custeio." },
  { n: "3", title: "Use os benefícios", desc: "Acompanhe seu saldo, indique parceiros e solicite saque conforme as regras da associação." },
];

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
                <Link href="/cadastrar" className="btn-accent btn-lg w-full sm:w-auto">
                  <span>Cadastrar-se</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="btn border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white btn-lg w-full sm:w-auto"
                >
                  Área do Associado
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Sem mensalidade fixa
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-accent" />
                  Cadastro em minutos
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Pagamento via PIX
                </span>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="bg-white/8 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl shadow-black/10">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs uppercase tracking-wider font-semibold text-white/60">
                    Plano Adesão Um
                  </p>
                  <span className="text-[11px] font-semibold bg-accent/20 text-accent border border-accent/30 rounded-full px-3 py-1">
                    R$ 7,00 / dia
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center transition-transform duration-300 hover:-translate-y-1">
                    <PiggyBank className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold font-mono-num">R$ 5,00</div>
                    <div className="text-xs sm:text-sm text-white/55">por dia na reserva</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center transition-transform duration-300 hover:-translate-y-1">
                    <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold font-mono-num">R$ 150</div>
                    <div className="text-xs sm:text-sm text-white/55">bônus por indicação</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 text-center col-span-2 transition-transform duration-300 hover:-translate-y-1">
                    <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-accent mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold font-mono-num">R$ 2,00</div>
                    <div className="text-xs sm:text-sm text-white/55">
                      custeio diário da associação
                    </div>
                  </div>
                </div>
                <Link
                  href="#simulador"
                  className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  <span>Simular minha reserva</span>
                  <ArrowDown className="w-4 h-4" />
                </Link>
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
              Comece em 3 passos
            </h2>
            <p className="text-ink-soft mt-4 text-base sm:text-lg">
              Com apenas <strong className="text-brand">R$ 7,00 por dia</strong>, você participa
              da ECOMOPAR e ainda acumula{" "}
              <strong className="text-accent">R$ 5,00 por dia</strong> em sua reserva pessoal.
            </p>
          </div>

          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div
              aria-hidden
              className="hidden lg:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-brand/20 via-accent/40 to-brand/20"
            />
            {passos.map((step) => (
              <li
                key={step.n}
                className="relative bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 sm:p-8 border border-line-soft text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-6 ring-8 ring-white">
                  <span className="text-white text-xl sm:text-2xl font-bold">{step.n}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand mb-3">{step.title}</h3>
                <p className="text-ink-soft text-sm sm:text-base">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="text-center mt-10">
            <Link
              href="/como-funciona"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:text-accent transition-colors"
            >
              <span>Ver como funciona em detalhes</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Simulador interativo */}
      <div id="simulador" className="scroll-mt-24">
        <ReserveSimulator />
      </div>

      {/* Benefícios */}
      <section className="py-16 sm:py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Vantagens Exclusivas
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mt-3">
              Mais segurança para quem vive da direção
            </h2>
            <p className="text-ink-soft mt-4 text-base sm:text-lg">
              A ECOMOPAR oferece benefícios pensados para a realidade do motorista autônomo
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {beneficios.map((b) => (
              <div
                key={b.title}
                className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${b.color}`}>
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-brand mb-2">{b.title}</h3>
                <p className="text-ink-soft text-sm">{b.desc}</p>
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
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Participe do plano de alavancagem da ECOMOPAR. Compartilhe seu link, indique 3
                novos parceiros e, cumpridas as regras da campanha, receba{" "}
                <strong className="text-white">R$ 150,00</strong> em bônus.
              </p>
              <ul className="space-y-3">
                {[
                  "Compartilhe seu código ou link exclusivo",
                  "Seus indicados se associam e ativam a conta",
                  "Receba R$ 150,00 a cada 3 indicações válidas",
                ].map((text, i) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-white/70">
                  <strong className="text-white">Importante:</strong> Ao aderir à campanha, o
                  associado só poderá solicitar saque após 90 dias da ativação.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-ink">
              <div className="text-center">
                <Gift className="w-14 h-14 sm:w-16 sm:h-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-brand mb-2">
                  Quanto você pode ganhar?
                </h3>
                <p className="text-ink-soft mb-6 text-sm sm:text-base">
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
                    className="flex justify-between items-center p-4 bg-bg rounded-xl transition-colors hover:bg-green-50"
                  >
                    <span className="font-medium">{item.qtd}</span>
                    <span className="text-lg sm:text-xl font-bold text-accent font-mono-num">
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

      <HomeFaq />

      {/* CTA Final */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand mb-6">
            Pronto para começar a construir sua reserva?
          </h2>
          <p className="text-ink-soft text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Junte-se aos motoristas autônomos que já contam com a proteção da ECOMOPAR. Comece
            hoje com apenas R$ 7,00 por dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/cadastrar" className="btn-primary btn-lg">
              <span>Cadastrar-se agora</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/contato" className="btn-outline btn-lg">
              Falar com a equipe
            </Link>
          </div>
          <p className="text-sm text-ink-faint mt-6">
            Cadastro simples e aprovação em até 48 horas úteis
          </p>
        </div>
      </section>
    </main>
  );
}
