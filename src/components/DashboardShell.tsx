"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  DollarSign,
  Users,
  Gift,
  UserCircle,
  LogOut,
  TrendingDown,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuItem = { href: string; icon: LucideIcon; label: string };

const menuItems: MenuItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Meu Painel" },
  { href: "/dashboard/saldo", icon: Wallet, label: "Meu Saldo" },
  { href: "/dashboard/extrato", icon: Receipt, label: "Extrato" },
  { href: "/dashboard/pagamentos", icon: DollarSign, label: "Pagamentos" },
  { href: "/dashboard/saque", icon: TrendingDown, label: "Solicitar Saque" },
  { href: "/dashboard/indicacoes", icon: Users, label: "Minhas Indicações" },
  { href: "/dashboard/beneficios", icon: Gift, label: "Benefícios" },
  { href: "/dashboard/perfil", icon: UserCircle, label: "Meu Perfil" },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-4 pb-6 overflow-y-auto">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                active
                  ? "bg-gradient-to-r from-brand to-accent text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="p-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-brand font-bold text-lg">ECOMOPAR</span>
        </Link>
      </div>

      <NavList onNavigate={onNavigate} />

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Link>
      </div>
    </>
  );
}

export default function DashboardShell({
  title,
  subtitle,
  headerRight,
  children,
}: {
  title: string;
  subtitle?: string;
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
    <div className="min-h-screen bg-surface lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Drawer mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Abrir menu"
                onClick={() => setOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-brand truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-500 text-sm truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {headerRight && (
              <div className="flex items-center gap-3 shrink-0">{headerRight}</div>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
