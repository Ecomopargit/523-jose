# ECOMOPAR — Checklist de Desenvolvimento e Deploy

## Identidade visual (protótipo UI/UX)
- [x] Paleta verde/âmbar/brick (`#0B3D2C`, `#136148`, `#C68A3D`, `#B5502F`)
- [x] Tipografia Space Grotesk + Inter + IBM Plex Mono
- [x] Design system em `globals.css` (cards, botões, badges, heroes)
- [x] Logo com brand-mark quadrado + tagline
- [x] Theme color PWA `#0B3D2C`

## Site institucional (marketing)
- [x] Home, Quem Somos, Benefícios, Como Funciona
- [x] Indique e Ganhe, Contato, Associar-se
- [x] Header / Footer alinhados ao novo visual
- [x] Política de privacidade

## Área do associado — UI alinhada ao protótipo
- [x] Login (card + labels) e recuperar senha
- [x] DashboardShell (sidebar 264px, topbar, meta por rota)
- [x] Início (hero, ring de depósitos, stats, atalhos)
- [x] Financeiro / Saldo (cards disponível, bloqueado, bônus)
- [x] Solicitar saque (hero + formulário)
- [x] Histórico / Extrato (filtros + txn rows)
- [x] Clube de benefícios + Perfil
- [x] Envio de pagamento (PIX)
- [x] Ativar cadastro (plano diário)
- [x] Indicações (código, link, lista)

## Painel admin
- [x] AdminShell no padrão verde
- [x] Dashboard admin (KPIs mock)
- [x] Associados (busca, filtro, tabela)
- [x] Saques (resumo, filtro, aprovar/rejeitar UI)

## PWA / App Stores
- [x] `manifest.webmanifest` (theme `#0B3D2C`)
- [x] Ícone SVG + meta Apple Web App
- [x] Service worker (assets estáticos em produção; off em dev)
- [ ] Ícones PNG 192×192 e 512×512
- [ ] Capacitor / App Store / Play Store

## Backend / integrações (próximos passos MVP)
- [x] Firebase client configurado
- [x] `.env.example`
- [ ] Auth Firebase real (hoje mock/redirect)
- [ ] Firestore: users, balances, deposits, withdrawals
- [ ] Regras de segurança Firestore
- [ ] PIX real (ou confirmação manual no admin)
- [ ] Indique e ganhe com crédito automático

## Deploy Hostinger
- [x] `output: "standalone"`
- [x] `hostinger.json`
- [ ] Env `NEXT_PUBLIC_FIREBASE_*` no painel
- [ ] Build + start em produção
- [ ] Domínio apontando

## Quality gate desta rodada
- [x] Páginas restantes do dashboard no design system
- [x] Login / recuperar senha polidos
- [x] Admin associados + saques com tokens novos
- [ ] `npm run build` + smoke no browser após estas mudanças
- [ ] Commit / push das alterações de UI

## Estimativa de produto (referência)
| Versão | Dias | Foco |
|--------|------|------|
| MVP | 22 | Auth, Firestore, PIX mín., saque, admin, deploy |
| Robusta | 35 | Webhook PIX, indicações, e-mail, security, ops |

## Comandos

```bash
npm run dev
npm run dev:clean
npm run build && npm run start
```

## Observações
- Manter **15+ GB livres** (OneDrive pode corromper `.next`)
- Excluir `.next` da sincronização OneDrive
- **Nunca commitar** `.env`
