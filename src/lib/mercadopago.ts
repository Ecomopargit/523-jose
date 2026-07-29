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

export async function createActivationPixPayment(input: {
  memberId: string;
  email: string;
  nome: string;
  notificationUrl?: string;
  idempotencyKey: string;
}) {
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
  };
}

export async function getMercadoPagoPayment(mpPaymentId: string) {
  const payment = new Payment(getMercadoPagoClient());
  return payment.get({ id: mpPaymentId });
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
