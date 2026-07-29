import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "./firebase";
import type { MemberProfile } from "../types";

export type AdminStats = {
  active: number;
  blocked: number;
  members: MemberProfile[];
  overdue: number;
  pending: number;
  total: number;
  totalAssets: number;
  totalAvailable: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const snapshot = await getDocs(collection(db, "users"));
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

  return {
    active: members.filter((member) => member.status === "ativo").length,
    blocked: members.filter((member) => member.status === "bloqueado").length,
    members,
    overdue: members.filter((member) => member.status === "inadimplente").length,
    pending: members.filter((member) => member.status === "pendente").length,
    total: members.length,
    totalAssets,
    totalAvailable,
  };
}

export async function setMemberStatus(id: string, status: "ativo" | "bloqueado") {
  await updateDoc(doc(db, "users", id), { status, updatedAt: serverTimestamp() });
}
