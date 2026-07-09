import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
  variant?: "default" | "light";
};

const sizes = {
  sm: { icon: "w-9 h-9 text-lg", name: "text-lg", tag: "text-[9px]" },
  md: { icon: "w-11 h-11 text-xl", name: "text-xl", tag: "text-[10px]" },
  lg: { icon: "w-14 h-14 text-2xl", name: "text-2xl sm:text-3xl", tag: "text-xs" },
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
        className={`${s.icon} rounded-full bg-brand flex items-center justify-center shadow-md shadow-brand/25 shrink-0`}
      >
        <span className="text-white font-bold leading-none">e</span>
      </div>
      <div className="min-w-0">
        <span
          className={`block font-extrabold tracking-tight leading-tight ${s.name} ${
            isLight ? "text-white" : "text-brand"
          }`}
        >
          ECOMOPAR
        </span>
        {showTagline && (
          <span
            className={`block font-semibold uppercase tracking-wide leading-tight mt-0.5 ${s.tag} ${
              isLight ? "text-white/80" : "text-brand/70"
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
      <Link href={href} className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        {content}
      </Link>
    );
  }

  return content;
}
