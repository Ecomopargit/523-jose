import { NextRequest, NextResponse } from "next/server";
import { AuthError, getMemberDoc, requireAuthUser } from "@/lib/api-auth";
import { getMercadoPagoNotificationBaseUrl } from "@/lib/mercadopago";
import { canContributeDaily } from "@/lib/member-status";
import { createRecurringPayment, listRecurringPayments, publicRecurringPayload } from "@/lib/recurring-payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const payments = await listRecurringPayments(user.uid);
    return NextResponse.json({ payments: payments.map(publicRecurringPayload) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao consultar recorrências." }, { status: error instanceof AuthError ? error.status : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = await request.json() as { amount?: number; days?: number };
    const amount = Math.round(Number(body.amount) * 100) / 100;
    const days = Math.trunc(Number(body.days));
    if (!Number.isFinite(amount) || amount < 7 || amount > 5000) return NextResponse.json({ error: "O valor diário deve ser entre R$ 7,00 e R$ 5.000,00." }, { status: 400 });
    if (!Number.isInteger(days) || days < 1 || days > 365) return NextResponse.json({ error: "Escolha entre 1 e 365 dias de recorrência." }, { status: 400 });
    const member = await getMemberDoc(user.uid);
    if (!member || !canContributeDaily(String(member.status || ""))) {
      return NextResponse.json({ error: "Ative seu cadastro antes de contratar uma recorrência." }, { status: 403 });
    }
    const publicSiteUrl = getMercadoPagoNotificationBaseUrl(request.nextUrl.origin);
    const payment = await createRecurringPayment({
      memberId: user.uid,
      email: String(member.email || user.email || ""),
      amount,
      days,
      backUrl: `${publicSiteUrl}/dashboard/pagamentos?recorrencia=sucesso`,
      notificationUrl: `${publicSiteUrl}/api/webhooks/mercadopago`,
    });
    return NextResponse.json({ payment: publicRecurringPayload(payment) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao criar recorrência." }, { status: error instanceof AuthError ? error.status : 500 });
  }
}
