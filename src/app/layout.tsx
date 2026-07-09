import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const APP_NAME = "ECOMOPAR";
const APP_DESCRIPTION =
  "Instituto de Apoio ao Motorista Autônomo. Reserva financeira, benefícios e proteção com depósitos diários de R$ 7,00.";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Instituto de Apoio ao Motorista Autônomo`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#108a3d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="bg-white text-gray-900 antialiased font-sans safe-bottom">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
