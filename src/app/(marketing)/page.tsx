import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Banknote,
  Check,
  ChevronRight,
  CircleDollarSign,
  Gift,
  HeartHandshake,
  PiggyBank,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  WalletCards,
} from "lucide-react";
import ReserveSimulator from "@/components/home/ReserveSimulator";
import HomeFaq from "@/components/home/HomeFaq";
import { LOGO_MARK_LIGHT } from "@/lib/logo";

const benefits = [
  {
    icon: PiggyBank,
    title: "Reserva que é sua",
    text: "R$ 5,00 de cada contribuição diária formam sua reserva pessoal.",
    tone: "lime",
  },
  {
    icon: ShieldCheck,
    title: "Proteção na estrada",
    text: "Apoio para a franquia do seguro quando um imprevisto acontece.",
    tone: "forest",
  },
  {
    icon: Stethoscope,
    title: "Cuidado de verdade",
    text: "Assistência odontológica para cuidar de quem passa o dia ao volante.",
    tone: "coral",
  },
  {
    icon: Scale,
    title: "Orientação jurídica",
    text: "Suporte especializado para situações relacionadas à sua atividade.",
    tone: "blue",
  },
  {
    icon: CircleDollarSign,
    title: "Crédito subsidiado",
    text: "Condições especiais, sujeitas à análise, para associados ativos.",
    tone: "gold",
  },
  {
    icon: Users,
    title: "Indique e ganhe",
    text: "A cada três parceiros ativos, você recebe R$ 150,00 em bônus.",
    tone: "mint",
  },
];

const appActions = [
  { icon: Banknote, label: "Sacar" },
  { icon: WalletCards, label: "Depositar" },
  { icon: Gift, label: "Indicar" },
];

export default function HomePage() {
  return (
    <main className="landing-home overflow-hidden bg-[#f8f7f2]">
      <section className="landing-hero relative min-h-[calc(100dvh-4rem)] overflow-hidden text-white sm:min-h-[calc(100dvh-4.5rem)]">
        <div className="landing-grain" aria-hidden="true" />
        <div className="landing-road-lines" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:min-h-[calc(100dvh-4.5rem)] sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-8 lg:px-8 lg:py-20">
          <div className="relative z-10 max-w-2xl landing-reveal">
            <div className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d7ef77]">
              <span className="h-px w-8 bg-[#d7ef77]" aria-hidden="true" />
              Feito para quem vive da direção
            </div>
            <h1 className="font-display text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[0.93] text-balance">
              Seu corre merece <span className="landing-highlight">reserva.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
              A ECOMOPAR reúne proteção, benefícios e uma reserva financeira que cresce com você,
              direto pelo aplicativo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastrar" className="landing-cta-primary group">
                Quero me associar
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#como-funciona" className="landing-cta-secondary">
                Entender como funciona
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/68">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#d7ef77]" /> Cadastro digital</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#d7ef77]" /> Pagamento via PIX</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#d7ef77]" /> Acompanhe pelo app</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center lg:justify-end landing-reveal landing-delay">
            <div className="absolute left-0 top-[15%] hidden w-44 rotate-[-7deg] rounded-lg bg-[#d7ef77] p-4 text-[#123d31] shadow-2xl lg:block xl:-left-4">
              <p className="text-xs font-bold uppercase">Todo dia conta</p>
              <p className="mt-1 font-display text-3xl font-bold">R$ 5</p>
              <p className="text-xs leading-snug">vão direto para a sua reserva pessoal.</p>
            </div>

            <div className="app-phone" aria-label="Prévia da tela inicial do aplicativo ECOMOPAR">
              <div className="app-phone-island" aria-hidden="true" />
              <div className="app-screen">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Image src={LOGO_MARK_LIGHT} alt="" width={34} height={34} className="rounded-[9px]" unoptimized />
                    <div>
                      <p className="text-[10px] text-white/55">Boa tarde,</p>
                      <p className="text-[13px] font-semibold">José parceiro</p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8">
                    <Sparkles className="h-3.5 w-3.5 text-[#d7ef77]" />
                  </div>
                </div>

                <div className="app-balance">
                  <div className="flex items-center justify-between text-[10px] text-white/55">
                    <span>Minha reserva</span>
                    <span className="rounded-full bg-[#d7ef77]/15 px-2 py-1 text-[#d7ef77]">Ativa</span>
                  </div>
                  <p className="mt-2 font-display text-[32px] font-semibold leading-none">R$ 1.350<span className="text-lg text-white/55">,00</span></p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
                    <span className="text-white/45">Acumulado em 9 meses</span>
                    <span className="font-semibold text-[#d7ef77]">+ R$ 150 este mês</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {appActions.map((action) => (
                    <div key={action.label} className="flex flex-col items-center gap-2 rounded-xl bg-white p-2.5 text-[#123d31]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e9f2c8]">
                        <action.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold">{action.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-[#f0eee6] p-3.5 text-[#123d31]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-[#63746b]">Meta da reserva</p>
                      <p className="mt-0.5 text-[12px] font-bold">Fundo para imprevistos</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold">54%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#d9ddd4]">
                    <div className="h-full w-[54%] rounded-full bg-[#1d7558]" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef795c] text-white">
                    <Gift className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold">Indique 3 parceiros</p>
                    <p className="text-[9px] text-white/45">Ganhe R$ 150 em bônus</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dfe3d8] bg-[#d7ef77] text-[#123d31]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ["R$ 7,00", "contribuição por dia"],
            ["R$ 5,00", "para a sua reserva"],
            ["R$ 2,00", "para manter os benefícios"],
          ].map(([value, label], index) => (
            <div key={value + label} className={`flex items-baseline gap-3 py-5 sm:justify-center sm:py-6 ${index > 0 ? "border-t border-[#123d31]/15 sm:border-l sm:border-t-0" : ""}`}>
              <strong className="font-display text-2xl sm:text-3xl">{value}</strong>
              <span className="max-w-28 text-xs font-semibold leading-tight sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <p className="landing-eyebrow">Um plano simples</p>
              <h2 className="landing-section-title mt-4">Seu dinheiro trabalha a favor do seu caminho.</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#5a6961]">
                Uma contribuição pequena e transparente cria uma rede de apoio para os dias em que você mais precisa.
              </p>
              <Link href="/como-funciona" className="landing-text-link mt-7">
                Ver regras do plano <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ol className="space-y-0">
              {[
                { n: "01", title: "Faça seu cadastro", text: "Informe seus dados e os do veículo. Pode ser próprio ou alugado." },
                { n: "02", title: "Ative pelo PIX", text: "Contribua com R$ 7,00 por dia, com divisão clara de cada centavo." },
                { n: "03", title: "Acompanhe e use", text: "Veja sua reserva crescer e acesse benefícios direto no aplicativo." },
              ].map((step) => (
                <li key={step.n} className="landing-step grid grid-cols-[auto_1fr] gap-5 border-t border-[#ccd3ca] py-8 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-7">
                  <span className="font-mono text-xs font-semibold text-[#1d7558]">{step.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#123d31] sm:text-2xl">{step.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#68766e] sm:text-base">{step.text}</p>
                  </div>
                  <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-[#b7c0b6] text-[#1d7558] sm:flex">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-[#123d31] px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="landing-eyebrow text-[#d7ef77]">Muito além da reserva</p>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-balance sm:text-5xl">
                Um ecossistema pensado para proteger seu trabalho.
              </h2>
            </div>
            <Link href="/beneficios" className="landing-text-link text-white hover:text-[#d7ef77]">
              Conhecer todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="landing-benefits-grid">
            {benefits.map((benefit, index) => (
              <article key={benefit.title} className={`landing-benefit landing-benefit-${benefit.tone} ${index === 0 ? "landing-benefit-featured" : ""}`}>
                <benefit.icon className="h-7 w-7" strokeWidth={1.8} />
                <div>
                  <h3 className="font-display text-xl font-semibold sm:text-2xl">{benefit.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-70">{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div id="simulador" className="scroll-mt-20 landing-simulator">
        <ReserveSimulator />
      </div>

      <section className="relative overflow-hidden bg-[#ef795c] px-4 py-20 text-[#123d31] sm:px-6 sm:py-28 lg:px-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[48px] border-[#123d31]/8" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.72fr]">
          <div>
            <p className="text-sm font-bold uppercase">Força de comunidade</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.02] text-balance sm:text-6xl">
              Três indicações. R$ 150 para seguir em frente.
            </h2>
          </div>
          <div className="border-l border-[#123d31]/20 pl-0 lg:pl-10">
            <p className="max-w-md text-base leading-relaxed text-[#123d31]/75">
              Compartilhe seu link. Quando três parceiros ativarem o cadastro, o bônus entra na sua conta, conforme as regras da campanha.
            </p>
            <Link href="/indique-e-ganhe" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#123d31] px-6 font-semibold text-white transition-transform hover:-translate-y-0.5">
              Conhecer a campanha <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HomeFaq />

      <section className="bg-[#f8f7f2] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl border-t border-[#cdd4cb] pt-16 text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-[#1d7558]" strokeWidth={1.5} />
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight text-[#123d31] text-balance sm:text-6xl">
            Quem move a cidade também merece apoio.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[#65736b]">Cadastre-se em poucos minutos e comece a construir sua reserva.</p>
          <Link href="/cadastrar" className="landing-cta-dark group mt-8">
            Fazer meu cadastro <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-xs text-[#7b877f]">Análise em até 48 horas úteis</p>
        </div>
      </section>
    </main>
  );
}
