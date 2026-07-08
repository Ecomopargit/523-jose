import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Área do Associado",
  description: "Acesse sua conta ECOMOPAR e acompanhe sua reserva financeira.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
