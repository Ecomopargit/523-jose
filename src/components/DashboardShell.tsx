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
  LogOut,
  Menu,
  X,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { getDashboardMeta } from "@/lib/dashboard-meta";

type MenuItem = { href: string; icon: LucideIcon; label: string };

const menuItems: MenuItem[] = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/dashboard/perfil", icon: UserCircle, label: "Meu perfil" },
  { href: "/dashboard/saque", icon: TrendingDown, label: "Solicitar saque" },
  { href: "/dashboard/extrato", icon: History, label: "Histórico saque" },
  { href: "/dashboard/beneficios", icon: Sparkles, label: "Clube de benefícios" },
  { href: "/dashboard/saldo", icon: CircleDollarSign, label: "Financeiro" },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
      {menuItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
          >
            <item.icon className="w-[18px] h-[18px] shrink-0 opacity-85" strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="relative flex flex-col h-full px-4 py-6">
      <div className="flex items-center gap-3 px-2.5 pb-5 mb-3 border-b border-white/10">
        <div className="brand-mark">e</div>
        <div className="min-w-0">
          <div className="font-display font-bold text-[15px] tracking-wide leading-tight">
            ECOMOPAR
          </div>
          <div className="text-[10px] text-white/55 uppercase tracking-wider mt-0.5 leading-tight">
            Economia do motorista parceiro
          </div>
        </div>
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="mt-auto pt-3.5 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] mb-0.5">
          <div className="w-[34px] h-[34px] rounded-full bg-white/14 flex items-center justify-center text-xs font-semibold shrink-0">
            LS
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight">Lucas Silva</p>
            <p className="text-[11px] text-white/50">Associado</p>
          </div>
        </div>

        <Link href="/login" onClick={onNavigate} className="sidebar-link text-[13px] text-white/55 py-2">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          <span>Sair</span>
        </Link>

        <Link
          href="/politica-de-privacidade"
          onClick={onNavigate}
          className="block px-2.5 pt-2 text-[10.5px] text-white/30 hover:text-white/55 transition-colors"
        >
          Política de privacidade
        </Link>
      </div>
    </div>
  );
}

export default function DashboardShell({
  title,
  subtitle,
  showBack,
  backHref = "/dashboard",
  headerRight,
  children,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const meta = getDashboardMeta(pathname);
  const pageTitle = title ?? meta.title;
  const pageSub = subtitle ?? meta.subtitle;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh flex bg-bg">
      <aside className="sidebar-app hidden lg:flex lg:sticky lg:top-0 lg:h-dvh">
        <SidebarPanel />
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside
          className={`sidebar-app absolute left-0 top-0 h-full w-[min(88vw,264px)] transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-4 z-10 p-2 rounded-full bg-white/15"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarPanel onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-bg safe-top">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-10 py-5">
            <div className="flex items-center gap-2.5 min-w-0">
              {showBack ? (
                <Link
                  href={backHref}
                  className="w-8 h-8 rounded-[9px] border border-line bg-surface flex items-center justify-center text-ink-soft hover:text-ink transition-colors shrink-0"
                  aria-label="Voltar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="lg:hidden w-8 h-8 rounded-[9px] border border-line bg-surface flex items-center justify-center text-green-700"
                  aria-label="Abrir menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="font-display text-xl sm:text-[22px] font-semibold tracking-tight text-ink truncate capitalize">
                  {pageTitle}
                </h1>
                <p className="text-[13px] text-ink-soft mt-0.5 truncate">{pageSub}</p>
              </div>
            </div>
            {headerRight}
          </div>
        </header>

        <main className="flex-1 px-5 sm:px-10 pb-12 max-w-[1120px] w-full">{children}</main>
      </div>
    </div>
  );
}
