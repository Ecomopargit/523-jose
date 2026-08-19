import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "admin@ecomopar.org";

export async function requireAuthUser(request: NextRequest) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    throw new AuthError(401, "Faça login para continuar.");
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    throw new AuthError(401, "Sessão inválida ou expirada.");
  }
}

export async function getMemberDoc(uid: string) {
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as Record<string, unknown>) } as {
    id: string;
    role?: string;
    status?: string;
    email?: string;
    nome?: string;
    [key: string]: unknown;
  };
}

export async function requireAdminUser(request: NextRequest) {
  const authUser = await requireAuthUser(request);
  const member = await getMemberDoc(authUser.uid);
  const isAdmin = member?.role === "admin" || authUser.email?.toLowerCase() === ADMIN_EMAIL;
  if (!isAdmin) {
    throw new AuthError(403, "Acesso restrito ao administrador.");
  }
  return { authUser, member };
}

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
