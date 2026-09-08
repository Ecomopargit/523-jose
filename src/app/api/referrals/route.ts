import { NextRequest, NextResponse } from "next/server";

import { AuthError, requireAuthUser } from "@/lib/api-auth";
import { ensureReferralProfile, getReferralDashboard } from "@/lib/referrals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      referralCode?: string;
      joinCampaign?: boolean;
    };
    const result = await ensureReferralProfile({
      uid: user.uid,
      referralCode: body.referralCode,
      joinCampaign: body.joinCampaign,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao registrar indicação." },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const joinCampaign =
      request.nextUrl.searchParams.get("join") === "1" ||
      request.nextUrl.searchParams.get("joinCampaign") === "true";
    return NextResponse.json(await getReferralDashboard(user.uid, { joinCampaign }));
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao carregar indicações." },
      { status: 500 },
    );
  }
}
