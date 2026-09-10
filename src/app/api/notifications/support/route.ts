import { NextRequest, NextResponse } from "next/server";

import { AuthError, getMemberDoc, requireAuthUser } from "@/lib/api-auth";
import {
  getAdminPushTokens,
  getUserPushTokens,
  sendExpoPush,
} from "@/lib/push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  direction?: "member_to_admin" | "admin_to_member";
  chatId?: string;
  preview?: string;
  memberName?: string;
};

function clip(text: string, max = 120) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as Body;
    const direction = body.direction;
    const chatId = String(body.chatId || "").trim();
    const preview = clip(String(body.preview || "Nova mensagem"));
    const memberName = String(body.memberName || "Associado").trim() || "Associado";

    if (!direction || !chatId) {
      return NextResponse.json({ error: "Dados incompletos para o push." }, { status: 400 });
    }

    if (direction === "member_to_admin") {
      if (authUser.uid !== chatId) {
        return NextResponse.json({ error: "Sem permissão para este chat." }, { status: 403 });
      }
      const tokens = await getAdminPushTokens();
      if (!tokens.length) {
        return NextResponse.json({ ok: true, sent: 0, reason: "no_admin_tokens" });
      }
      const result = await sendExpoPush([
        {
          to: tokens,
          title: "Nova mensagem de suporte",
          body: `${memberName}: ${preview}`,
          sound: "default",
          channelId: "support-messages",
          priority: "high",
          data: {
            type: "support_message",
            chatId,
            direction,
          },
        },
      ]);
      return NextResponse.json(result);
    }

    if (direction === "admin_to_member") {
      const member = await getMemberDoc(authUser.uid);
      const isAdmin =
        member?.role === "admin" ||
        authUser.email?.toLowerCase() === "admin@ecomopar.org";
      if (!isAdmin) {
        return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
      }
      const tokens = await getUserPushTokens(chatId);
      if (!tokens.length) {
        return NextResponse.json({ ok: true, sent: 0, reason: "no_member_tokens" });
      }
      const result = await sendExpoPush([
        {
          to: tokens,
          title: "ECOMOPAR Suporte",
          body: preview,
          sound: "default",
          channelId: "support-messages",
          priority: "high",
          data: {
            type: "support_message",
            chatId,
            direction,
          },
        },
      ]);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Direção inválida." }, { status: 400 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("support push POST", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao enviar notificação." },
      { status: 500 },
    );
  }
}
