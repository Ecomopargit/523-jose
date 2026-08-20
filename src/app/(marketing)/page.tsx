import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Gift,
  HeartHandshake,
  Link2,
  QrCode,
  Smartphone,
  UserCheck,
  Users,
} from "lucide-react";
import AppPreview from "@/components/home/AppPreview";
import {
  AppShowcase,
  AudienceShowcase,
  BenefitsCarousel,
} from "@/components/home/LandingExperience";
import HomeFaq from "@/components/home/HomeFaq";
import ReserveSimulator from "@/components/home/ReserveSimulator";

export const metadata: Metadata = {
  title: "Reserva e benefícios para motoristas autônomos",
  description:
    "Conheça a ECOMOPAR: reserva pessoal, benefícios e acompanhamento pelo aplicativo com contribuição diária de R$ 7,00.",
};

const journey = [
  {
    icon: UserCheck,
    n: "01",
    title: "Faça seu cadastro",
    text: "Informe seus dados e os do veículo. Pode ser próprio ou alugado.",
  },
  {
    icon: QrCode,
    n: "02",
    title: "Ative pelo PIX",
    text: "Conclua a ativação e faça a contribuição diária de R$ 7,00.",
  },
  {
    icon: Smartphone,
    n: "03",
    title: "Acompanhe pelo app",
    text: "Consulte reserva, contribuições, indicações e benefícios em um só lugar.",
  },
];

const referralSteps = [
  { n: "01", icon: Link2, title: "Compartilhe seu link", text: "Use o código ou link exclusivo disponível na sua conta." },
  { n: "02", icon: Users, title: "Três parceiros ativam", text: "A indicação conta quando o cadastro do parceiro é ativado." },
  { n: "03", icon: CheckCircle2, title: "O ciclo é concluído", text: "Acompanhe o status de cada indicação dentro do aplicativo." },
  { n: "04", icon: Gift, title: "R$ 150 de bônus", text: "A liberação segue as regras oficiais da campanha." },
];

export default function HomePage() {
  return (
    <main className="landing-home bg-[#f8f7f2]">
      <section className="landing-hero-v2">
        <div className="landing-grain" aria-hidden="true" />
        <div className="landing-road-lines" aria-hidden="true" />
        <div className="landing-shell landing-hero-grid">
          <div className="landing-hero-copy landing-reveal">
            <div className="landing-micro-label"><span />Feito para quem vive da direção</div>
            <h1>Seu corre merece <span className="landing-highlight">reserva.</span></h1>
            <p>
              A ECOMOPAR reúne proteção, benefícios e uma reserva financeira que cresce com você,
              direto pelo aplicativo.
            </p>
            <div className="landing-hero-actions">
              <Link href="/cadastrar" className="landing-cta-primary group">
                Quero me associar
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#como-funciona" className="landing-cta-secondary">
                Entender como funciona
              </Link>
            </div>
            <div className="landing-hero-proof">
              <span><Check /> Cadastro digital</span>
              <span><Check /> Ativação via PIX</span>
              <span><Check /> Acompanhe pelo app</span>
            </div>
          </div>

          <div className="landing-hero-media landing-reveal landing-delay">
            <Image
              src="/landing/hero.webp"
              alt="Motorista profissional consultando o celular dentro do veículo"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="landing-hero-photo-overlay" aria-hidden="true" />
            <AppPreview className="landing-hero-phone" />
            <div className="landing-money-chip" aria-label="R$ 5,00 por dia para a reserva pessoal">
              <small>Todo dia conta</small>
              <strong>R$ 5</strong>
              <span>vão para a sua reserva pessoal</span>
            </div>
            <div className="landing-secure-chip"><i /><div><small>Acompanhamento digital</small><strong>Reserva e benefícios no app</strong></div></div>
          </div>
        </div>

        <div className="landing-ticker" aria-label="Resumo do plano">
          <div>
            <span>R$ 7,00 por dia</span><i />
            <span>R$ 5,00 para sua reserva</span><i />
            <span>R$ 2,00 para o ecossistema</span><i />
            <span>Cadastro digital</span><i />
            <span>Ativação via PIX</span><i />
            <span aria-hidden="true">R$ 7,00 por dia</span><i aria-hidden="true" />
            <span aria-hidden="true">R$ 5,00 para sua reserva</span><i aria-hidden="true" />
            <span aria-hidden="true">R$ 2,00 para o ecossistema</span><i aria-hidden="true" />
            <span aria-hidden="true">Cadastro digital</span><i aria-hidden="true" />
            <span aria-hidden="true">Ativação via PIX</span><i aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="landing-clarity-section scroll-mt-24">
        <div className="landing-shell">
          <div className="landing-heading-split">
            <div>
              <p className="landing-eyebrow">Contribuição clara</p>
              <h2 className="landing-section-title mt-4">Sete reais. Dois destinos. Nenhuma confusão.</h2>
            </div>
            <div>
              <p>Cada contribuição diária tem uma divisão objetiva: a maior parte forma sua reserva pessoal e a outra mantém a associação e os benefícios.</p>
              <Link href="/como-funciona" className="landing-text-link mt-5">Ver regras do plano <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="landing-money-system">
            <article className="landing-money-total">
              <small>Contribuição diária</small>
              <strong>R$ 7</strong>
              <span>100% com destino explicado</span>
              <div className="landing-split-bar" role="img" aria-label="71% para a reserva pessoal e 29% para manutenção do ecossistema">
                <i /><b />
              </div>
            </article>
            <article className="landing-money-destination landing-reserve-destination">
              <span>71%</span>
              <div><small>R$ 5 por dia</small><h3>Reserva pessoal</h3><p>Este valor forma a reserva do associado e pode ser acompanhado pelo aplicativo.</p></div>
            </article>
            <article className="landing-money-destination landing-ecosystem-destination">
              <span>29%</span>
              <div><small>R$ 2 por dia</small><h3>Manutenção do ecossistema</h3><p>Este valor mantém a associação e a estrutura que viabiliza os benefícios.</p></div>
            </article>
          </div>

          <div className="landing-example-row">
            <div><small>Exemplo em 30 dias</small><strong>R$ 150,00</strong><span>formados na reserva pessoal</span></div>
            <p>O exemplo considera 30 contribuições diárias de R$ 5,00 destinadas à reserva. Valores efetivos dependem das contribuições realizadas.</p>
          </div>

          <ol className="landing-journey">
            {journey.map((step) => (
              <li key={step.n}>
                <div className="landing-journey-icon"><step.icon aria-hidden="true" /></div>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AudienceShowcase />
      <BenefitsCarousel />
      <AppShowcase />

      <div id="simulador" className="scroll-mt-20 landing-simulator">
        <ReserveSimulator />
      </div>

      <section className="landing-referral-section">
        <div className="landing-shell landing-referral-grid">
          <div className="landing-referral-copy">
            <p className="landing-eyebrow">Indique e ganhe</p>
            <h2>Três indicações. <span>R$ 150</span> para seguir em frente.</h2>
            <p>Compartilhe seu link e acompanhe cada etapa. Quando três parceiros elegíveis ativarem o cadastro, o ciclo é concluído conforme as regras oficiais da campanha.</p>
            <Link href="/indique-e-ganhe" className="landing-cta-dark group">
              Conhecer a campanha <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="landing-referral-board" aria-label="Jornada da campanha de indicação">
            <div className="landing-referral-progress"><i /><i /><i /></div>
            {referralSteps.map((step) => (
              <article key={step.n}>
                <div><span>{step.n}</span><step.icon aria-hidden="true" /></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
            <div className="landing-referral-status">
              <div><small>Status no aplicativo</small><strong>3 de 3 ativações concluídas</strong></div>
              <span>R$ 150</span>
            </div>
          </div>
        </div>
      </section>

      <HomeFaq />

      <section className="landing-final-cta">
        <div className="landing-shell">
          <HeartHandshake aria-hidden="true" />
          <h2>Quem move a cidade também merece apoio.</h2>
          <p>Cadastre-se em poucos minutos e comece a construir sua reserva.</p>
          <Link href="/cadastrar" className="landing-cta-dark group">
            Fazer meu cadastro <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <small>Análise em até 48 horas úteis</small>
        </div>
      </section>
    </main>
  );
}
