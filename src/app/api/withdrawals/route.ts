import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { AuthError, requireAuthUser } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthUser(request);
    const body = (await request.json()) as {
      value?: number;
      pixKey?: string;
      note?: string;
    };
    const value = Number(body.value);
    if (!Number.isFinite(value) || value < 10) {
      return NextResponse.json({ error: "O saque mínimo é de R$ 10,00." }, { status: 400 });
    }
    if (!body.pixKey?.trim()) {
      return NextResponse.json({ error: "Informe uma chave PIX." }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(authUser.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Associado não encontrado." }, { status: 404 });
    }
    const member = userSnap.data()!;
    const lockedUntil = member.withdrawalLockedUntil
      ? new Date(String(member.withdrawalLockedUntil))
      : null;
    if (member.aderiuIndicacao && lockedUntil && lockedUntil.getTime() > Date.now()) {
      return NextResponse.json(
        {
          error: `Sua campanha possui carência de 90 dias. Saques serão liberados em ${lockedUntil.toLocaleDateString("pt-BR")}.`,
          lockedUntil: lockedUntil.toISOString(),
        },
        { status: 403 },
      );
    }

    const available = Number(member.saldoDisponivel || 0) + Number(member.saldoBonus || 0);
    if (value > available) {
      return NextResponse.json({ error: "Saldo insuficiente." }, { status: 400 });
    }

    const ref = adminDb.collection("withdrawals").doc();
    await ref.set({
      memberId: authUser.uid,
      memberName: String(member.nome || "Associado"),
      memberCpf: String(member.cpf || ""),
      value,
      pixKey: body.pixKey.trim(),
      note: body.note?.trim() || "",
      status: "solicitado",
      requestedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      adminNote: "",
    });
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível registrar o saque." },
      { status: 500 },
    );
  }
}
