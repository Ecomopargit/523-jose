import Image from "next/image";
import {
  Banknote,
  ChevronRight,
  Gift,
  QrCode,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { LOGO_MARK_LIGHT } from "@/lib/logo";

const actions = [
  { icon: Banknote, label: "Sacar" },
  { icon: WalletCards, label: "Depositar" },
  { icon: Gift, label: "Indicar" },
];

type AppPreviewProps = {
  className?: string;
};

export default function AppPreview({ className = "" }: AppPreviewProps) {
  return (
    <div
      className={`app-phone ${className}`}
      aria-label="Prévia ilustrativa da tela inicial do aplicativo ECOMOPAR"
    >
      <div className="app-phone-island" aria-hidden="true" />
      <div className="app-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src={LOGO_MARK_LIGHT}
              alt=""
              width={34}
              height={34}
              className="rounded-[9px]"
              unoptimized
            />
            <div>
              <p className="text-[10px] text-white/55">Boa tarde,</p>
              <p className="text-[13px] font-semibold">associado ECOMOPAR</p>
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
          <p className="mt-2 font-display text-[32px] font-semibold leading-none">
            R$ 1.350<span className="text-lg text-white/55">,00</span>
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
            <span className="text-white/45">Exemplo de acompanhamento</span>
            <span className="font-semibold text-[#d7ef77]">saldo em tempo real</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => (
            <div
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-2.5 text-[#123d31]"
            >
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
            <QrCode className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold">PIX e indicações</p>
            <p className="text-[9px] text-white/45">Tudo em um só lugar</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </div>
      </div>
    </div>
  );
}
