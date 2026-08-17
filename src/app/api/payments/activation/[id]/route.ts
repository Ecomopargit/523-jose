import { NextRequest, NextResponse } from "next/server";

import { publicActivationPayload } from "@/lib/activation-constants";
import {
  cancelPendingActivationPayment,
  getActivationPayment,
  syncActivationPaymentStatus,
} from "@/lib/activation-payments";
import { AuthError, requireAuthUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  try {
    const decoded = await requireAuthUser(request);
    const { id } = await context.params;
    const payment = await getActivationPayment(id);

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
    }
    if (payment.memberId !== decoded.uid) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const synced = await syncActivationPaymentStatus(payment);
    return NextResponse.json({ payment: publicActivationPayload(synced) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("activation GET", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao consultar pagamento." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: Ctx) {
  try {
    const decoded = await requireAuthUser(request);
    const { id } = await context.params;
    const cancelled = await cancelPendingActivationPayment(id, decoded.uid);
    if (!cancelled) {
      return NextResponse.json({ error: "PIX não encontrado ou não pode ser substituído." }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("activation DELETE", error);
    return NextResponse.json({ error: "Falha ao substituir cobrança PIX." }, { status: 500 });
  }
}
