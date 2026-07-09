"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  UserCircle,
  TrendingDown,
  History,
  Sparkles,
  CircleDollarSign,
  Info,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";

type MenuItem = { href: string; icon: LucideIcon; label: string };

const menuItems: MenuItem[] = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/dashboard/perfil", icon: UserCircle, label: "Meu perfil" },
  { href: "/dashboard/saque", icon: TrendingDown, label: "Solicitar saque" },
  { href: "/dashboard/extrato", icon: History, label: "Histórico saque" },
  { href: "/dashboard/beneficios", icon: Sparkles, label: "Clube de benefícios" },
  { href: "/dashboard/saldo", icon: CircleDollarSign, label: "Financeiro" },
  { href: "/quem-somos", icon: Info, label: "Sobre Nós" },
];

function DrawerNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-6 py-4 space-y-1">
      {menuItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-4 px-2 py-3.5 rounded-xl font-semibold transition-colors ${
              active ? "text-white bg-white/15" : "text-white/90 hover:bg-white/10"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-4 px-2 py-3.5 rounded-xl font-semibold text-white/90 hover:bg-white/10"
      >
        <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.75} />
        <span>Sair</span>
      </Link>
    </nav>
  );
}

export default function DashboardShell({
  title,
  showBack,
  backHref = "/dashboard",
  headerRight,
  children,
}: {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh bg-white lg:bg-surface">
      {/* Drawer mobile (padrão app verde) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <aside
          className={`absolute left-0 top-0 h-full w-[min(88vw,320px)] bg-brand text-white flex flex-col shadow-2xl transition-transform duration-300 rounded-r-3xl overflow-hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header do drawer com onda */}
          <div className="relative bg-brand pt-12 pb-8 px-6 shrink-0">
            <p className="text-white font-bold text-lg leading-snug pr-16">
              Economia do motorista parceiro
            </p>
            <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-[50%]" />
          </div>

          <DrawerNav onNavigate={() => setOpen(false)} />

          <div className="p-6 mt-auto border-t border-white/15">
            <Link
              href="/politica-de-privacidade"
              onClick={() => setOpen(false)}
              className="text-white/70 text-xs hover:text-white"
            >
              Política de privacidade
            </Link>
          </div>
        </aside>
      </div>

      {/* Layout principal */}
      <div className="max-w-lg lg:max-w-5xl mx-auto min-h-dvh flex flex-col lg:px-6">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 safe-top">
          <div className="flex items-center justify-between gap-3 px-4 py-3 min-h-[56px]">
            <div className="flex items-center gap-2 min-w-0">
              {showBack ? (
                <Link
                  href={backHref}
                  className="p-2 -ml-2 text-brand rounded-full hover:bg-brand-50"
                  aria-label="Voltar"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="p-2 -ml-2 text-brand rounded-full hover:bg-brand-50 lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              {title && (
                <h1 className="text-lg font-bold text-brand truncate">{title}</h1>
              )}
            </div>
            {headerRight}
          </div>
        </header>

        {/* Sidebar desktop */}
        <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-72 lg:bg-brand lg:text-white lg:flex-col lg:shadow-xl">
          <div className="p-8 border-b border-white/10">
            <p className="font-bold text-lg">Economia do motorista parceiro</p>
          </div>
          <DrawerNav />
          <div className="p-6 mt-auto border-t border-white/15">
            <Link href="/politica-de-privacidade" className="text-white/70 text-xs hover:text-white">
              Política de privacidade
            </Link>
          </div>
        </div>

        <main className="flex-1 px-4 py-5 pb-8 lg:ml-72 lg:max-w-3xl">{children}</main>
      </div>
    </div>
  );
}
