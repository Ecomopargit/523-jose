import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/components/Logo";

const social = [
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
];

const quickLinks = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/beneficios", label: "Benefícios" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/cadastrar", label: "Cadastrar-se" },
];

const beneficios = [
  "Reserva Financeira",
  "Empréstimo Subsidiado",
  "Assistência Odontológica",
  "Assistência Jurídica",
  "Seguro da Franquia",
  "Indique e Ganhe",
];

export default function Footer() {
  return (
    <footer className="relative bg-brand text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_0%,white,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Logo size="sm" variant="light" showTagline={false} />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Instituto de Apoio ao Motorista Autônomo. Proteção, reserva e
              benefícios para quem vive da direção.
            </p>
            <div className="flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-brand transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-5">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-5">
              Benefícios
            </h3>
            <ul className="space-y-3">
              {beneficios.map((b) => (
                <li key={b} className="text-white/65 text-sm">
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-5">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-white/80 mt-0.5 shrink-0" />
                <a href="tel:+551140000000" className="text-white/65 text-sm hover:text-white transition-colors">
                  (11) 4000-0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-white/80 mt-0.5 shrink-0" />
                <a href="mailto:contato@ecomopar.org" className="text-white/65 text-sm hover:text-white transition-colors break-all">
                  contato@ecomopar.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-white/80 mt-0.5 shrink-0" />
                <span className="text-white/65 text-sm">
                  Av. Paulista, 1000
                  <br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/politica-de-privacidade" className="text-white/60 hover:text-white text-sm transition-colors inline-block">
              Política de Privacidade
            </Link>
            <Link href="/excluir-conta" className="text-white/60 hover:text-white text-sm transition-colors inline-block">
              Excluir conta
            </Link>
          </div>
          <p className="text-white/45 text-sm">
            © {new Date().getFullYear()} ECOMOPAR — Instituto de Apoio ao Motorista Autônomo.
          </p>
        </div>
      </div>
    </footer>
  );
}
