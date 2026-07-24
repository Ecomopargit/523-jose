import type { NavigatorScreenParams } from "@react-navigation/native";

export type MemberStatus = "pendente" | "ativo" | "inadimplente" | "bloqueado";

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
  createdAt: string;
  updatedAt: string;
  status: MemberStatus;
  role: "member" | "admin";
  saldoDisponivel: number;
  saldoBloqueado: number;
  saldoBonus: number;
  depositosCount: number;
  notasAdmin: string;
  photoURL: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  App: NavigatorScreenParams<AppTabParamList> | undefined;
  Support: undefined;
  EditProfile: undefined;
  PrivacySecurity: undefined;
  HelpCenter: undefined;
};

export type AppTabParamList = {
  Início: undefined;
  Carteira: undefined;
  Benefícios: undefined;
  Perfil: undefined;
};
