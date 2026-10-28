/** Normaliza telefone BR para wa.me (somente dígitos com DDI 55). */
export function whatsappDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

export function firstNameFrom(fullName: string) {
  const part = fullName.trim().split(/\s+/)[0] || "associado";
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

export type WhatsAppTemplate = {
  id: string;
  label: string;
  build: (firstName: string) => string;
};

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "pagamento",
    label: "Pagamento diário",
    build: (name) =>
      `Olá, ${name}! Não esqueça de fazer o seu pagamento diário na ECOMOPAR. Qualquer dúvida, estamos por aqui.`,
  },
  {
    id: "ativacao",
    label: "Ativar cadastro",
    build: (name) =>
      `Olá, ${name}! Seu cadastro na ECOMOPAR ainda precisa ser ativado. Assim que puder, conclua a ativação pelo app ou pelo site.`,
  },
  {
    id: "inadimplente",
    label: "Regularizar contribuição",
    build: (name) =>
      `Olá, ${name}! Identificamos pendência na sua contribuição diária. Regularize o pagamento para manter sua reserva e os benefícios em dia.`,
  },
  {
    id: "saque",
    label: "Saque em análise",
    build: (name) =>
      `Olá, ${name}! Recebemos seu pedido de saque e ele está em análise. Em breve você recebe a confirmação do PIX.`,
  },
  {
    id: "indicacao",
    label: "Indique e Ganhe",
    build: (name) =>
      `Olá, ${name}! Lembre-se do programa Indique e Ganhe da ECOMOPAR: indique amigos e acompanhe o progresso pelo app.`,
  },
  {
    id: "saudacao",
    label: "Saudação",
    build: (name) => `Olá, ${name}! Aqui é a equipe ECOMOPAR. Como podemos te ajudar?`,
  },
];

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = whatsappDigits(phone);
  if (!digits) return null;
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${digits}${text ? `?text=${text}` : ""}`;
}
