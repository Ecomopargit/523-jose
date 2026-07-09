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
  { href: "/associar-se", label: "Seja um Associado" },
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
    <footer className="bg-brand text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo e descrição */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size="sm" variant="light" showTagline={false} />
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs mt-4">
              Instituto de Apoio ao Motorista Autônomo. Proteção, reserva e
              benefícios para quem vive da direção.
            </p>
            <div className="flex gap-3 pt-1">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 hover:bg-accent hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-accent">
              Links Rápidos
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-accent">
              Benefícios
            </h3>
            <ul className="space-y-2.5">
              {beneficios.map((b) => (
                <li key={b} className="text-gray-300 text-sm">
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-accent">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-accent mt-0.5 shrink-0" />
                <a
                  href="tel:+551140000000"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  (11) 4000-0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5 shrink-0" />
                <a
                  href="mailto:contato@ecomopar.org"
                  className="text-gray-300 text-sm hover:text-white transition-colors break-all"
                >
                  contato@ecomopar.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">
                  Av. Paulista, 1000
                  <br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center space-y-2">
          <Link
            href="/politica-de-privacidade"
            className="text-gray-300 hover:text-white transition-colors text-sm inline-block"
          >
            Política de Privacidade
          </Link>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ECOMOPAR - Instituto de Apoio ao
            Motorista Autônomo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
