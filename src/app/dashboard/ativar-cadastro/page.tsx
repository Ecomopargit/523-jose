"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  Loader2,
  QrCode,
  Sparkles,
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/components/AuthProvider";
import {
  createActivationPayment,
  downloadActivationReceipt,
  getActivationPayment,
  type PublicActivationPayment,
} from "@/lib/activation-client";

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AtivarCadastroPage() {
  const { member, ready, refreshProfile } = useAuth();
  const [payment, setPayment] = useState<PublicActivationPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const approved = payment?.status === "approved" || member?.status === "ativo";

  const startActivation = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const created = await createActivationPayment();
      setPayment(created);
      setPolling(created.status === "pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar o PIX.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!payment?.id || payment.status !== "pending" || !polling) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const next = await getActivationPayment(payment.id);
        if (cancelled) return;
        setPayment(next);
        if (next.status === "approved") {
          setPolling(false);
          await refreshProfile();
        } else if (next.status !== "pending") {
          setPolling(false);
        }
      } catch {
        /* keep polling */
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [payment?.id, payment?.status, polling, refreshProfile]);

  async function copyPix() {
    if (!payment?.qrCode) return;
    await navigator.clipboard.writeText(payment.qrCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    if (!payment?.id) return;
    setDownloading(true);
    setError("");
    try {
      const blob = await downloadActivationReceipt(payment.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comprovante-ativacao-${payment.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao baixar comprovante.");
    } finally {
      setDownloading(false);
    }
  }

  if (!ready) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-8 text-center text-sm text-ink-soft">Carregando…</div>
      </DashboardShell>
    );
  }

  if (approved) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-8 text-center max-w-xl animate-fade-up mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-3">Cadastro ativado!</h2>
          <p className="text-ink-soft text-sm mb-4 leading-relaxed">
            Seu PIX de {money(7)} foi confirmado. Enviamos o comprovante para{" "}
            <strong className="text-ink">{member?.email}</strong>.
          </p>
          <p className="text-[12.5px] text-ink-faint mb-6">
            R$ 2,00 deste valor correspondem à taxa por transação (já incluídos).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {payment?.id ? (
              <button
                type="button"
                className="btn-primary btn-md"
                disabled={downloading}
                onClick={() => void handleDownload()}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando…
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Baixar comprovante
                  </>
                )}
              </button>
            ) : null}
            <Link href="/dashboard" className="btn-ghost btn-md">
              Ir ao início
            </Link>
          </div>
          {error ? <p className="text-sm text-brick-600 mt-4">{error}</p> : null}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="space-y-5 animate-fade-up max-w-xl mx-auto">
        <div className="plan-banner !mb-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-green-900 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-ink-soft">Adesão ECOMOPAR</p>
              <p className="font-display text-base font-semibold">Ativar cadastro via PIX</p>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div>
            <p className="text-[13px] text-ink-soft">Valor da ativação</p>
            <p className="font-display text-3xl font-bold font-mono-num mt-1">{money(7)}</p>
            <p className="text-[12.5px] text-ink-faint mt-2">
              R$ 2,00 deste valor correspondem à taxa por transação (já incluídos no total).
            </p>
          </div>

          {!payment ? (
            <button
              type="button"
              className="btn-primary btn-lg w-full"
              disabled={loading}
              onClick={() => void startActivation()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PIX…
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Gerar PIX de ativação
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              {payment.qrCodeBase64 ? (
                <div className="flex justify-center rounded-[18px] border border-line-soft bg-white p-4">
                  <Image
                    alt="QR Code PIX"
                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                    width={220}
                    height={220}
                    unoptimized
                  />
                </div>
              ) : null}

              <div>
                <p className="text-[13px] font-semibold mb-1.5">PIX copia e cola</p>
                <div className="rounded-[14px] border border-line-soft bg-green-50/60 p-3 text-[11.5px] break-all font-mono text-ink-soft">
                  {payment.qrCode}
                </div>
                <button type="button" className="btn-ghost btn-md w-full mt-3" onClick={() => void copyPix()}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Código copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar código PIX
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-[14px] border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] text-ink-soft flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                Aguardando confirmação do pagamento…
              </div>
            </div>
          )}

          {error ? (
            <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
              {error}
            </div>
          ) : null}
        </div>

        <Link href="/dashboard" className="btn-ghost btn-md w-full text-center block">
          Voltar ao início
        </Link>
      </div>
    </DashboardShell>
  );
}
