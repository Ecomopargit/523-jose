import { NextRequest, NextResponse } from "next/server";

import {
  getActivationPayment,
  getActivationReceiptPdf,
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
    let payment = await getActivationPayment(id);

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
    }
    if (payment.memberId !== decoded.uid) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (payment.status !== "approved") {
      payment = await syncActivationPaymentStatus(payment);
    }

    const pdf = await getActivationReceiptPdf(payment);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="comprovante-ativacao-${payment.mpPaymentId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("activation receipt GET", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao gerar comprovante." },
      { status: 500 },
    );
  }
}
