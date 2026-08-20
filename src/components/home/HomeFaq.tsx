import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";

const faq = [
  {
    q: "Quanto custa participar da ECOMOPAR?",
    a: "O Plano Adesão Um é um PIX diário de R$ 7,00. Desse valor, R$ 5,00 ficam reservados para você sacar quando desejar e R$ 2,00 entram como custeio da associação.",
  },
  {
    q: "Quando posso solicitar um saque?",
    a: "A reserva fica disponível conforme as regras da associação. Quem adere à campanha Indique e Ganhe só pode solicitar saque após 90 dias contados da ativação do cadastro.",
  },
  {
    q: "Como funciona o Indique e Ganhe?",
    a: "Você recebe um código e um link exclusivos. Cada pessoa que se cadastra pelo seu link entra no seu contador e, a cada 3 parceiros que ativarem o cadastro, você ganha R$ 150,00.",
  },
  {
    q: "Preciso ter carro próprio?",
    a: "Não. O cadastro aceita motoristas com veículo próprio ou alugado — basta informar os dados do veículo e da locadora, quando for o caso.",
  },
  {
    q: "Quanto tempo leva para aprovar meu cadastro?",
    a: "Após o envio dos dados e a confirmação do PIX de ativação, a análise costuma ser concluída em até 48 horas úteis.",
  },
];

export default function HomeFaq() {
  return (
    <section className="landing-faq-section py-20 sm:py-28 bg-[#f8f7f2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="landing-eyebrow">
            Tire suas dúvidas
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-.04em] text-brand mt-4">
            Perguntas frequentes
          </h2>
        </div>

        <div className="landing-faq-list">
          {faq.map((item) => (
            <details
              key={item.q}
              className="landing-faq-item group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-6 font-semibold text-ink hover:text-brand transition-colors">
                <span className="text-[15px] sm:text-base">{item.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="landing-faq-answer"><p>{item.a}</p></div>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 text-brand font-semibold hover:text-accent transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Ficou com outra dúvida? Fale com a gente</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
