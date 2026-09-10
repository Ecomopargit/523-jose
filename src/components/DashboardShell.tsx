"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  UserCircle,
  TrendingDown,
  History,
  Sparkles,
  Gift,
  CircleDollarSign,
  QrCode,
  MessageCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useMemberSession } from "@/hooks/useMemberSession";
import { getDashboardMeta } from "@/lib/dashboard-meta";
import { initialsFromName } from "@/lib/member-store";
import { LOGO_WATERMARK_BRAND } from "@/lib/logo";

type MenuItem = { href: string; icon: LucideIcon; label: string };

const menuItems: MenuItem[] = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/dashboard/pagamentos", icon: QrCode, label: "Pagamentos" },
  { href: "/dashboard/perfil", icon: UserCircle, label: "Meu perfil" },
  { href: "/dashboard/saque", icon: TrendingDown, label: "Solicitar saque" },
  { href: "/dashboard/extrato", icon: History, label: "Histórico saque" },
  { href: "/dashboard/beneficios", icon: Sparkles, label: "Clube de benefícios" },
  { href: "/dashboard/indicacoes", icon: Gift, label: "Indique e ganhe" },
  { href: "/dashboard/suporte", icon: MessageCircle, label: "Suporte" },
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
  const router = useRouter();
  const { member, ready, logout } = useMemberSession();
  const displayName = member?.nome ?? (ready ? "Visitante" : "…");
  const displayEmail = member?.email ?? "Faça login para ver seus dados";
  const initials = member ? initialsFromName(member.nome) : "?";

  const handleLogout = () => {
    void logout().then(() => {
      onNavigate?.();
      router.push("/login");
    });
  };

  return (
    <div className="relative flex flex-col h-full px-4 py-6">
      <div className="px-2.5 pb-5 mb-3 border-b border-white/10">
        <Logo size="sm" variant="light" href="/dashboard" />
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="mt-auto pt-3.5 border-t border-white/10">
        <Link
          href={member ? "/dashboard/perfil" : "/login"}
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] mb-0.5 hover:bg-white/6 transition-colors"
        >
          <div className="w-[34px] h-[34px] rounded-full bg-white/14 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight truncate">{displayName}</p>
            <p className="text-[11px] text-white/50 truncate">{displayEmail}</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-link text-[13px] text-white/55 py-2 w-full"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          <span>Sair</span>
        </button>

        <Link
          href="/politica-de-privacidade"
          onClick={onNavigate}
          className="block px-2.5 pt-2 text-[10.5px] text-white/30 hover:text-white/55 transition-colors"
        >
          Política de privacidade
        </Link>
        <Link
          href="/excluir-conta"
          onClick={onNavigate}
          className="block px-2.5 pt-1 text-[10.5px] text-white/30 hover:text-white/55 transition-colors"
        >
          Excluir conta
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
  const showPageWatermark = pathname !== "/dashboard";

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

      <div className="dashboard-stage flex-1 flex flex-col min-w-0">
        <header className="dashboard-header sticky top-0 z-30 safe-top">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-8 xl:px-12 py-5 max-w-[1500px] w-full mx-auto">
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
                <h1 className="font-display text-[22px] sm:text-[26px] font-semibold tracking-[-0.035em] text-ink truncate capitalize">
                  {pageTitle}
                </h1>
                <p className="text-[13px] sm:text-sm text-ink-soft mt-1 truncate">{pageSub}</p>
              </div>
            </div>
            {headerRight}
          </div>
        </header>

        <main className="dashboard-content relative flex-1 px-5 sm:px-8 xl:px-12 pb-16 max-w-[1500px] w-full mx-auto">
          {showPageWatermark && (
            <Image
              src={LOGO_WATERMARK_BRAND}
              alt=""
              width={360}
              height={360}
              className="dash-page-logo"
              aria-hidden
              unoptimized
              priority={false}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
