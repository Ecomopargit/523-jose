"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { Camera, QrCode, Copy, Check } from "lucide-react";

export default function PagamentosPage() {
  const [copied, setCopied] = useState(false);
  const pixKey = "contato@ecomopar.org";

  const copyPix = async () => {
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell title="Envio de pagamento" showBack backHref="/dashboard">
      <div className="card p-6 text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-brand" />
        </div>
        <h2 className="text-lg font-bold text-brand mb-2">Depósito diário via PIX</h2>
        <p className="text-sm text-gray-600 mb-6">
          Envie <strong className="text-brand">R$ 7,00</strong> por dia. R$ 5,00 vão para sua
          reserva e R$ 2,00 para o custeio do instituto.
        </p>

        <div className="bg-surface rounded-2xl p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Chave PIX</p>
          <p className="font-semibold text-brand break-all">{pixKey}</p>
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

      <div className="card p-5 flex items-start gap-4">
        <Camera className="w-6 h-6 text-brand shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand mb-1">Comprovante</h3>
          <p className="text-sm text-gray-600">
            Após o pagamento, você pode enviar o comprovante para agilizar a confirmação do
            depósito no seu extrato.
          </p>
          <button type="button" className="btn-ghost btn-sm mt-3">
            Enviar comprovante
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
