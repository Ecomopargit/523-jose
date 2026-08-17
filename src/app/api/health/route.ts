import { adminAuth } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await adminAuth.listUsers(1);
    return Response.json({ ok: true, backend: "firebase-admin" });
  } catch (error) {
    console.error("Firebase Admin health check failed", error);
    return Response.json(
      { ok: false, backend: "firebase-admin" },
      { status: 503 },
    );
  }
}
