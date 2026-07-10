export const dashboardMeta: Record<
  string,
  { title: string; subtitle: string }
> = {
  "/dashboard": {
    title: "Início",
    subtitle: new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
      .format(new Date())
      .replace(/^\w/, (c) => c.toUpperCase()),
  },
  "/dashboard/perfil": {
    title: "Meu perfil",
    subtitle: "Seus dados cadastrais",
  },
  "/dashboard/saque": {
    title: "Solicitar saque",
    subtitle: "Transferir via PIX",
  },
  "/dashboard/extrato": {
    title: "Histórico saque",
    subtitle: "Extrato de depósitos e bônus",
  },
  "/dashboard/beneficios": {
    title: "Clube de benefícios",
    subtitle: "Vantagens do seu plano",
  },
  "/dashboard/saldo": {
    title: "Meu saldo",
    subtitle: "Disponível, bloqueado e bônus",
  },
  "/dashboard/pagamentos": {
    title: "Envio de pagamento",
    subtitle: "Depósito diário via PIX",
  },
  "/dashboard/ativar-cadastro": {
    title: "Ativar cadastro",
    subtitle: "Escolha seu plano diário",
  },
  "/dashboard/indicacoes": {
    title: "Minhas indicações",
    subtitle: "Programa Indique e Ganhe",
  },
};

export function getDashboardMeta(pathname: string) {
  return (
    dashboardMeta[pathname] ?? {
      title: "Área do associado",
      subtitle: "ECOMOPAR",
    }
  );
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
