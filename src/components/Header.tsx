"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/beneficios", label: "Benefícios" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/indique-e-ganhe", label: "Indique e Ganhe" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 glass-header ${
        scrolled ? "glass-header-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[4.5rem]">
          <Logo size="sm" href="/" showTagline={false} />

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-brand bg-brand-50"
                    : "text-ink-soft hover:text-brand hover:bg-brand-50/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors rounded-xl px-3 py-2 hover:bg-brand-50"
            >
              <User size={18} strokeWidth={2} />
              <span>Área do Associado</span>
            </Link>
            <Link href="/associar-se" className="btn-primary btn-sm">
              Quero me Associar
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2.5 -mr-1 text-ink-soft rounded-xl hover:bg-brand-50 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`lg:hidden fixed left-0 right-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl origin-top transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="px-4 py-5 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3.5 font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand"
                  : "text-ink-soft hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-4 border-gray-100" />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-brand font-semibold hover:bg-brand-50"
          >
            <User size={20} />
            <span>Área do Associado</span>
          </Link>
          <Link href="/associar-se" className="btn-primary btn-md w-full mt-2">
            Quero me Associar
          </Link>
        </nav>
      </div>
    </header>
  );
}
