import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-bg flex items-center justify-center text-ink-soft text-sm">
          Carregando…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
