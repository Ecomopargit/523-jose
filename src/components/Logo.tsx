import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
  variant?: "default" | "light";
};

const sizes = {
  sm: { mark: "w-[38px] h-[38px] text-base", name: "text-[15px]", tag: "text-[10px]" },
  md: { mark: "w-11 h-11 text-lg", name: "text-xl", tag: "text-[10px]" },
  lg: { mark: "w-14 h-14 text-2xl", name: "text-2xl sm:text-3xl", tag: "text-xs" },
};

export default function Logo({
  size = "md",
  showTagline = true,
  href,
  className = "",
  variant = "default",
}: LogoProps) {
  const s = sizes[size];
  const isLight = variant === "light";

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${s.mark} rounded-[11px] flex items-center justify-center shrink-0 font-display font-bold ${
          isLight
            ? "bg-white/15 text-white ring-1 ring-white/25"
            : "brand-mark"
        }`}
      >
        e
      </div>
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
      <Link href={href} className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
        {content}
      </Link>
    );
  }

  return content;
}
