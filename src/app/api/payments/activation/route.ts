import { NextRequest, NextResponse } from "next/server";

import { publicActivationPayload } from "@/lib/activation-constants";
import { createMemberActivationPayment } from "@/lib/activation-payments";
import { AuthError, getMemberDoc, requireAuthUser } from "@/lib/api-auth";
import { getMercadoPagoNotificationBaseUrl } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const decoded = await requireAuthUser(request);
    const member = await getMemberDoc(decoded.uid);

    if (!member) {
      return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
    }
    if (member.role === "admin") {
      return NextResponse.json({ error: "Conta administrativa não precisa de ativação." }, { status: 400 });
    }
    if (member.status === "ativo") {
      return NextResponse.json({ error: "Cadastro já está ativo." }, { status: 409 });
    }
    if (member.status === "bloqueado") {
      return NextResponse.json({ error: "Conta bloqueada. Fale com o suporte." }, { status: 403 });
    }

    const email = String(member.email || decoded.email || "");
    const nome = String(member.nome || decoded.name || "Associado");
    if (!email) {
      return NextResponse.json({ error: "E-mail do associado não encontrado." }, { status: 400 });
    }

    const notificationUrl = `${getMercadoPagoNotificationBaseUrl(request.nextUrl.origin)}/api/webhooks/mercadopago`;
    const payment = await createMemberActivationPayment({
      memberId: decoded.uid,
      email,
      nome,
      notificationUrl,
    });

    return NextResponse.json({ payment: publicActivationPayload(payment) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("activation POST", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao criar cobrança PIX." },
      { status: 500 },
    );
  }
}
