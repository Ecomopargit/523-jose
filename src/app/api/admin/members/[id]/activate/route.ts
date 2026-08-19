import { NextRequest, NextResponse } from "next/server";

import { AuthError, requireAdminUser } from "@/lib/api-auth";
import { activateMemberAdmin } from "@/lib/member-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdminUser(_request);
    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Associado inválido." }, { status: 400 });
    }

    const result = await activateMemberAdmin(id.trim());
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível ativar a conta." },
      { status: 500 },
    );
  }
}
