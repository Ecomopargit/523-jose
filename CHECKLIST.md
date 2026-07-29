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
- [x] Ícones PNG 192×192 e 512×512
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

---

# Checklist da rodada — 29/07/2026

## Aplicativo mobile — área do associado

- [x] Revisar e refinar a página **Início**
- [x] Manter visão de patrimônio, status e atalhos rápidos
- [x] Revisar e refinar a página **Carteira**
- [x] Manter os fluxos de depósito e solicitação de saque
- [x] Revisar e refinar a página **Benefícios**
- [x] Revisar e refinar a página **Perfil**
- [x] Corrigir contraste da barra de status nas quatro páginas
- [x] Adicionar estados pressionados e melhorias de acessibilidade
- [x] Conectar o acesso à central de atendimento
- [x] Preservar autenticação, dados do associado e regras existentes

## Mobile — páginas individuais dos benefícios

- [x] Criar página própria para **Proteção financeira**
- [x] Criar página própria para **Assistência à saúde**
- [x] Criar página própria para **Orientação jurídica**
- [x] Criar página própria para **Assistência veicular**
- [x] Adicionar proposta, destaques e passo a passo em cada página
- [x] Adicionar ações específicas para cada benefício
- [x] Fazer os cartões da lista abrirem suas respectivas páginas
- [x] Remover o status **Em breve** da Assistência à saúde
- [x] Alterar Assistência à saúde para **Incluído**
- [x] Disponibilizar a ação **Solicitar atendimento**
- [x] Registrar a nova rota `BenefitDetail` na navegação mobile

## Dashboard web — design system

- [x] Centralizar o conteúdo em container de até 1500px
- [x] Aumentar respiro e melhorar distribuição horizontal
- [x] Refinar paleta de verdes e cinzas institucionais
- [x] Evoluir sombras, bordas e raios dos componentes
- [x] Padronizar cards com profundidade e hover suave
- [x] Criar fundo com iluminação ambiental discreta
- [x] Adicionar cabeçalho translúcido com blur e fallback
- [x] Refinar sidebar, item ativo, avatar e microinterações
- [x] Preservar suporte a movimento e transparência reduzidos

## Dashboard web — páginas

- [x] Redesenhar a página **Início**
- [x] Dar maior destaque ao saldo e indicadores financeiros
- [x] Reorganizar estatísticas, atalhos e benefícios
- [x] Redesenhar a página **Meu perfil**
- [x] Separar identidade do associado e dados cadastrais
- [x] Organizar dados pessoais em grid responsivo
- [x] Redesenhar a página **Solicitar saque**
- [x] Centralizar o formulário e adicionar resumo lateral
- [x] Manter validações, envio e estados de sucesso existentes
- [x] Redesenhar a página **Histórico saque**
- [x] Transformar movimentações em extrato bancário moderno
- [x] Melhorar filtros, status, valores e hierarquia das transações
- [x] Redesenhar o **Clube de benefícios**
- [x] Transformar benefícios em vitrine de produtos
- [x] Redesenhar a página **Financeiro**
- [x] Melhorar leitura dos saldos disponível, bloqueado e bônus
- [x] Adicionar painel explicativo sobre a composição do patrimônio
- [x] Preservar rotas, hooks, APIs e regras de negócio

## Validação realizada

- [x] `npx tsc --noEmit` no aplicativo mobile
- [x] Bundle Android do Expo gerado sem erros
- [x] `npm run typecheck` no projeto web
- [x] `npm run lint`
- [x] `npm run build`
- [x] `git diff --check`
- [x] Alterações paralelas existentes preservadas

## Conferências pendentes

- [ ] Fazer smoke test visual autenticado das seis páginas web
- [ ] Conferir desktop em 1440px e notebook em 1280px
- [ ] Conferir tablet e menu lateral móvel
- [ ] Conferir mobile em Android e iOS reais
- [ ] Testar depósito e saque com usuário de homologação
- [ ] Testar abertura das quatro páginas de benefícios no aparelho
- [ ] Revisar textos jurídicos e coberturas com o responsável pelo produto
- [ ] Criar commit da rodada
- [ ] Fazer push e publicar somente após aprovação visual
