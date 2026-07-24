import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cadastrar-se",
  description: "Crie sua conta ECOMOPAR.",
};

export default function CadastrarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
