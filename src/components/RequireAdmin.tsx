"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { ready, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user || !isAdmin) router.replace("/login?next=/admin");
  }, [ready, user, isAdmin, router]);

  if (!ready) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center text-sm text-ink-soft">
        Validando acesso admin…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center text-sm text-ink-soft">
        Redirecionando…
      </div>
    );
  }

  return <>{children}</>;
}
