"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { resetPassword } from "@/lib/member-store";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-bg flex flex-col safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="mb-8 animate-fade-up">
          <Logo size="md" href="/" showTagline={false} />
        </div>

        <div className="card w-full p-6 sm:p-7 animate-fade-up">
          <h1 className="font-display text-xl font-semibold text-ink mb-1">Recuperar senha</h1>
          <p className="text-sm text-ink-soft mb-6 leading-relaxed">
            Informe o e-mail cadastrado para receber o link de redefinição.
          </p>

          {sent ? (
            <div className="rounded-[14px] bg-green-50 border border-line-soft p-5 text-center">
              <CheckCircle className="w-8 h-8 text-green-700 mx-auto mb-3" />
              <p className="font-semibold text-ink mb-1">E-mail enviado</p>
              <p className="text-sm text-ink-soft">
                Verifique a caixa de entrada em <strong className="text-ink">{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] font-semibold block mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-ink-faint pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="field !pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
                {loading ? "Enviando…" : "Enviar link"}
              </button>
            </form>
          )}
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-green-700 font-semibold text-sm hover:underline animate-fade-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
