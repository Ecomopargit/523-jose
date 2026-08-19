export const CADASTRO_DRAFT_KEY = "ecomopar:cadastro-draft-v1";
export const CADASTRO_RETURN_KEY = "ecomopar:cadastro-return-v1";

export type CadastroDraft = {
  step: number;
  form: {
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
    carroProprio: "" | "sim" | "nao";
    locadora: string;
    placa: string;
    chavePix: string;
    password: string;
    confirmPassword: string;
    aderiuIndicacao: boolean;
    codigoIndicacao: string;
    aceitaTermos: boolean;
  };
};

export function loadCadastroDraft(): CadastroDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CADASTRO_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CadastroDraft;
  } catch {
    return null;
  }
}

export function saveCadastroDraft(draft: CadastroDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CADASTRO_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota ou storage indisponível */
  }
}

export function clearCadastroDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CADASTRO_DRAFT_KEY);
  } catch {
    /* storage indisponível */
  }
}

export function markCadastroReturn(path = "/cadastrar") {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CADASTRO_RETURN_KEY, path);
  } catch {
    /* storage indisponível */
  }
}

export function readCadastroReturn() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(CADASTRO_RETURN_KEY);
  } catch {
    return null;
  }
}

export function clearCadastroReturn() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CADASTRO_RETURN_KEY);
  } catch {
    /* storage indisponível */
  }
}
