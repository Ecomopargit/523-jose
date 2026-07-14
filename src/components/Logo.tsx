import Image from "next/image";
import Link from "next/link";
import { LOGO_MARK, LOGO_MARK_LIGHT } from "@/lib/logo";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
  variant?: "default" | "light";
  markOnly?: boolean;
};

const sizes = {
  sm: { mark: 42, name: "text-[15px]", tag: "text-[10px]", gap: "gap-3" },
  md: { mark: 48, name: "text-xl", tag: "text-[10px]", gap: "gap-3" },
  lg: { mark: 64, name: "text-2xl sm:text-3xl", tag: "text-xs", gap: "gap-3.5" },
};

export default function Logo({
  size = "md",
  showTagline = true,
  href,
  className = "",
  variant = "default",
  markOnly = false,
}: LogoProps) {
  const s = sizes[size];
  const isLight = variant === "light";
  const markSrc = isLight ? LOGO_MARK_LIGHT : LOGO_MARK;

  const mark = (
    <Image
      src={markSrc}
      alt={markOnly ? "ECOMOPAR" : ""}
      width={s.mark}
      height={s.mark}
      unoptimized
      className={`shrink-0 rounded-[12px] ${
        isLight
          ? "ring-1 ring-white/35 shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
          : "ring-1 ring-black/5 shadow-sm"
      }`}
      priority={size === "lg" || isLight}
    />
  );

  const content = markOnly ? (
    <div className={className}>{mark}</div>
  ) : (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {mark}
      <div className="min-w-0">
        <span
          className={`block font-display font-bold tracking-tight leading-tight ${s.name} ${
            isLight ? "text-white" : "text-green-900"
          }`}
        >
          ECOMOPAR
        </span>
        {showTagline && (
          <span
            className={`block font-semibold uppercase tracking-wider leading-tight mt-0.5 ${s.tag} ${
              isLight ? "text-white/70" : "text-ink-soft"
            }`}
          >
            Economia do motorista parceiro
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label="ECOMOPAR"
      >
        {content}
      </Link>
    );
  }

  return content;
}
