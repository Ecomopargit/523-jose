# ECOMOPAR — Checklist de Desenvolvimento e Deploy

## Identidade visual
- [x] Paleta verde `#108a3d` (padrão app mobile)
- [x] Logo ECOMOPAR + tagline "Economia do motorista parceiro"
- [x] Botões e campos pill (arredondados)
- [x] Tipografia Plus Jakarta Sans
- [x] Marketing pages migradas para verde

## Site institucional (marketing)
- [x] Home com hero, benefícios, indique e ganhe
- [x] Quem Somos, Benefícios, Como Funciona
- [x] Indique e Ganhe, Contato, Associar-se
- [x] Header com navegação desktop/mobile
- [x] Footer com links e política de privacidade

## Área do associado
- [x] Login (server action — funciona sem JS)
- [x] Recuperar senha
- [x] Dashboard (saldo, atalhos, benefícios)
- [x] Drawer verde mobile (menu do app)
- [x] Ativar cadastro (plano R$ 7,00/dia)
- [x] Perfil, Benefícios, Pagamentos PIX
- [x] Saldo, Saque, Extrato, Indicações
- [x] Página de erro no dashboard

## Painel admin
- [x] AdminShell verde
- [x] Dashboard, Associados, Saques

## PWA / App Stores (preparação)
- [x] `manifest.webmanifest`
- [x] Ícone SVG
- [x] Meta Apple Web App
- [x] Service worker (apenas assets estáticos em produção)
- [x] SW desregistrado automaticamente em dev
- [ ] Ícones PNG 192×192 e 512×512 (lojas)
- [ ] Capacitor para App Store / Play Store
- [ ] Conta Apple Developer + Google Play Console

## Backend / integrações
- [x] Firebase configurado (`src/lib/firebase.ts`)
- [x] `.env.example` com variáveis necessárias
- [ ] Auth Firebase no login (hoje mock)
- [ ] Firestore: saldo, depósitos, saques
- [ ] Integração PIX real
- [ ] Regras de segurança Firestore

## Deploy Hostinger
- [x] `output: "standalone"` no Next.js
- [x] `hostinger.json` com scripts
- [ ] Variáveis `NEXT_PUBLIC_FIREBASE_*` no painel Hostinger
- [ ] Build: `npm install && npm run build`
- [ ] Start: `npm run start` (porta via `PORT`)
- [ ] Domínio apontando para o serviço Node.js

## Testes locais
- [x] `npm run build` passa
- [x] `npm run lint` passa
- [x] Rotas principais retornam 200
- [ ] Testar login → dashboard no navegador limpo
- [ ] Testar menu mobile e todas as subpáginas

## Comandos úteis

```bash
# Desenvolvimento normal
npm run dev

# Limpar cache corrompido (.next) e subir dev
npm run dev:clean

# Build de produção
npm run build && npm run start
```

## Observações importantes
- Manter **15+ GB livres** no disco (OneDrive pode corromper `.next`)
- Excluir pasta `.next` da sincronização OneDrive
- Após problemas de cache: F12 → Application → Clear site data
- **Nunca commitar** o arquivo `.env`
