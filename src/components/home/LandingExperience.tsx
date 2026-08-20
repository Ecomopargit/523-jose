"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
  Gift,
  PiggyBank,
  Scale,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AppPreview from "@/components/home/AppPreview";

const benefits = [
  {
    icon: PiggyBank,
    title: "Reserva financeira",
    text: "R$ 5,00 de cada contribuição diária formam a reserva pessoal do associado.",
    tone: "lime",
    number: "01",
  },
  {
    icon: ShieldCheck,
    title: "Seguro da franquia",
    text: "Apoio para a franquia do seguro quando um imprevisto acontece, conforme as regras do benefício.",
    tone: "photo",
    number: "02",
    image: "/landing/driver-blue.webp",
  },
  {
    icon: Stethoscope,
    title: "Assistência odontológica",
    text: "Suporte para cuidados odontológicos conforme as regras do plano da associação.",
    tone: "coral",
    number: "03",
  },
  {
    icon: Scale,
    title: "Assistência jurídica",
    text: "Orientação e apoio jurídico em situações relacionadas à atividade do associado.",
    tone: "paper",
    number: "04",
  },
  {
    icon: CircleDollarSign,
    title: "Empréstimo subsidiado",
    text: "Apoio financeiro em condições especiais, sempre sujeito à análise interna.",
    tone: "sand",
    number: "05",
  },
  {
    icon: Users,
    title: "Indique e ganhe",
    text: "A cada três parceiros que ativarem o cadastro, R$ 150,00 em bônus conforme as regras da campanha.",
    tone: "mint",
    number: "06",
  },
];

const audiences = [
  {
    label: "Motorista profissional",
    title: "Proteção para quem transforma quilômetros em renda.",
    text: "Reserva, benefícios e acompanhamento pensados para uma rotina que muda todos os dias.",
    image: "/landing/hero.webp",
    position: "center",
  },
  {
    label: "Entregas e serviços",
    title: "O trabalho acontece em movimento. O apoio também.",
    text: "Acesse sua conta, acompanhe contribuições e consulte benefícios direto pelo aplicativo.",
    image: "/landing/driver-woman.webp",
    position: "center",
  },
  {
    label: "Duas rodas",
    title: "Uma estrutura simples para uma rotina acelerada.",
    text: "Cadastro digital, ativação via PIX e informações reunidas em uma experiência direta.",
    image: "/landing/moto.webp",
    position: "center",
  },
];

const appTabs = [
  { title: "Saldo e reserva", text: "Veja sua reserva pessoal, movimentações e evolução em um único lugar." },
  { title: "Meta e PIX", text: "Acompanhe sua meta e faça a ativação e as contribuições pelo fluxo de PIX." },
  { title: "Indicações", text: "Compartilhe seu link e acompanhe quais parceiros já concluíram a ativação." },
  { title: "Benefícios", text: "Consulte os benefícios disponíveis e as orientações de acesso pelo aplicativo." },
];

export function BenefitsCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [index, setIndex] = useState(0);

  const updateIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-benefit-card]"));
    if (!cards.length) return;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, cardIndex) => {
      const nextDistance = Math.abs(card.offsetLeft - rail.scrollLeft);
      if (nextDistance < distance) {
        nearest = cardIndex;
        distance = nextDistance;
      }
    });
    setIndex(nearest);
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll<HTMLElement>("[data-benefit-card]");
    const safeIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
    cards[safeIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setIndex(safeIndex);
  }, []);

  return (
    <section id="beneficios" className="landing-benefits-section scroll-mt-24">
      <div className="landing-shell landing-benefits-heading">
        <div>
          <p className="landing-eyebrow">Muito além da reserva</p>
          <h2 className="landing-section-title mt-4">Um ecossistema pensado para proteger seu trabalho.</h2>
        </div>
        <div className="landing-carousel-nav" aria-label="Controles do carrossel de benefícios">
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Benefício anterior">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Próximo benefício">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="landing-benefit-rail"
        onScroll={updateIndex}
        onPointerDown={(event) => {
          const rail = railRef.current;
          if (!rail) return;
          dragRef.current = { active: true, startX: event.clientX, scrollLeft: rail.scrollLeft };
          rail.setPointerCapture(event.pointerId);
          rail.classList.add("is-dragging");
        }}
        onPointerMove={(event) => {
          const rail = railRef.current;
          if (!rail || !dragRef.current.active) return;
          rail.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
        }}
        onPointerUp={(event) => {
          const rail = railRef.current;
          if (!rail) return;
          dragRef.current.active = false;
          rail.releasePointerCapture(event.pointerId);
          rail.classList.remove("is-dragging");
        }}
      >
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            data-benefit-card
            className={`landing-benefit-card landing-benefit-card-${benefit.tone}`}
          >
            {benefit.image ? (
              <Image src={benefit.image} alt="Motorista profissional em seu veículo" fill sizes="(max-width: 768px) 86vw, 440px" className="object-cover" />
            ) : null}
            {benefit.image ? <div className="landing-benefit-photo-overlay" aria-hidden="true" /> : null}
            <span className="landing-benefit-number" aria-hidden="true">{benefit.number}</span>
            <div className="landing-benefit-icon"><benefit.icon aria-hidden="true" /></div>
            <div className="relative z-10">
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="landing-shell landing-rail-footer">
        <div className="landing-rail-progress" aria-hidden="true">
          <i style={{ width: `${((index + 1) / benefits.length) * 100}%` }} />
        </div>
        <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(benefits.length).padStart(2, "0")}</span>
        <Link href="/beneficios" className="landing-text-link">Ver todos <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

export function AudienceShowcase() {
  const [active, setActive] = useState(0);
  const item = audiences[active];

  return (
    <section className="landing-audience-section">
      <div className="landing-shell">
        <div className="landing-audience-heading">
          <p className="landing-eyebrow text-[#d7ef77]">Para quem vive da direção</p>
          <h2>Do primeiro trajeto ao fim do expediente.</h2>
        </div>
        <div className="landing-audience-stage">
          <Image
            key={item.image}
            src={item.image}
            alt={item.label}
            fill
            sizes="(max-width: 1024px) 100vw, 1240px"
            className="object-cover landing-audience-image"
            style={{ objectPosition: item.position }}
          />
          <div className="landing-audience-overlay" />
          <div className="landing-audience-copy">
            <span>0{active + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
          <div className="landing-audience-tabs" role="tablist" aria-label="Perfis atendidos">
            {audiences.map((audience, audienceIndex) => (
              <button
                key={audience.label}
                type="button"
                role="tab"
                aria-selected={active === audienceIndex}
                onClick={() => setActive(audienceIndex)}
                className={active === audienceIndex ? "active" : ""}
              >
                {audience.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AppShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % appTabs.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="landing-app-section">
      <div className="landing-shell landing-app-grid">
        <div>
          <p className="landing-eyebrow text-[#d7ef77]">ECOMOPAR no seu bolso</p>
          <h2>Tudo o que importa, acompanhado pelo aplicativo.</h2>
          <p className="landing-app-intro">Uma visão simples da reserva, dos PIX, das indicações e dos benefícios — sem perder tempo procurando informações.</p>
          <div className="landing-app-tabs" role="tablist" aria-label="Recursos do aplicativo">
            {appTabs.map((tab, tabIndex) => (
              <button
                key={tab.title}
                type="button"
                role="tab"
                aria-selected={active === tabIndex}
                onClick={() => setActive(tabIndex)}
                className={active === tabIndex ? "active" : ""}
              >
                <span>0{tabIndex + 1}</span>
                <div><strong>{tab.title}</strong><small>{tab.text}</small></div>
              </button>
            ))}
          </div>
        </div>
        <div className="landing-app-stage">
          <div className="landing-app-orbit" aria-hidden="true" />
          <AppPreview className="landing-app-phone" />
          <div className="landing-app-callout landing-app-callout-one">
            <span /><div><small>Recurso em destaque</small><strong>{appTabs[active].title}</strong></div>
          </div>
          <div className="landing-app-callout landing-app-callout-two">
            <Gift aria-hidden="true" /><div><small>Indicações</small><strong>Acompanhe pelo app</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}
