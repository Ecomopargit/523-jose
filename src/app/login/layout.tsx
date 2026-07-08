import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta ECOMOPAR.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
