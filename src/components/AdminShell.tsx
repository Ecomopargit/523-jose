"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Logo from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  TrendingDown,
  MessageCircle,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuItem = { href: string; icon: LucideIcon; label: string };

const menuItems: MenuItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/associados", icon: Users, label: "Associados" },
  { href: "/admin/pendentes", icon: UserPlus, label: "Pendentes" },
  { href: "/admin/saques", icon: TrendingDown, label: "Saques" },
  { href: "/admin/suporte", icon: MessageCircle, label: "Atendimento" },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-2 overflow-y-auto">
      <div className="space-y-0.5">
        {menuItems.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
            >
              <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="relative flex flex-col h-full">
      <div className="px-6 pt-8 pb-5 border-b border-white/10">
        <Link href="/admin" onClick={onNavigate}>
          <Logo size="sm" variant="light" showTagline={false} />
        </Link>
        <p className="text-white/55 text-xs mt-3 font-medium uppercase tracking-wider">
          Painel Administrativo
        </p>
      </div>

      <NavList onNavigate={onNavigate} />

      <div className="mt-auto p-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            void logout().then(() => {
              onNavigate?.();
              router.push("/login");
            });
          }}
          className="sidebar-link text-white/80 w-full"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.75} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({
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
    <div className="min-h-dvh flex bg-bg">
      <aside className="sidebar-app hidden lg:flex lg:w-[280px] lg:sticky lg:top-0 lg:h-dvh relative overflow-hidden">
        <SidebarContent />
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside
          className={`sidebar-app absolute left-0 top-0 h-full w-72 max-w-[85%] flex flex-col transition-transform duration-300 ${
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
          <SidebarContent onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-xl border-b border-line-soft">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Abrir menu"
                onClick={() => setOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-xl text-ink-soft hover:bg-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="min-w-0">
                <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink truncate tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-ink-soft text-sm truncate mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {headerRight && (
              <div className="flex items-center gap-3 shrink-0">{headerRight}</div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
