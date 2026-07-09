"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-dvh bg-white flex flex-col safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="mb-8">
          <Logo size="md" href="/" showTagline={false} />
        </div>

        <h1 className="text-2xl font-bold text-brand mb-2">Recuperar senha</h1>
        <p className="text-sm text-muted text-center mb-8">
          Informe seu e-mail cadastrado para receber as instruções de redefinição.
        </p>

        {sent ? (
          <div className="w-full card p-6 text-center border-brand/20 bg-brand-50">
            <p className="text-brand font-semibold mb-2">E-mail enviado!</p>
            <p className="text-sm text-gray-600">
              Verifique sua caixa de entrada em <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email"
                className="field !pl-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary btn-lg w-full">
              Enviar link
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
