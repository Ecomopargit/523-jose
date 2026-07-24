import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAdmin from "@/components/RequireAdmin";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  description: "Gerenciamento administrativo da ECOMOPAR.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
