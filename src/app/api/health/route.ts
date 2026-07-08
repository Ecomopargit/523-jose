export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  return Response.json(
    { ok: configured, backend: "firebase" },
    { status: configured ? 200 : 500 },
  );
}
