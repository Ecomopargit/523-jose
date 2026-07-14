import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500", "600"],
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
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon.svg?v=3-steering", type: "image/svg+xml" },
      { url: "/icons/icon-192.png?v=3-steering", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=3-steering", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png?v=3-steering", sizes: "512x512", type: "image/png" }],
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
  themeColor: "#0B3D2C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-bg text-ink antialiased font-sans safe-bottom">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
