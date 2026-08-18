import type { ComponentProps } from "react";
import { Feather } from "@expo/vector-icons";

export type IntakePhase = "intro" | "you" | "home" | "vehicle" | "pix" | "account";

export const INTAKE_PHASES: IntakePhase[] = ["intro", "you", "home", "vehicle", "pix", "account"];
export const OPTIONAL_PHASES: IntakePhase[] = ["you", "home", "vehicle", "pix"];

export const VEHICLE_TYPES = [
  { value: "carro", label: "Carro" },
  { value: "moto", label: "Moto" },
  { value: "van", label: "Van" },
  { value: "caminhao", label: "Caminhão" },
] as const;

export const PHASE_COPY: Record<
  IntakePhase,
  { eyebrow: string; title: string; subtitle: string; icon: ComponentProps<typeof Feather>["name"] }
> = {
  intro: {
    eyebrow: "Associação",
    title: "Agora vamos te conhecer.",
    subtitle: "Perguntas rápidas com os mesmos dados do cadastro. Você pode pular tudo e completar depois no perfil.",
    icon: "compass",
  },
  you: {
    eyebrow: "Sobre você",
    title: "Quem está ao volante?",
    subtitle: "Nome, nascimento, CPF e WhatsApp — o essencial para abrir sua reserva.",
    icon: "user",
  },
  home: {
    eyebrow: "Onde você está",
    title: "Sua base na cidade.",
    subtitle: "Endereço ajuda na análise do cadastro e nos benefícios regionais.",
    icon: "map-pin",
  },
  vehicle: {
    eyebrow: "Seu veículo",
    title: "O que você dirige?",
    subtitle: "Tipo, modelo e placa. Se for alugado, dá para informar a locadora.",
    icon: "truck",
  },
  pix: {
    eyebrow: "Pagamento",
    title: "Para onde volta o valor.",
    subtitle: "Chave PIX da sua reserva. Código de indicação é opcional.",
    icon: "zap",
  },
  account: {
    eyebrow: "Sua conta",
    title: "Crie o acesso.",
    subtitle: "E-mail e senha para entrar no app. O restante você pode completar depois.",
    icon: "lock",
  },
};
