# PAGES.md — Especificação detalhada por página

Última atualização: 2025-12-03

Este documento descreve, em detalhe, cada página do frontend (`apps/frontend`). Para cada página descrevemos:
- Objetivo
- Rota / Navegação
- Estado local e global
- Props (quando aplicável)
- Interações com API (endpoints, payloads esperados)
- Validações e mensagens de erro
- Comportamento de UI/UX (loading, skeletons, empty states, modais)
- Acessibilidade e internacionalização
- Critérios de aceite / testes manuais

Sumário de páginas cobertas
- `/login` (Login)
- `/register` (Register)
- `/dashboard` (Dashboard / Price list)
- `/coins/:id` (CryptoDetail)
- `/alerts` (Alerts management)
- `/settings` (Settings)
- `/news` (News)
- `/profile` (Profile / Account)
- `404` (Not Found)

---

## 1) Página: Login

Rota: `/login`

Objetivo:
- Permitir autenticação de usuários (login) e roteamento para o `Dashboard`.

Estado / Props:
- Local: `email`, `password`, `loading`, `error`, `isSignup` (caso a UI tenha toggle)
- Global: armazena `authToken` e `userName` em `localStorage` após sucesso

API:
- POST `${VITE_API_URL}/auth/login`
  - Body: `{ email, password }`
  - Success: `{ data: { token, user } }` -> salvar `localStorage.setItem('authToken', token)` e `userName`
  - Failure: `{ error: { message } }` ou 4xx/5xx

Validação:
- Email: required, formato válido (regex simples)
- Password: required, mínimo 6 chars
- Exibir mensagens inline para cada campo e uma mensagem global para erro de autenticação

UX / UI:
- Mostrar skeletons não necessário; usar `loading` no botão e indicador visual
- Focar automaticamente no campo email ao montar a página
- Botão desabilitado quando `loading` ou campos inválidos
- Link para `/register`

Acessibilidade:
- Labels ligados aos inputs (`htmlFor`) e `aria-invalid` quando erro
- Mensagens de erro com `role="alert"`

Critérios de aceite:
- Login com credenciais válidas redireciona para `/dashboard`
- Mensagem clara quando credenciais incorretas
- Token salvo em `localStorage` como `authToken`

Testes manuais:
- Tentar login válido e inválido; observar tokens e redirecionamento

---

## 2) Página: Register

Rota: `/register`

Objetivo:
- Criar nova conta de usuário e logar automaticamente (se aplicável).

Estado / Props:
- Local: `name`, `email`, `password`, `loading`, `error`

API:
- POST `${VITE_API_URL}/auth/register`
  - Body: `{ name, email, password }`
  - Success: retorna token / user, tratar como login
  - Failure: retornar erro amigável (ex.: email já registrado)

Validação:
- Name: required, min 2 chars
- Email: required, formato
- Password: required, min 6 chars, mostrar hint/tooltip sobre segurança

UX / UI:
- Exibir mensagem de sucesso e redirecionar para `/dashboard`
- Mostrar erro inline de validação e bloco de erro global

Acessibilidade:
- Expor `aria-describedby` para hints e `aria-invalid`

Critérios de aceite:
- Registro bem-sucedido cria token e redireciona
- Erros exibidos de modo claro

---

## 3) Página: Dashboard

Rota: `/dashboard`

Objetivo:
- Exibir lista de criptomoedas (cards) com preço atual, variação 24h e ações rápidas (ver detalhes, favoritar, criar alerta)

Estado / Props:
- Local: `coins[]`, `filteredCoins[]`, `searchTerm`, `loading`, `error`, `lastUpdate`
- Global: `authToken` (opcional para funcionalidades autenticadas)

API:
- GET `${VITE_API_URL}/coins` — retorna array de cotações com: `id, symbol, name, image, current_price, price_change_percentage_24h, market_cap, total_volume`

Comportamento:
- Ao entrar carregar lista (mostrar skeleton cards enquanto `loading`)
- Pesquisa client-side (filtrar `coins` por `name` ou `symbol`)
- Botão `Refresh` chama API novamente
- Clique no card abre `CryptoDetail` (rota `/coins/:id`)
- Ações rápidas: favoritar (localStorage `favorites`), criar alerta (abre modal ou encaminha para `/alerts`)

UI / Responsividade:
- Grid responsivo: 1 col (mobile), 2 md, 3/4 larguras maiores
- Cada card tem header, price, change, market info, CTA

Edge cases:
- Empty list: mostrar `EmptyState` com instrução
- Erro de rede: mostrar banner vermelho com retry

Acessibilidade:
- Cards focáveis via teclado (`tabindex=0`) e `aria-label` descrevendo ação

Critérios de aceite:
- Lista carrega e atualiza corretamente
- Busca filtra com debounce (100-300ms)

---

## 4) Página: CryptoDetail (Coin / Detalhe de moeda)

Rota: `/coins/:id`

Objetivo:
- Exibir informações detalhadas da moeda: imagem, símbolo, rank, preço atual, gráfico sparkline (historico), conversor, dados de mercado, descrição, ações (favoritar, compartilhar, criar alerta)

Props / Estado:
- Props: `coinId` via rota
- Local: `coin` (objeto), `loading`, `error`, `sparkline[]`, `days`, `expanded` (descrição), `convertAmount`, `isFavorite`

API:
- GET CoinGecko (ou backend proxy): `https://api.coingecko.com/api/v3/coins/${coinId}` para detalhes
- GET sparkline: `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}` ou backend equival.
- POST criar alerta:
  - POST `${VITE_API_URL}/alerts` body: `{ coinId, targetPrice }` com Authorization

Comportamento:
- Loading: full-page spinner
- Error: card com mensagem e botão voltar
- Sparkline: calcular path SVG responsivo; exibir gradiente e stroke
- Conversor: atualizar valores USD/BRL conforme input; usar NumberFormat com locale padrão
- Favoritar: toggle localStorage `favorites` e feedback visual
- Compartilhar: use Clipboard API; fallback alert
- Criar alerta: prompt/modal com validação (número > 0), se não autenticado redirecionar para login

Validação UX:
- Prompt de alerta: validar número e exibir erros claros
- Conversor: bloquear inputs inválidos

Acessibilidade:
- Gráfico SVG com `role='img'` e `aria-label` e texto alternativo para leitores

Critérios de aceite:
- Dados carregam corretamente para várias `days` (7, 30, 365)
- Copy link funciona em navegadores modernos

---

## 5) Página: Alerts (Gerenciamento de alertas)

Rota: `/alerts`

Objetivo:
- Permitir ao usuário listar, criar, ativar/desativar e remover alertas personalizados.

Estado / Props:
- Local: `items[]`, `page`, `limit`, `total`, `loading`, `error`, `showModal`, `modal form fields (crypto,tipo,direction,precoAlvo,percentualAlta,percentualQueda,volumeMinimo)`, `modalError`

API:
- GET `${VITE_API_URL}/alerts/listar?page=&limit=`
- POST `${VITE_API_URL}/alerts/criar` (Bearer token)
- DELETE `${VITE_API_URL}/alerts/remover/:id`
- PATCH `${VITE_API_URL}/alerts/:id/ativar-desativar`

Formulário de criação (regras):
- Campos: `crypto` (id), `tipo` (precoAlvo|altaPercentual|quedaPercentual|volume), `direction`(above|below), condicao valor correspondente
- Validações: campo condicional obrigatório; `crypto` não vazio; números > 0; porcentagens entre 0 e 100

UX / Modais:
- Modal para criar alerta: fechar com `Esc` e clicando fora
- Mostrar `loading` no submit e mensagem de sucesso (toast) após criar
- Table/Card list com data de criação, condição e botão toggle de status

Edge cases:
- Page > last: ajustar para última página disponível
- Falha de autenticação: redirecionar para `/login` com mensagem

Acessibilidade:
- Modals com `aria-modal=true`, foco gerenciado (trap)

Critérios de aceite:
- CRUD funciona com token de usuário
- Mensagens de validação claras

---

## 6) Página: Settings

Rota: `/settings`

Objetivo:
- Permitir ao usuário configurar preferências (tema, notificações, conta)

Estado:
- `theme`, `notifications`, `loading`, `saved` (feedback)

Comportamento:
- Salvar settings em `localStorage` e/ou endpoint (se existir)
- Mostrar confirmação `Settings saved` e feedback visual

Testes / critérios:
- Mudança de tema aplica classes globais e persiste após refresh

---

## 7) Página: News

Rota: `/news`

Objetivo:
- Exibir feed de notícias relacionadas a criptomoedas (opcional)

API:
- Pode consumir feed externo (RSS -> backend) ou endpoint interno `/news`

Comportamento:
- Paginação/infinite scroll, loading placeholders, links abrem em nova aba com `rel="noopener noreferrer"`

---

## 8) Página: Profile (Account)

Rota: `/profile` ou `/settings/profile`

Objetivo:
- Editar dados do usuário (nome, email), ver histórico de alertas, logout

API:
- GET `/auth/me` (opcional)
- PUT `/users/:id` para atualizar

Segurança:
- Reautenticação para operações sensíveis

---

## 9) Página: 404 / Not Found

Objetivo:
- Informar rota inválida com CTA para voltar ao `Dashboard` ou `Home`.

UI:
- Simples, link claro para rota raiz e pesquisa

---

## 10) Cross-cutting concerns (transversais entre páginas)

- Autenticação & Guardas de rota:
  - Implementar `PrivateRoute` para `/alerts`, `/settings`, `/profile` e ações sensíveis.
  - Se token inválido: limpar `localStorage` e redirecionar para `/login` com query `?redirect=/alerts`.

- Internationalization (i18n):
  - Centralizar strings em `apps/frontend/src/i18n/strings.ts` e usar hook `useStrings()`.

- Error handling & toasts:
  - Ter um `ErrorBoundary` para páginas e um `Toast` central para sucesso/erro.

- Logging & analytics:
  - Enviar eventos principais (login, create-alert, view-coin) para `VITE_ANALYTICS_KEY` ou stub.

- Performance:
  - Cache de requisições com SWR/React Query para coins e detalhes (stale-while-revalidate).

---

## 11) Critérios de aceitação gerais (QA)

- Navegação: todas as rotas acessíveis via URL direta
- Responsividade: validar em widths 360px, 768px, 1024px
- Acessibilidade básica: contraste, labels, foco teclado, role/aria onde necessário
- Internacionalização: strings centralizadas

---

## 12) Próximos passos práticos (to-dos executáveis)

1. Gerar `COMPONENTS.md` automaticamente a partir de `apps/frontend/src/components`.
2. Padronizar `authToken` e atualizar todos os usos (`localStorage.getItem('token')` → `authToken`).
3. Implementar `PrivateRoute` e proteger páginas sensíveis.
4. Adicionar React Query para caching e revalidation.

---

Se quiser, eu gero o `COMPONENTS.md` agora ou aplico o patch para padronizar `authToken` automaticamente. Diga qual prefere e eu executo.
