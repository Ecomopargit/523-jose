"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMemberSession } from "@/hooks/useMemberSession";

export default function RequireMember({ children }: { children: React.ReactNode }) {
  const { member, ready } = useMemberSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!member) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, member, router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center text-sm text-ink-soft">
        Carregando sua conta…
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center text-sm text-ink-soft">
        Redirecionando para o login…
      </div>
    );
  }

  return <>{children}</>;
}
