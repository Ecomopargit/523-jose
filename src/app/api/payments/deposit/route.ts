import { NextRequest, NextResponse } from "next/server";
import { AuthError, getMemberDoc, requireAuthUser } from "@/lib/api-auth";
import { createMemberDeposit, publicDepositPayload } from "@/lib/deposit-payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const decoded = await requireAuthUser(request);
    const body = await request.json() as { amount?: number };
    const amount = Math.round(Number(body.amount) * 100) / 100;
    if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
      return NextResponse.json({ error: "Informe um valor entre R$ 1,00 e R$ 5.000,00." }, { status: 400 });
    }
    const member = await getMemberDoc(decoded.uid);
    if (!member || member.status !== "ativo") {
      return NextResponse.json({ error: "Ative seu cadastro antes de fazer depósitos." }, { status: 403 });
    }
    const payment = await createMemberDeposit({
      memberId: decoded.uid,
      email: String(member.email || decoded.email || ""),
      nome: String(member.nome || decoded.name || "Associado"),
      amount,
      notificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/api/webhooks/mercadopago`,
    });
    return NextResponse.json({ payment: publicDepositPayload(payment) });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("deposit POST", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao gerar PIX." }, { status: 500 });
  }
}
