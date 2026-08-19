"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { readCadastroReturn } from "@/lib/cadastro-draft";

function resolveReturnTarget(queryReturn: string | null) {
  const stored = readCadastroReturn();
  const candidate = queryReturn || stored || "/cadastrar";
  if (candidate.includes("cadastrar")) return "/cadastrar";
  return candidate.startsWith("/") ? candidate : "/cadastrar";
}

export function PoliticaBackLink() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = useMemo(
    () => resolveReturnTarget(params.get("return")),
    [params],
  );
  const fromRegister = returnTo.includes("cadastrar");
  const label = fromRegister ? "Voltar ao cadastro" : "Voltar";

  return (
    <button
      type="button"
      onClick={() => router.push(returnTo)}
      className="inline-block mt-10 text-brand font-bold hover:underline"
    >
      {label}
    </button>
  );
}
