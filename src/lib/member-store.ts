import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { listAllActivationPayments } from "@/lib/activation-store";

export type MemberStatus = "pendente" | "ativo" | "inadimplente" | "bloqueado";
export type UserRole = "member" | "admin";

export type MemberProfile = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tipoVeiculo: string;
  modelo: string;
  carroProprio: "sim" | "nao" | "";
  locadora: string;
  placa: string;
  chavePix: string;
  aderiuIndicacao: boolean;
  codigoIndicacao: string;
  referralCode: string;
  referredByUid: string;
  referredByCode: string;
  referralValidCount: number;
  referralBonusPaidGroups: number;
  activatedAt: string | null;
  withdrawalLockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
  status: MemberStatus;
  role: UserRole;
  saldoDisponivel: number;
  saldoBloqueado: number;
  saldoBonus: number;
  depositosCount: number;
  notasAdmin: string;
  photoURL: string;
};

export const ADMIN_EMAIL = "admin@ecomopar.org";
export const ADMIN_PASSWORD = "Admin@Ecomopar26";

const USERS = "users";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function authErrorMessage(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Já existe um cadastro com este e-mail. Faça login.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/user-not-found": "Não encontramos cadastro com este e-mail.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
    "auth/network-request-failed": "Falha de rede. Verifique sua conexão.",
    "auth/operation-not-allowed":
      "Login por e-mail/senha não está ativo no Firebase Console.",
  };
  return map[code] ?? "Não foi possível autenticar. Tente novamente.";
}

function tsToIso(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  const ts = value as Timestamp;
  if (typeof ts?.toDate === "function") return ts.toDate().toISOString();
  return new Date().toISOString();
}

function mapUserDoc(id: string, data: Record<string, unknown>): MemberProfile {
  return {
    id,
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
    carroProprio: (data.carroProprio as MemberProfile["carroProprio"]) || "",
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
    activatedAt: data.activatedAt ? tsToIso(data.activatedAt) : null,
    withdrawalLockedUntil: data.withdrawalLockedUntil
      ? tsToIso(data.withdrawalLockedUntil)
      : null,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
    status: (data.status as MemberStatus) || "pendente",
    role: (data.role as UserRole) || "member",
    saldoDisponivel: Number(data.saldoDisponivel ?? 0),
    saldoBloqueado: Number(data.saldoBloqueado ?? 0),
    saldoBonus: Number(data.saldoBonus ?? 0),
    depositosCount: Number(data.depositosCount ?? 0),
    notasAdmin: String(data.notasAdmin ?? ""),
    photoURL: String(data.photoURL ?? ""),
  };
}

export function initialsFromName(nome: string) {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatMemberSince(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function vehicleLabel(member: Pick<MemberProfile, "modelo" | "tipoVeiculo" | "placa">) {
  const kind =
    member.modelo?.trim() ||
    ({
      carro: "Carro",
      moto: "Moto",
      van: "Van",
      caminhao: "Caminhão",
    }[member.tipoVeiculo] ??
      "Veículo");
  return member.placa ? `${kind} — ${member.placa.toUpperCase()}` : kind;
}

export function saldoTotal(m: MemberProfile) {
  return m.saldoDisponivel + m.saldoBloqueado + m.saldoBonus;
}

export async function fetchMemberByUid(uid: string): Promise<MemberProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return mapUserDoc(snap.id, snap.data() as Record<string, unknown>);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getAuthUser() {
  return auth.currentUser;
}

export type RegisterInput = Omit<
  MemberProfile,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "role"
  | "saldoDisponivel"
  | "saldoBloqueado"
  | "saldoBonus"
  | "depositosCount"
  | "notasAdmin"
  | "referralCode"
  | "referredByUid"
  | "referredByCode"
  | "referralValidCount"
  | "referralBonusPaidGroups"
  | "activatedAt"
  | "withdrawalLockedUntil"
  | "photoURL"
> & {
  password: string;
};

export async function registerMember(
  input: RegisterInput,
): Promise<{ ok: true; member: MemberProfile } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Informe um e-mail válido." };
  if (email === ADMIN_EMAIL) {
    return { ok: false, error: "Este e-mail é reservado para administração." };
  }
  if (!input.password || input.password.length < 6) {
    return { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, input.password);
    await updateProfile(cred.user, { displayName: input.nome.trim() });

    const profile = {
      nome: input.nome.trim(),
      cpf: input.cpf.trim(),
      telefone: input.telefone.trim(),
      email,
      dataNascimento: input.dataNascimento,
      endereco: input.endereco.trim(),
      cidade: input.cidade.trim(),
      estado: input.estado,
      cep: input.cep.trim(),
      tipoVeiculo: input.tipoVeiculo,
      modelo: input.modelo.trim(),
      carroProprio: input.carroProprio,
      locadora: input.locadora.trim(),
      placa: input.placa.trim().toUpperCase(),
      chavePix: input.chavePix.trim(),
      aderiuIndicacao: input.aderiuIndicacao,
      codigoIndicacao: input.codigoIndicacao.trim(),
      status: "pendente" as const,
      role: "member" as const,
      saldoDisponivel: 0,
      saldoBloqueado: 0,
      saldoBonus: 0,
      depositosCount: 0,
      notasAdmin: "",
      photoURL: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, USERS, cred.user.uid), profile);

    const member = await fetchMemberByUid(cred.user.uid);
    if (!member) return { ok: false, error: "Conta criada, mas o perfil não foi encontrado." };
    return { ok: true, member };
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    return { ok: false, error: authErrorMessage(code) };
  }
}

async function ensureAdminProfile(uid: string, email: string) {
  const existing = await fetchMemberByUid(uid);
  if (existing?.role === "admin") return existing;

  await setDoc(
    doc(db, USERS, uid),
    {
      nome: "Administrador ECOMOPAR",
      cpf: "",
      telefone: "",
      email,
      dataNascimento: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      tipoVeiculo: "",
      modelo: "",
      carroProprio: "",
      locadora: "",
      placa: "",
      chavePix: "",
      aderiuIndicacao: false,
      codigoIndicacao: "",
      status: "ativo",
      role: "admin",
      saldoDisponivel: 0,
      saldoBloqueado: 0,
      saldoBonus: 0,
      depositosCount: 0,
      notasAdmin: "Conta administrativa",
      photoURL: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return fetchMemberByUid(uid);
}

export async function loginMember(
  email: string,
  password: string,
): Promise<
  | { ok: true; member: MemberProfile; role: "member" }
  | { ok: true; member: MemberProfile; role: "admin" }
  | { ok: false; error: string }
> {
  const key = normalizeEmail(email);

  try {
    if (key === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return { ok: false, error: "E-mail ou senha de admin incorretos." };
      }

      let cred;
      try {
        cred = await signInWithEmailAndPassword(auth, key, password);
      } catch (err) {
        const code = (err as { code?: string }).code ?? "";
        if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
          cred = await createUserWithEmailAndPassword(auth, key, password);
        } else {
          return { ok: false, error: authErrorMessage(code) };
        }
      }

      const admin = await ensureAdminProfile(cred.user.uid, key);
      if (!admin) return { ok: false, error: "Falha ao carregar perfil admin." };
      return { ok: true, member: admin, role: "admin" };
    }

    const cred = await signInWithEmailAndPassword(auth, key, password);
    const member = await fetchMemberByUid(cred.user.uid);
    if (!member) {
      return {
        ok: false,
        error: "Usuário autenticado, mas sem perfil no sistema. Contate o suporte.",
      };
    }
    if (member.status === "bloqueado") {
      await signOut(auth);
      return { ok: false, error: "Esta conta está bloqueada. Fale com o suporte." };
    }
    if (member.role === "admin") {
      return { ok: true, member, role: "admin" };
    }
    return { ok: true, member, role: "member" };
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    return { ok: false, error: authErrorMessage(code) };
  }
}

export async function logoutMember() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, normalizeEmail(email));
    return { ok: true as const };
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    return { ok: false as const, error: authErrorMessage(code) };
  }
}

export async function listMembers(): Promise<MemberProfile[]> {
  try {
    const snap = await getDocs(query(collection(db, USERS), orderBy("createdAt", "desc")));
    return snap.docs
      .map((d) => mapUserDoc(d.id, d.data() as Record<string, unknown>))
      .filter((m) => m.role !== "admin");
  } catch {
    // Fallback se o índice/ordenação falhar
    const snap = await getDocs(collection(db, USERS));
    return snap.docs
      .map((d) => mapUserDoc(d.id, d.data() as Record<string, unknown>))
      .filter((m) => m.role !== "admin")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export async function getMemberById(id: string): Promise<MemberProfile | null> {
  return fetchMemberByUid(id);
}

/** Campos que o próprio associado pode manter atualizados. */
export type MemberSelfUpdateInput = Pick<
  MemberProfile,
  | "nome"
  | "cpf"
  | "telefone"
  | "dataNascimento"
  | "endereco"
  | "cidade"
  | "estado"
  | "cep"
  | "tipoVeiculo"
  | "modelo"
  | "carroProprio"
  | "locadora"
  | "placa"
  | "chavePix"
>;

export async function updateMemberSelf(
  patch: MemberSelfUpdateInput,
): Promise<{ ok: true; member: MemberProfile } | { ok: false; error: string }> {
  const user = auth.currentUser;
  if (!user) return { ok: false, error: "Sessão expirada. Entre novamente." };

  try {
    const clean = {
      nome: patch.nome.trim(),
      cpf: patch.cpf.trim(),
      telefone: patch.telefone.trim(),
      dataNascimento: patch.dataNascimento,
      endereco: patch.endereco.trim(),
      cidade: patch.cidade.trim(),
      estado: patch.estado.trim().toUpperCase(),
      cep: patch.cep.trim(),
      tipoVeiculo: patch.tipoVeiculo.trim(),
      modelo: patch.modelo.trim(),
      carroProprio: patch.carroProprio,
      locadora: patch.carroProprio === "nao" ? patch.locadora.trim() : "",
      placa: patch.placa.trim().toUpperCase(),
      chavePix: patch.chavePix.trim(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, USERS, user.uid), clean);
    if (clean.nome && clean.nome !== user.displayName) {
      await updateProfile(user, { displayName: clean.nome });
    }

    const member = await fetchMemberByUid(user.uid);
    if (!member) return { ok: false, error: "Salvo, mas não foi possível recarregar o perfil." };
    return { ok: true, member };
  } catch (err) {
    console.error("Falha ao atualizar perfil:", err);
    return { ok: false, error: "Não foi possível salvar seus dados. Tente novamente." };
  }
}

export type AdminUpdateInput = Partial<
  Pick<
    MemberProfile,
    | "status"
    | "saldoDisponivel"
    | "saldoBloqueado"
    | "saldoBonus"
    | "depositosCount"
    | "notasAdmin"
    | "chavePix"
  >
>;

export async function updateMemberAdmin(
  id: string,
  patch: AdminUpdateInput,
): Promise<{ ok: true; member: MemberProfile } | { ok: false; error: string }> {
  try {
    const ref = doc(db, USERS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { ok: false, error: "Associado não encontrado." };

    const clean: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (patch.status != null) clean.status = patch.status;
    if (patch.chavePix != null) clean.chavePix = patch.chavePix;
    if (patch.notasAdmin != null) clean.notasAdmin = patch.notasAdmin;
    if (patch.saldoDisponivel != null) clean.saldoDisponivel = Math.max(0, Number(patch.saldoDisponivel) || 0);
    if (patch.saldoBloqueado != null) clean.saldoBloqueado = Math.max(0, Number(patch.saldoBloqueado) || 0);
    if (patch.saldoBonus != null) clean.saldoBonus = Math.max(0, Number(patch.saldoBonus) || 0);
    if (patch.depositosCount != null) {
      clean.depositosCount = Math.max(0, Math.floor(Number(patch.depositosCount) || 0));
    }

    await updateDoc(ref, clean);
    const member = await fetchMemberByUid(id);
    if (!member) return { ok: false, error: "Atualizado, mas não foi possível recarregar." };
    return { ok: true, member };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Falha ao salvar no Firebase. Verifique as rules." };
  }
}

export async function deleteMemberAdmin(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteDoc(doc(db, USERS, id));
    return { ok: true };
  } catch {
    return { ok: false, error: "Falha ao remover no Firebase." };
  }
}

export async function getAdminStats() {
  const [members, payments] = await Promise.all([
    listMembers(),
    listAllActivationPayments().catch(() => []),
  ]);
  const approvedPayments = payments.filter((payment) => payment.status === "approved");
  const total = members.length;
  const ativos = members.filter((m) => m.status === "ativo").length;
  const pendentes = members.filter((m) => m.status === "pendente").length;
  const inadimplentes = members.filter((m) => m.status === "inadimplente").length;
  const bloqueados = members.filter((m) => m.status === "bloqueado").length;
  const totalReserva = members.reduce((s, m) => s + m.saldoDisponivel, 0);
  const totalBloqueado = members.reduce((s, m) => s + m.saldoBloqueado, 0);
  const totalBonus = members.reduce((s, m) => s + m.saldoBonus, 0);
  const totalDepositos = members.reduce((s, m) => s + m.depositosCount, 0);
  const totalReceitaAdmin = approvedPayments.reduce((sum, payment) => sum + payment.feeAmount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const novosHoje = members.filter((m) => m.createdAt.slice(0, 10) === today).length;

  return {
    total,
    ativos,
    pendentes,
    inadimplentes,
    bloqueados,
    totalReserva,
    totalBloqueado,
    totalBonus,
    totalDepositos,
    totalReceitaAdmin,
    pagamentosAprovados: approvedPayments.length,
    novosHoje,
    recentes: members.slice(0, 8),
  };
}

/** Compat no-ops removidos do localStorage */
export function clearSession() {
  /* Auth Firebase gerencia sessão */
}
export function setSession(_email: string) {
  /* Auth Firebase gerencia sessão */
}
export function setAdminSession(_active: boolean) {
  /* role vem do Firestore */
}
export function isAdminSession() {
  return false;
}
export function getSessionEmail(): string | null {
  return auth.currentUser?.email ?? null;
}
export function getSessionMember(): MemberProfile | null {
  return null;
}
