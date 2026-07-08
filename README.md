# ECOMOPAR — Instituto de Apoio ao Motorista Autônomo

Aplicação web (site institucional + área do associado + painel administrativo)
construída com **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4** e
**Firebase** como backend de dados/autenticação.

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Firebase](https://firebase.google.com) — Firestore + Authentication
- [lucide-react](https://lucide.dev) — ícones

## Estrutura

```
src/
  app/
    (marketing)/        # site público (home, quem-somos, benefícios, etc.)
    dashboard/          # área do associado
    admin/              # painel administrativo
    login/              # autenticação
    api/health/         # health check
  components/           # Header, Footer, DashboardShell, AdminShell
  lib/firebase.ts       # inicialização do Firebase (Firestore + Auth)
```

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz (use `.env.example` como base) com as
   credenciais do seu projeto Firebase:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

## Scripts

```bash
npm run dev        # ambiente de desenvolvimento (http://localhost:3000)
npm run build      # build de produção
npm run start      # servir o build de produção
npm run lint       # ESLint
npm run typecheck  # checagem de tipos (tsc)
```

## Notas

- O Firebase (Firestore/Auth) é usado como banco de dados. As credenciais ficam
  em variáveis `NEXT_PUBLIC_*` porque são consumidas pelo cliente — as chaves de
  API do Firebase para web são públicas por design; a segurança dos dados é
  garantida pelas **Regras de Segurança do Firestore/Auth**.
- As páginas atualmente usam dados de exemplo (mock); a integração de leitura/
  escrita com o Firestore pode ser feita a partir de `src/lib/firebase.ts`.
