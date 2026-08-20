"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  QrCode,
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/components/AuthProvider";
import {
  createDepositPayment,
  getDepositPayment,
  type PublicDepositPayment,
} from "@/lib/deposit-client";
import { listMemberDepositPayments } from "@/lib/deposit-store";
import { brl } from "@/lib/dashboard-meta";

type Step = "form" | "pix" | "success";

const quickValues = [7, 35, 70, 150];

const statusLabel: Record<PublicDepositPayment["status"], string> = {
  pending: "Aguardando PIX",
  approved: "Confirmado",
  rejected: "Recusado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

export default function PagamentosPage() {
  const { member, ready, refreshProfile } = useAuth();
  const [amount, setAmount] = useState("7");
  const [step, setStep] = useState<Step>("form");
  const [payment, setPayment] = useState<PublicDepositPayment | null>(null);
  const [history, setHistory] = useState<PublicDepositPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const value = Number(amount.replace(",", "."));
  const isActive = member?.status === "ativo";

  const loadHistory = useCallback(async () => {
    if (!member?.id) {
      setHistory([]);
      return;
    }
    try {
      setHistory(await listMemberDepositPayments(member.id));
    } catch {
      setHistory([]);
    }
  }, [member?.id]);

  useEffect(() => {
    if (!ready) return;
    void loadHistory();
  }, [ready, loadHistory]);

  useEffect(() => {
    if (step !== "pix" || !payment?.id || payment.status !== "pending") return;

    let cancelled = false;
    const tick = async () => {
      try {
        const next = await getDepositPayment(payment.id);
        if (cancelled) return;
        setPayment(next);
        if (next.status === "approved") {
          await refreshProfile();
          await loadHistory();
          setStep("success");
        } else if (["expired", "rejected", "cancelled"].includes(next.status)) {
          setError("Este PIX expirou ou foi recusado. Gere uma nova cobrança.");
          setStep("form");
          setPayment(null);
          await loadHistory();
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
  }, [step, payment?.id, payment?.status, refreshProfile, loadHistory]);

  async function generatePix() {
    setError("");
    if (!isActive) {
      setError("Ative seu cadastro antes de fazer depósitos.");
      return;
    }
    if (!Number.isFinite(value) || value < 1) {
      setError("Informe um valor de no mínimo R$ 1,00.");
      return;
    }
    if (value > 5000) {
      setError("O depósito máximo por operação é R$ 5.000,00.");
      return;
    }
    setLoading(true);
    try {
      const created = await createDepositPayment(value);
      setPayment(created);
      setStep("pix");
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar o PIX.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!payment?.qrCode) return;
    await navigator.clipboard.writeText(payment.qrCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function checkNow() {
    if (!payment?.id) return;
    setLoading(true);
    setError("");
    try {
      const next = await getDepositPayment(payment.id);
      setPayment(next);
      if (next.status === "approved") {
        await refreshProfile();
        await loadHistory();
        setStep("success");
      } else {
        setError("Pagamento ainda não identificado. Aguarde alguns segundos.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao consultar o PIX.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setStep("form");
    setPayment(null);
    setError("");
    setCopied(false);
  }

  const expires = payment?.expiresAt
    ? new Date(payment.expiresAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (!ready) {
    return (
      <DashboardShell>
        <div className="card p-8 text-center text-sm text-ink-soft">Carregando…</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 items-start animate-fade-up">
        <div className="space-y-5">
          {!isActive ? (
            <Link
              href="/dashboard/ativar-cadastro"
              className="card p-4 sm:p-5 flex items-center gap-3.5 border-amber-200 bg-amber-50 hover:bg-amber-50/80 transition-colors"
            >
              <div className="icon-badge-lg icon-badge-amber mb-0">
                <Clock className="w-[15px] h-[15px] text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Cadastro ainda não ativo</p>
                <p className="text-[12.5px] text-ink-soft mt-0.5 leading-relaxed">
                  Ative sua conta pelo PIX de R$ 7 para liberar depósitos na reserva.
                </p>
              </div>
            </Link>
          ) : null}

          <div className="card p-6 sm:p-7">
            {step === "form" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">
                    Novo depósito
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mt-1">
                    Escolha o valor do PIX
                  </h2>
                  <p className="text-[13px] text-ink-soft mt-1.5 leading-relaxed">
                    Gere o QR Code ou o código copia e cola para pagar no app do seu banco.
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2" htmlFor="deposit-amount">
                    Valor
                  </label>
                  <div className="flex items-center gap-2 rounded-[14px] border border-line bg-bg px-4 h-[60px]">
                    <span className="text-green-700 font-semibold">R$</span>
                    <input
                      id="deposit-amount"
                      className="w-full bg-transparent font-display font-bold text-2xl outline-none font-mono-num"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ""))}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {quickValues.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setAmount(String(item))}
                        className={`rounded-[12px] py-2.5 text-[12.5px] font-semibold transition-colors ${
                          value === item
                            ? "bg-green-700 text-white"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {brl(item).replace(",00", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="btn-primary btn-lg w-full"
                  disabled={loading || !isActive}
                  onClick={() => void generatePix()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando PIX…
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Gerar PIX
                    </>
                  )}
                </button>
              </div>
            ) : null}

            {step === "pix" && payment ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600">
                    PIX gerado
                  </p>
                  <p className="font-display font-mono-num text-3xl font-bold text-green-800 mt-2">
                    {brl(payment.amount)}
                  </p>
                  <p className="text-[13px] text-ink-soft mt-1">
                    Pague com QR Code ou copie o código abaixo.
                  </p>
                </div>

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
                    {payment.qrCode || "Código indisponível"}
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

                {expires ? (
                  <p className="text-center text-[12.5px] text-ink-faint">Válido até {expires}</p>
                ) : null}

                <div className="rounded-[14px] border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] text-ink-soft flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                  Aguardando confirmação do pagamento…
                </div>

                {error ? (
                  <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="btn-primary btn-md w-full"
                  disabled={loading}
                  onClick={() => void checkNow()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Já paguei, verificar
                    </>
                  )}
                </button>
                <button type="button" className="btn-ghost btn-md w-full" onClick={resetForm}>
                  Gerar outro valor
                </button>
              </div>
            ) : null}

            {step === "success" ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-700" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Depósito confirmado</h2>
                  <p className="font-display font-mono-num text-3xl font-bold text-green-800 mt-2">
                    {brl(payment?.amount || value)}
                  </p>
                  <p className="text-[13px] text-ink-soft mt-2">
                    O valor já entrou na sua reserva ECOMOPAR.
                  </p>
                </div>
                <button type="button" className="btn-primary btn-md w-full" onClick={resetForm}>
                  Fazer novo pagamento
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-line-soft">
            <h2 className="font-display text-lg font-semibold">Suas transferências</h2>
            <p className="text-xs text-ink-soft mt-1">Depósitos PIX realizados nesta conta</p>
          </div>

          {history.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-soft">
              Nenhuma transferência ainda. Quando você gerar e pagar um PIX, ele aparece aqui.
            </p>
          ) : (
            history.map((item) => {
              const Icon =
                item.status === "approved"
                  ? CheckCircle2
                  : item.status === "pending"
                    ? Clock
                    : XCircle;
              return (
                <div
                  key={item.id}
                  className="txn-row border-t border-line-soft first:border-t-0"
                >
                  <div className="icon-badge mb-0 w-9 h-9">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Depósito PIX</p>
                    <p className="text-xs text-ink-soft mt-1">
                      {statusLabel[item.status]}
                      {item.createdAt
                        ? ` · ${new Date(item.createdAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-num font-semibold text-sm">{brl(item.amount)}</p>
                    <span
                      className={
                        item.status === "approved"
                          ? "badge-confirmado"
                          : item.status === "pending"
                            ? "badge-pago"
                            : "badge-pago"
                      }
                    >
                      {statusLabel[item.status]}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
