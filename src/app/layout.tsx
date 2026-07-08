import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ECOMOPAR - Instituto de Apoio ao Motorista Autônomo",
    template: "%s | ECOMOPAR",
  },
  description:
    "Proteção, reserva e benefícios para o motorista autônomo. Faça sua reserva com apenas R$ 7,00 por dia.",
};

export const viewport: Viewport = {
  themeColor: "#0E3A5D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
