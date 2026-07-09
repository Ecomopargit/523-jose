"use client";

import Link from "next/link";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-brand mb-3">Erro ao carregar área do associado</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        O cache do navegador ou do servidor pode estar corrompido. Tente novamente.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={reset} className="btn-primary btn-md">
          Tentar novamente
        </button>
        <Link href="/login" className="btn-outline btn-md">
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
