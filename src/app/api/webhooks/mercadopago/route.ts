import { NextRequest, NextResponse } from "next/server";

import {
  applyApprovedActivation,
  getActivationPaymentByMpId,
  syncActivationPaymentStatus,
} from "@/lib/activation-payments";
import { getMercadoPagoPayment, mapMpStatus, verifyMercadoPagoWebhook } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      data?: { id?: string | number };
      type?: string;
      action?: string;
    };

    const dataId = body?.data?.id != null ? String(body.data.id) : null;
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (
      !verifyMercadoPagoWebhook({
        xSignature,
        xRequestId,
        dataId,
      })
    ) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    if (!dataId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Sempre reconsulta o pagamento na API MP (fonte da verdade).
    const mp = await getMercadoPagoPayment(dataId);
    const status = mapMpStatus(mp.status);
    const payment = await getActivationPaymentByMpId(String(mp.id || dataId));

    if (!payment) {
      return NextResponse.json({ ok: true, ignored: "payment_not_found" });
    }

    if (status === "approved") {
      await applyApprovedActivation(payment);
    } else {
      await syncActivationPaymentStatus(payment);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("mercadopago webhook", error);
    // Retorna 200 para evitar retries agressivos em erros de parsing já logados;
    // falhas de processamento importantes já foram logadas.
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "webhook_error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "mercadopago-webhook" });
}
