import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/lib/api-auth";
import { getDeposit, publicDepositPayload, syncDeposit } from "@/lib/deposit-payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  try {
    const decoded = await requireAuthUser(request);
    const { id } = await context.params;
    const payment = await getDeposit(id);
    if (!payment) return NextResponse.json({ error: "Depósito não encontrado." }, { status: 404 });
    if (payment.memberId !== decoded.uid) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    return NextResponse.json({ payment: publicDepositPayload(await syncDeposit(payment)) });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("deposit GET", error);
    return NextResponse.json({ error: "Falha ao consultar depósito." }, { status: 500 });
  }
}
