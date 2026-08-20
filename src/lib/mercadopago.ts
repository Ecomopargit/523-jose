import { MercadoPagoConfig, Payment } from "mercadopago";
import { createHmac, timingSafeEqual } from "crypto";

import {
  ACTIVATION_AMOUNT,
  ACTIVATION_FEE_AMOUNT,
  ACTIVATION_RESERVE_AMOUNT,
} from "@/lib/activation-constants";

export function getMercadoPagoAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");
  }
  return token;
}

export function getMercadoPagoClient() {
  return new MercadoPagoConfig({ accessToken: getMercadoPagoAccessToken() });
}

type PixPaymentResult = {
  mpPaymentId: string;
  status: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  expiresAt: string | null;
  simulated: boolean;
};

type MercadoPagoOrder = {
  id?: string;
  status?: string;
  status_detail?: string;
  expiration_time?: string;
  transactions?: {
    payments?: Array<{
      id?: string;
      status?: string;
      status_detail?: string;
      payment_method?: {
        qr_code?: string;
        qr_code_base64?: string;
        ticket_url?: string;
      };
    }>;
  };
};

/**
 * A API de Orders usa outro vocabulário de status ("processed", "canceled").
 * Traduzimos para o vocabulário de Payments consumido por mapMpStatus.
 */
function normalizeOrderStatus(order: MercadoPagoOrder) {
  const candidates = [
    order.status,
    order.status_detail,
    ...(order.transactions?.payments ?? []).flatMap((payment) => [
      payment.status,
      payment.status_detail,
    ]),
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  if (candidates.some((value) => ["processed", "approved", "accredited"].includes(value))) {
    return "approved";
  }
  if (candidates.some((value) => ["canceled", "cancelled"].includes(value))) return "cancelled";
  if (candidates.some((value) => ["failed", "rejected"].includes(value))) return "rejected";
  if (candidates.some((value) => value === "expired")) return "expired";
  return "pending";
}

let cachedTestCredential: Promise<boolean> | null = null;

/**
 * Credenciais de teste não podem emitir PIX pela API de Payments (401
 * "Unauthorized use of live credentials"); nesse caso usamos a API de Orders.
 * A detecção é automática para não depender de variável de ambiente em runtime,
 * mas MERCADOPAGO_TEST_MODE continua valendo como override explícito.
 */
async function isMercadoPagoTestMode() {
  const explicit = process.env.MERCADOPAGO_TEST_MODE?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;

  if (!cachedTestCredential) {
    cachedTestCredential = fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${getMercadoPagoAccessToken()}` },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const account = (await response.json()) as { tags?: string[] };
        return Array.isArray(account.tags) && account.tags.includes("test_user");
      })
      .catch(() => false);
  }
  return cachedTestCredential;
}

function buildExternalReference(type: "activation" | "deposit", memberId: string) {
  // Orders API (credenciais de teste) não aceita ":" no external_reference.
  return `${type}_${memberId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}

function mercadoPagoErrorMessage(result: {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string; details?: string[] }>;
}) {
  const details = (result.errors ?? [])
    .flatMap((entry) => [entry.message, ...(entry.details ?? [])])
    .filter(Boolean)
    .join(" · ");
  return details || result.message || result.error || "Mercado Pago recusou o PIX.";
}

async function createTestPixOrder(input: {
  memberId: string;
  amount: number;
  type: "activation" | "deposit";
  idempotencyKey: string;
}): Promise<PixPaymentResult> {
  const response = await fetch("https://api.mercadopago.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getMercadoPagoAccessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      type: "online",
      external_reference: buildExternalReference(input.type, input.memberId),
      total_amount: input.amount.toFixed(2),
      payer: {
        email: "test_user_br@testuser.com",
        first_name: "APRO",
      },
      transactions: {
        payments: [
          {
            amount: input.amount.toFixed(2),
            payment_method: {
              id: "pix",
              type: "bank_transfer",
            },
          },
        ],
      },
    }),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as MercadoPagoOrder & {
    message?: string;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(mercadoPagoErrorMessage(result));
  }

  const transaction = result.transactions?.payments?.[0];
  const paymentMethod = transaction?.payment_method;
  if (!result.id || !paymentMethod?.qr_code) {
    throw new Error("Mercado Pago não retornou o QR Code PIX de teste.");
  }

  return {
    // No Checkout API Orders, a consulta deve usar o ID ORD da ordem.
    mpPaymentId: String(result.id),
    status: normalizeOrderStatus(result),
    qrCode: String(paymentMethod.qr_code),
    qrCodeBase64: String(paymentMethod.qr_code_base64 || ""),
    ticketUrl: String(paymentMethod.ticket_url || ""),
    expiresAt: result.expiration_time ? String(result.expiration_time) : null,
    simulated: true,
  };
}

export async function createActivationPixPayment(input: {
  memberId: string;
  email: string;
  nome: string;
  notificationUrl?: string;
  idempotencyKey: string;
}) {
  if (await isMercadoPagoTestMode()) {
    return createTestPixOrder({
      memberId: input.memberId,
      amount: ACTIVATION_AMOUNT,
      type: "activation",
      idempotencyKey: input.idempotencyKey,
    });
  }

  const payment = new Payment(getMercadoPagoClient());
  const result = await payment.create({
    body: {
      transaction_amount: ACTIVATION_AMOUNT,
      description: "Ativação de cadastro ECOMOPAR",
      payment_method_id: "pix",
      notification_url: input.notificationUrl,
      external_reference: `activation:${input.memberId}`,
      metadata: {
        type: "activation",
        memberId: input.memberId,
        feeAmount: ACTIVATION_FEE_AMOUNT,
        reserveAmount: ACTIVATION_RESERVE_AMOUNT,
      },
      payer: {
        email: input.email,
        first_name: input.nome.split(" ")[0] || "Associado",
        last_name: input.nome.split(" ").slice(1).join(" ") || "ECOMOPAR",
      },
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    requestOptions: {
      idempotencyKey: input.idempotencyKey,
    },
  });

  const transactionData = result.point_of_interaction?.transaction_data;
  if (!result.id || !transactionData?.qr_code) {
    throw new Error("Mercado Pago não retornou QR Code PIX.");
  }

  return {
    mpPaymentId: String(result.id),
    status: String(result.status || "pending"),
    qrCode: String(transactionData.qr_code),
    qrCodeBase64: String(transactionData.qr_code_base64 || ""),
    ticketUrl: String(transactionData.ticket_url || ""),
    expiresAt: result.date_of_expiration ? String(result.date_of_expiration) : null,
    simulated: false,
  };
}

export async function createDepositPixPayment(input: {
  memberId: string;
  email: string;
  nome: string;
  amount: number;
  notificationUrl?: string;
  idempotencyKey: string;
}) {
  if (await isMercadoPagoTestMode()) {
    return createTestPixOrder({
      memberId: input.memberId,
      amount: input.amount,
      type: "deposit",
      idempotencyKey: input.idempotencyKey,
    });
  }

  const payment = new Payment(getMercadoPagoClient());
  const result = await payment.create({
    body: {
      transaction_amount: input.amount,
      description: "Depósito na reserva ECOMOPAR",
      payment_method_id: "pix",
      notification_url: input.notificationUrl,
      external_reference: `deposit:${input.memberId}`,
      metadata: { type: "deposit", memberId: input.memberId },
      payer: {
        email: input.email,
        first_name: input.nome.split(" ")[0] || "Associado",
        last_name: input.nome.split(" ").slice(1).join(" ") || "ECOMOPAR",
      },
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    requestOptions: { idempotencyKey: input.idempotencyKey },
  });

  const transactionData = result.point_of_interaction?.transaction_data;
  if (!result.id || !transactionData?.qr_code) {
    throw new Error("Mercado Pago não retornou o QR Code do depósito.");
  }
  return {
    mpPaymentId: String(result.id),
    status: String(result.status || "pending"),
    qrCode: String(transactionData.qr_code),
    qrCodeBase64: String(transactionData.qr_code_base64 || ""),
    ticketUrl: String(transactionData.ticket_url || ""),
    expiresAt: result.date_of_expiration ? String(result.date_of_expiration) : null,
    simulated: false,
  };
}

export async function getMercadoPagoPayment(mpPaymentId: string) {
  if (mpPaymentId.startsWith("ORD")) {
    const response = await fetch(
      `https://api.mercadopago.com/v1/orders/${encodeURIComponent(mpPaymentId)}`,
      {
        headers: { Authorization: `Bearer ${getMercadoPagoAccessToken()}` },
        cache: "no-store",
      },
    );
    const order = (await response.json().catch(() => ({}))) as MercadoPagoOrder & {
      message?: string;
      error?: string;
    };
    if (!response.ok) {
      throw new Error(order.message || order.error || "Falha ao consultar o PIX de teste.");
    }
    return {
      id: order.id || mpPaymentId,
      status: normalizeOrderStatus(order),
    };
  }

  const payment = new Payment(getMercadoPagoClient());
  return payment.get({ id: mpPaymentId });
}

/** PIX antigo (outra conta/token) ou expirado no MP — mensagem típica: "does not exist" / 404. */
export function isMercadoPagoMissingPaymentError(error: unknown) {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return /not found|does not exist|n[aã]o encontr|resource not found|\b404\b|invalid_payment_id/.test(
    message,
  );
}

export async function mercadoPagoPaymentExists(mpPaymentId: string) {
  if (!mpPaymentId.trim()) return false;
  try {
    await getMercadoPagoPayment(mpPaymentId);
    return true;
  } catch (error) {
    if (isMercadoPagoMissingPaymentError(error)) return false;
    throw error;
  }
}

/** URL pública para webhook/notificação do PIX (precisa ser HTTPS acessível). */
export function getMercadoPagoNotificationBaseUrl(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim();
  if (configured && !/localhost|127\.0\.0\.1/.test(configured)) {
    return configured;
  }
  if (fallbackOrigin && !/localhost|127\.0\.0\.1/.test(fallbackOrigin)) {
    return fallbackOrigin.replace(/\/$/, "");
  }
  return "https://ecomopar.netlify.app";
}

export function mapMpStatus(status?: string | null): "pending" | "approved" | "rejected" | "cancelled" | "expired" {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    default:
      return "pending";
  }
}

/** Valida assinatura de webhook Mercado Pago (x-signature / x-request-id). */
export function verifyMercadoPagoWebhook(input: {
  xSignature?: string | null;
  xRequestId?: string | null;
  dataId?: string | null;
}) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Em sandbox sem secret configurado, aceitamos e revalidamos pelo GET do pagamento.
    return true;
  }
  if (!input.xSignature || !input.dataId) return false;

  const parts = Object.fromEntries(
    input.xSignature.split(",").map((chunk) => {
      const [k, v] = chunk.split("=");
      return [k?.trim(), v?.trim()];
    }),
  ) as Record<string, string | undefined>;

  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash) return false;

  const manifest = `id:${input.dataId};request-id:${input.xRequestId || ""};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(hash, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
