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

  // Trava o scroll do body quando o menu mobile está aberto
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
      className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Logo size="sm" href="/" showTagline={false} />

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-brand"
                    : "text-gray-600 hover:text-brand hover:bg-brand-50"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTAs desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 text-brand font-medium hover:text-accent transition-colors rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <User size={20} />
              <span>Área do Associado</span>
            </Link>
            <Link href="/associar-se" className="btn-primary btn-sm">
              Quero me Associar
            </Link>
          </div>

          {/* Botão do menu mobile */}
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 -mr-2 text-gray-700 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Overlay do menu mobile */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-black/40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Painel do menu mobile */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-16 z-40 bg-white border-t shadow-lg origin-top transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-4 py-3 font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-3 border-gray-100" />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-brand font-medium hover:bg-gray-100"
          >
            <User size={20} />
            <span>Área do Associado</span>
          </Link>
          <Link href="/associar-se" className="btn-primary btn-md w-full">
            Quero me Associar
          </Link>
        </nav>
      </div>
    </header>
  );
}
