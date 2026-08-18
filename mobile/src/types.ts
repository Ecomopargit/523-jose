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
  Admin: undefined;
  AdminOperations: { section: "associados" | "saques" | "atendimento" };
  AdminMember: { memberId: string };
  AdminWithdrawal: { withdrawalId: string };
  AdminChat: { chatId: string; memberName: string; memberEmail: string };
  Support: undefined;
  EditProfile: undefined;
  PrivacySecurity: undefined;
  NotificationSettings: undefined;
  PrivacyPolicy: undefined;
  HelpCenter: undefined;
  BenefitDetail: {
    benefitId: "financial" | "health" | "legal" | "vehicle";
  };
};

export type AppTabParamList = {
  Início: undefined;
  Carteira: { flow?: "deposit" | "withdraw" } | undefined;
  Benefícios: undefined;
  Perfil: undefined;
};
