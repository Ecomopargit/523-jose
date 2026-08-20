import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

import { auth, db } from "./firebase";
import type { MemberProfile } from "../types";

function apiBase() {
  return (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar.netlify.app").replace(/\/$/, "");
}

async function adminHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("Faça login para continuar.");
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export type AdminStats = {
  active: number;
  blocked: number;
  members: MemberProfile[];
  overdue: number;
  pending: number;
  total: number;
  totalAssets: number;
  totalAvailable: number;
  approvedPix: number;
  adminRevenue: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [snapshot, paymentSnapshot] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "activationPayments")),
  ]);
  const members = snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        nome: String(data.nome ?? ""),
        cpf: String(data.cpf ?? ""),
        email: String(data.email ?? ""),
        telefone: String(data.telefone ?? ""),
        dataNascimento: String(data.dataNascimento ?? ""),
        endereco: String(data.endereco ?? ""),
        cidade: String(data.cidade ?? ""),
        estado: String(data.estado ?? ""),
        cep: String(data.cep ?? ""),
        tipoVeiculo: String(data.tipoVeiculo ?? ""),
        modelo: String(data.modelo ?? ""),
        carroProprio: data.carroProprio || "",
        locadora: String(data.locadora ?? ""),
        placa: String(data.placa ?? ""),
        chavePix: String(data.chavePix ?? ""),
        aderiuIndicacao: Boolean(data.aderiuIndicacao),
        codigoIndicacao: String(data.codigoIndicacao ?? ""),
        referralCode: String(data.referralCode ?? ""),
        referredByUid: String(data.referredByUid ?? ""),
        referredByCode: String(data.referredByCode ?? ""),
        referralValidCount: Number(data.referralValidCount ?? 0),
        referralBonusPaidGroups: Number(data.referralBonusPaidGroups ?? 0),
        activatedAt: data.activatedAt?.toDate?.()?.toISOString() ?? (typeof data.activatedAt === "string" ? data.activatedAt : null),
        withdrawalLockedUntil: data.withdrawalLockedUntil?.toDate?.()?.toISOString() ?? (typeof data.withdrawalLockedUntil === "string" ? data.withdrawalLockedUntil : null),
        status: data.status || "pendente",
        role: data.role || "member",
        saldoDisponivel: Number(data.saldoDisponivel ?? 0),
        saldoBloqueado: Number(data.saldoBloqueado ?? 0),
        saldoBonus: Number(data.saldoBonus ?? 0),
        depositosCount: Number(data.depositosCount ?? 0),
        notasAdmin: String(data.notasAdmin ?? ""),
        photoURL: String(data.photoURL ?? ""),
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        createdAt: typeof data.createdAt === "string" ? data.createdAt : data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as MemberProfile;
    })
    .filter((member) => member.role !== "admin")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalAvailable = members.reduce((sum, member) => sum + member.saldoDisponivel, 0);
  const totalAssets = members.reduce(
    (sum, member) => sum + member.saldoDisponivel + member.saldoBloqueado + member.saldoBonus,
    0,
  );
  const approvedPayments = paymentSnapshot.docs
    .map((item) => item.data())
    .filter((payment) => payment.status === "approved");

  return {
    active: members.filter((member) => member.status === "ativo").length,
    blocked: members.filter((member) => member.status === "bloqueado").length,
    members,
    overdue: members.filter((member) => member.status === "inadimplente").length,
    pending: members.filter((member) => member.status === "pendente").length,
    total: members.length,
    totalAssets,
    totalAvailable,
    approvedPix: approvedPayments.length,
    adminRevenue: approvedPayments.reduce((sum, payment) => sum + Number(payment.feeAmount ?? 0), 0),
  };
}

export async function activateMember(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch(`${apiBase()}/api/admin/members/${id}/activate`, {
      method: "POST",
      headers: await adminHeaders(),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Não foi possível ativar a conta.");
    }
    return { ok: true };
  } catch (error) {
    try {
      await updateDoc(doc(db, "users", id), { status: "ativo", updatedAt: serverTimestamp() });
      return { ok: true };
    } catch (fallbackError) {
      const code = (fallbackError as { code?: string }).code;
      const message =
        code === "permission-denied" || code === "firestore/permission-denied"
          ? "O Firebase recusou a operação. Saia e entre novamente na conta administrativa."
          : error instanceof Error
            ? error.message
            : "Não foi possível ativar a conta.";
      return { ok: false, error: message };
    }
  }
}

export async function setMemberStatus(id: string, status: "ativo" | "bloqueado") {
  if (status === "ativo") {
    const result = await activateMember(id);
    if (!result.ok) throw new Error(result.error);
    return;
  }
  await updateDoc(doc(db, "users", id), { status, updatedAt: serverTimestamp() });
}
