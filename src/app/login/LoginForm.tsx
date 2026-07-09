"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";

type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export default function LoginForm({ action }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-dvh bg-white flex flex-col safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="mb-10 animate-fade-up">
          <Logo
            size="lg"
            href="/"
            className="justify-center flex-col items-center text-center [&>div]:flex-col [&>div]:items-center"
          />
        </div>

        <h1 className="text-2xl font-bold text-brand mb-8 animate-fade-up">Login</h1>

        <form action={action} className="w-full space-y-5 animate-fade-up">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="field !pl-14"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Senha"
              className="field !pl-14 !pr-14"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand p-1"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/recuperar-senha"
              className="text-brand font-bold text-sm hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button type="submit" className="btn-primary btn-lg w-full">
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-brand font-bold text-sm animate-fade-up">
          Não possui conta?{" "}
          <Link href="/associar-se" className="underline underline-offset-2">
            Cadastre-se agora!
          </Link>
        </p>
      </div>

      <footer className="px-6 pb-10 text-center">
        <p className="text-brand font-bold text-sm leading-relaxed max-w-xs mx-auto">
          Faça login para acessar todos os recursos do aplicativo
        </p>
      </footer>
    </main>
  );
}
