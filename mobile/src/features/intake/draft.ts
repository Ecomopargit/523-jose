import AsyncStorage from "@react-native-async-storage/async-storage";

import type { IntakePhase } from "./types";

export const REGISTER_DRAFT_KEY = "@ecomopar/register-draft-v1";

export type RegisterDraft = {
  phase: IntakePhase;
  form: {
    nome: string;
    dataNascimento: string;
    cpf: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    tipoVeiculo: string;
    modelo: string;
    placa: string;
    carroProprio: "" | "sim" | "nao";
    locadora: string;
    chavePix: string;
    codigoIndicacao: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  accepted: boolean;
};

export async function loadRegisterDraft(): Promise<RegisterDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(REGISTER_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegisterDraft;
  } catch {
    return null;
  }
}

export async function saveRegisterDraft(draft: RegisterDraft) {
  try {
    await AsyncStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* storage indisponível */
  }
}

export async function clearRegisterDraft() {
  try {
    await AsyncStorage.removeItem(REGISTER_DRAFT_KEY);
  } catch {
    /* storage indisponível */
  }
}
