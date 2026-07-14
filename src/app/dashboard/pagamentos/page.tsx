"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { Camera, QrCode, Copy, Check, Info } from "lucide-react";

export default function PagamentosPage() {
  const [copied, setCopied] = useState(false);
  const pixKey = "contato@ecomopar.org";

  const copyPix = async () => {
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="withdraw-hero mb-5">
        <div>
          <p className="text-[12.5px] opacity-70 mb-1.5">Depósito diário</p>
          <p className="font-mono-num font-display text-[28px] font-bold">R$ 7,00</p>
          <p className="text-xs opacity-60 mt-1.5">R$ 5,00 reserva · R$ 2,00 taxa admin</p>
        </div>
        <div className="w-12 h-12 rounded-[12px] bg-white/12 flex items-center justify-center shrink-0">
          <QrCode className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
      </div>

      <div className="card p-6 sm:p-7 max-w-xl mb-5">
        <h2 className="font-display text-[15px] font-semibold mb-2">Chave PIX</h2>
        <p className="text-sm text-ink-soft mb-5 leading-relaxed">
          Envie o valor diário para a chave abaixo. O depósito entra na sua reserva após
          confirmação.
        </p>

        <div className="rounded-[14px] border border-line-soft bg-green-50 px-4 py-3.5 mb-4">
          <p className="text-[10.5px] uppercase tracking-wide text-ink-faint font-semibold mb-1">
            E-mail
          </p>
          <p className="font-mono-num font-semibold text-green-800 break-all">{pixKey}</p>
        </div>

        <button type="button" onClick={copyPix} className="btn-primary btn-md w-full">
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar chave PIX
            </>
          )}
        </button>
      </div>

      <div className="note-inline max-w-xl">
        <div className="w-[26px] h-[26px] rounded-lg bg-surface border border-line flex items-center justify-center shrink-0">
          <Info className="w-3.5 h-3.5 text-green-700" />
        </div>
        <div>
          <strong className="block text-[13px] text-ink mb-0.5">Antes de pagar</strong>
          <ul className="list-none text-[12.5px] text-ink-soft leading-[1.8]">
            <li>· Confirme o valor de R$ 7,00</li>
            <li>· Use a chave exatamente como aparece acima</li>
            <li>· Guarde o comprovante para agilizar a confirmação</li>
          </ul>
        </div>
      </div>

      <div className="card p-5 flex items-start gap-3.5 max-w-xl">
        <div className="icon-badge-lg mb-0">
          <Camera className="w-[15px] h-[15px] text-green-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink mb-1">Comprovante</h3>
          <p className="text-[12.5px] text-ink-soft leading-relaxed">
            Após o pagamento, envie o comprovante para agilizar a confirmação no extrato.
          </p>
          <button type="button" className="btn-ghost btn-sm mt-3 -ml-2">
            Enviar comprovante
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
