"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { loginMember } from "@/lib/member-store";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginMember(email, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.role === "admin") {
        router.push("/admin");
        return;
      }

      const next = searchParams.get("next") || "/dashboard";
      router.push(next.startsWith("/") && !next.startsWith("/admin") ? next : "/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-bg flex flex-col safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="mb-8 animate-fade-up">
          <Logo
            size="lg"
            href="/"
            className="justify-center flex-col items-center text-center [&>div]:flex-col [&>div]:items-center"
          />
        </div>

        <div className="card w-full p-6 sm:p-7 animate-fade-up">
          <h1 className="font-display text-xl font-semibold text-ink mb-1">Entrar</h1>
          <p className="text-sm text-ink-soft mb-6">Acesse a conta do e-mail que você cadastrou</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold block mb-1.5">E-mail</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-ink-faint pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className="field !pl-10"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold block mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-ink-faint pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Sua senha"
                  className="field !pl-10 !pr-12"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-green-700 p-1"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                {error}
              </div>
            )}

            <div className="text-right">
              <Link
                href="/recuperar-senha"
                className="text-green-700 font-semibold text-[13px] hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft animate-fade-up">
          Não possui conta?{" "}
          <Link href="/cadastrar" className="text-green-700 font-semibold underline underline-offset-2">
            Cadastrar-se
          </Link>
        </p>
      </div>

      <footer className="px-6 pb-8 text-center">
        <p className="text-[12px] text-ink-faint max-w-xs mx-auto">
          Cada e-mail abre apenas a própria conta. Admin: admin@ecomopar.org
        </p>
      </footer>
    </main>
  );
}
