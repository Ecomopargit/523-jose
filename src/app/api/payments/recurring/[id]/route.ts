import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/lib/api-auth";
import { cancelRecurringPayment, publicRecurringPayload } from "@/lib/recurring-payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuthUser(request);
    const { id } = await params;
    const payment = await cancelRecurringPayment(id, user.uid);
    return NextResponse.json({ payment: publicRecurringPayload(payment) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao cancelar recorrência." }, { status: error instanceof AuthError ? error.status : 500 });
  }
}
