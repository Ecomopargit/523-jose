import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, type Timestamp } from "firebase/firestore";

import { auth, db } from "./firebase";
import { uploadProfilePhoto as uploadProfilePhotoToStorage } from "./profile-photo";
import type { MemberProfile } from "../types";
import { ensureReferralProfile } from "./referrals";

function messageFor(code = "") {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Já existe uma conta com este e-mail.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/wrong-password": "A senha atual está incorreta.",
    "auth/user-not-found": "Conta não encontrada.",
    "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde e tente novamente.",
    "permission-denied": "O Firebase bloqueou o acesso ao perfil. Verifique as regras publicadas.",
    "firestore/permission-denied": "O Firebase bloqueou o acesso ao perfil. Verifique as regras publicadas.",
  };
  return messages[code] ?? "Não foi possível concluir. Tente novamente.";
}

function toIso(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
}

export async function getMember(uid: string): Promise<MemberProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    nome: String(data.nome ?? ""),
    cpf: String(data.cpf ?? ""),
    telefone: String(data.telefone ?? ""),
    email: String(data.email ?? ""),
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
    activatedAt: data.activatedAt ? toIso(data.activatedAt) : null,
    withdrawalLockedUntil: data.withdrawalLockedUntil
      ? toIso(data.withdrawalLockedUntil)
      : null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    status: data.status || "pendente",
    role: data.role || "member",
    saldoDisponivel: Number(data.saldoDisponivel ?? 0),
    saldoBloqueado: Number(data.saldoBloqueado ?? 0),
    saldoBonus: Number(data.saldoBonus ?? 0),
    depositosCount: Number(data.depositosCount ?? 0),
    notasAdmin: String(data.notasAdmin ?? ""),
    photoURL: String(data.photoURL ?? ""),
  };
}

/**
 * Recupera contas antigas que existem no Firebase Authentication, mas ainda
 * não possuem o documento correspondente em users/{uid}.
 */
export async function ensureMemberProfile(user: User): Promise<MemberProfile> {
  const existing = await getMember(user.uid);
  if (existing) return existing;

  const email = user.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("A conta autenticada não possui um e-mail válido.");
  }

  await setDoc(doc(db, "users", user.uid), {
    nome: user.displayName?.trim() || email.split("@")[0],
    email,
    cpf: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    tipoVeiculo: "",
    modelo: "",
    placa: "",
    carroProprio: "",
    locadora: "",
    chavePix: "",
    aderiuIndicacao: false,
    codigoIndicacao: "",
    status: "pendente",
    role: "member",
    saldoDisponivel: 0,
    saldoBloqueado: 0,
    saldoBonus: 0,
    depositosCount: 0,
    notasAdmin: "Perfil recuperado automaticamente pelo aplicativo.",
    photoURL: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const created = await getMember(user.uid);
  if (!created) {
    throw new Error("O perfil foi criado, mas não pôde ser carregado.");
  }
  return created;
}

export async function login(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const profile = await ensureMemberProfile(credential.user);
    if (profile.status === "bloqueado") {
      await signOut(auth);
      return { ok: false as const, error: "Sua conta está bloqueada." };
    }
    return { ok: true as const, profile };
  } catch (error) {
    await signOut(auth).catch(() => undefined);
    return { ok: false as const, error: messageFor((error as { code?: string }).code) };
  }
}

export type Registration = {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  telefone: string;
  dataNascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  tipoVeiculo?: string;
  modelo?: string;
  placa?: string;
  carroProprio?: "sim" | "nao" | "";
  locadora?: string;
  chavePix?: string;
  codigoIndicacao?: string;
};

export async function register(input: Registration) {
  try {
    const email = input.email.trim().toLowerCase();
    const credential = await createUserWithEmailAndPassword(auth, email, input.password);
    await updateProfile(credential.user, { displayName: input.nome.trim() });
    const codigoIndicacao = (input.codigoIndicacao ?? "").trim().toUpperCase();
    await setDoc(doc(db, "users", credential.user.uid), {
      nome: input.nome.trim(),
      email,
      cpf: input.cpf.replace(/\D/g, ""),
      telefone: input.telefone.trim(),
      dataNascimento: (input.dataNascimento ?? "").trim(),
      endereco: (input.endereco ?? "").trim(),
      cidade: (input.cidade ?? "").trim(),
      estado: (input.estado ?? "").trim().toUpperCase(),
      cep: (input.cep ?? "").trim(),
      tipoVeiculo: (input.tipoVeiculo ?? "").trim(),
      modelo: (input.modelo ?? "").trim(),
      placa: (input.placa ?? "").trim().toUpperCase(),
      carroProprio: input.carroProprio || "",
      locadora: (input.locadora ?? "").trim(),
      chavePix: (input.chavePix ?? "").trim(),
      aderiuIndicacao: Boolean(codigoIndicacao),
      codigoIndicacao,
      status: "pendente",
      role: "member",
      saldoDisponivel: 0,
      saldoBloqueado: 0,
      saldoBonus: 0,
      depositosCount: 0,
      notasAdmin: "",
      photoURL: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    try {
      await ensureReferralProfile(codigoIndicacao, Boolean(codigoIndicacao));
      return { ok: true as const };
    } catch (error) {
      return {
        ok: true as const,
        warning: error instanceof Error
          ? error.message
          : "Sua conta foi criada, mas a indicação ainda não foi vinculada.",
      };
    }
  } catch (error) {
    const code = (error as { code?: string }).code;
    return {
      ok: false as const,
      error: code ? messageFor(code) : error instanceof Error ? error.message : messageFor(),
    };
  }
}

export type MemberProfileUpdate = {
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tipoVeiculo: string;
  modelo: string;
  placa: string;
  chavePix: string;
};

export async function updateMemberProfile(input: MemberProfileUpdate) {
  const user = auth.currentUser;
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." };
  try {
    const clean = {
      nome: input.nome.trim(),
      cpf: input.cpf.trim(),
      telefone: input.telefone.trim(),
      dataNascimento: input.dataNascimento.trim(),
      endereco: input.endereco.trim(),
      cidade: input.cidade.trim(),
      estado: input.estado.trim().toUpperCase(),
      cep: input.cep.trim(),
      tipoVeiculo: input.tipoVeiculo.trim(),
      modelo: input.modelo.trim(),
      placa: input.placa.trim().toUpperCase(),
      chavePix: input.chavePix.trim(),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(db, "users", user.uid), clean);
    await updateProfile(user, { displayName: clean.nome });
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: messageFor((error as { code?: string }).code) };
  }
}

export async function uploadMemberPhoto(uri: string) {
  return uploadProfilePhotoToStorage(uri);
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: messageFor((error as { code?: string }).code) };
  }
}

export async function changeMemberPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) {
    return { ok: false as const, error: "Sessão expirada. Entre novamente." };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { ok: true as const };
  } catch (error) {
    const code = (error as { code?: string }).code;
    const passwordError =
      code === "auth/invalid-credential" || code === "auth/wrong-password"
        ? "A senha atual está incorreta."
        : messageFor(code);
    return { ok: false as const, error: passwordError };
  }
}
