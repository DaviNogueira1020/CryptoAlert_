<!--
   EST RUTURA.md — Documentação completa do projeto CryptoAlert_
   Conteúdo: visão geral, instalação, arquitetura, componentes, estilo, práticas e troubleshooting
-->

# CryptoAlert_ — Documentação Completa do Projeto

Última atualização: 2025-12-03

Índice
- **1. Visão Geral do Projeto**
- **2. Configuração e Instalação**
- **3. Arquitetura e Estrutura de Código**
- **4. Componentes (documentação por componente)**
- **5. Estilo e UI**
- **6. Boas Práticas**
- **7. Testes, CI e Deploy**
- **8. Troubleshooting & FAQ**
- **9. Próximos passos recomendados**

**Observação:** Esta documentação prioriza a experiência de desenvolvimento local (Windows / PowerShell) e descreve como trabalhar com os workspaces `apps/backend`, `apps/frontend` e `packages/shared`.

**1. Visão Geral do Projeto
**
- Objetivo: CryptoAlert_ é uma aplicação full-stack para monitoramento de preços de criptomoedas, criação/gerenciamento de alertas e exibição de dados de mercado. Fornece uma API (backend) e uma interface SPA (frontend) com componentes e utilitários compartilhados.
- Público-alvo: usuários que querem acompanhar cotações e receber notificações quando condições pré-definidas são atendidas.

Principais features:
- Dashboard com cotações e cards por moeda
- Detalhe de moeda com gráficos históricos e conversor
- CRUD de alertas (criar / listar / ativar-desativar / remover)
- Autenticação (JWT) — arquitetura já preparada para suporte
- Design system modular (componentes atômicos, cards, botões, inputs)

2. Configuração e Instalação
--------------------------------
Requisitos mínimos
- Node.js LTS recomendado (>=18, preferível 18.x ou 20.x)
- npm >= 9 (ou Yarn se preferir, ajustes nos scripts podem ser necessários)
- Git
- PostgreSQL local (se for rodar o backend com banco) — versão recente (13+)

Clonar o repositório
```powershell
git clone <repo-url> CryptoAlert_
cd "C:\Users\davin\OneDrive\Área de Trabalho\CriptoAlert_"
```

Instalar dependências (root com workspaces npm)
```powershell
npm install
```

Variáveis de ambiente
- Copie o `.env.example` (se existir) para `.env` na raiz e configure as chaves necessárias.
- Valores importantes (exemplos):
   - `DATABASE_URL=postgresql://user:password@localhost:5432/criptocert_db`
   - `VITE_API_URL=http://localhost:3000`
   - `PORT=3000`

Scripts principais
- Rodar ambos (frontend + backend) em desenvolvimento (PowerShell):
```powershell
npm run dev
```
- Rodar apenas frontend:
```powershell
npm run dev --workspace=apps/frontend
```
- Rodar apenas backend:
```powershell
npm run dev --workspace=apps/backend
```
- Build de produção (todos workspaces):
```powershell
npm run build
```

Prisma (backend)
- Gerar client:
```powershell
npm run prisma:generate --workspace=apps/backend
```
- Aplicar schema (push / migrate):
```powershell
npm run prisma:push --workspace=apps/backend
npm run prisma:migrate --workspace=apps/backend
```

3. Arquitetura e Estrutura de Código
--------------------------------------
Visão geral do monorepo
- `apps/backend/` — API Node + Express + Prisma
- `apps/frontend/` — React + Vite + Tailwind + Design System
- `packages/shared/` — tipos e utilitários compartilhados (TS)

Estrutura (resumida)
- `apps/frontend/src/`
   - `components/` — componentes reutilizáveis (common, layout, atoms)
   - `pages/` — páginas React (Login, Register, Dashboard, Alerts, CryptoDetail, Settings)
   - `services/` — integração com API (fetch wrappers)
   - `hooks/` — hooks personalizados (useAuth, useFetch, etc.)
   - `config/` — animações, tokens de design, constantes
   - `i18n/` — strings centralizadas (se houver)

- `apps/backend/src/`
   - `controllers/` — handlers das rotas
   - `services/` — lógica de negócio
   - `repositories/` — acesso ao banco (Prisma)
   - `routes/` — definição das rotas express
   - `middlewares/` — autenticacao, tratamento de erros

Convenções de código
- Componentes React: PascalCase (ex.: `CryptoDetail`, `MyButton`)
- Hooks: prefixo `use` em camelCase (ex.: `useAuth`, `useFetchCoins`)
- Arquivos TS/TSX: `kebab-case` para rotas e pages, `PascalCase` para componentes
- Tipagem: utilizar interfaces/types em `packages/shared/src/types.ts` quando aplicável

Padrões de import/export
- Prefer exports nomeados em módulos utilitários.
- Re-exportar componentes indexados em `components/index.ts` para imports curtos:
   - `import { Button } from '@/components';`

4. Componentes
----------------
Nesta seção documentamos os componentes principais (resumo). Para cada componente incluímos props, exemplos e comportamento.

- `Button` (DesignSystemComponents)
   - Props (exemplo):
      ```ts
      interface ButtonProps {
         children?: React.ReactNode;
         onClick?: () => void;
         variant?: 'primary'|'ghost'|'outline';
         size?: 'sm'|'md'|'lg';
         leftIcon?: React.ReactNode;
         className?: string;
      }
      ```
   - Uso:
      ```tsx
      <Button variant="primary" onClick={handleSave}>Save</Button>
      <Button variant="ghost" leftIcon={<ArrowLeft/>}>Back</Button>
      ```
   - Comportamento: aceita `leftIcon`, aplica estilos do design system, respeita `disabled`.

- `Card`
   - Props básicos: `className?: string`, `children: React.ReactNode`, `variant?: string`
   - Uso:
      ```tsx
      <Card className="p-4">...</Card>
      ```

- `Input`, `PasswordInput`, `FormField` (FormComponents)
   - Props: `value`, `onChange`, `type`, `label?`, `error?`, `hint?`
   - Uso:
      ```tsx
      <FormField label="Email">
         <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      ```

- `Layouts` (PageLayout, Container, HStack, VStack)
   - Props: geralmente `className?: string`, `children`
   - Uso:
      ```tsx
      <PageLayout>
         <Container>
            <h1>Title</h1>
         </Container>
      </PageLayout>
      ```

Documentação completa de componentes
- Se desejar, posso gerar um `COMPONENTS.md` com a documentação linha-a-linha dos arquivos em `apps/frontend/src/components` (props extraídas automaticamente), e exemplos de uso para cada componente. Diga se quer que eu gere esse arquivo.

5. Estilo e UI
----------------
Frameworks e ferramentas
- Tailwind CSS: utilitário para estilização (usado amplamente nos componentes)
- Framer Motion: animações e transições
- Lucide Icons (ou similar) para ícones

Paleta (tokens)
- A paleta está centralizada nos tokens do design system (ex.: `--color-primary: #5B52FF`, `--color-accent: #00B8D4`). Consulte `apps/frontend/src/config/design.system.ts` ou `tokens` para valores exatos.

Padrões de responsividade
- Componentes usam utilitários responsive do Tailwind (ex.: `sm:`, `md:`, `lg:`). Planeje layout mobile-first.

Recomendação de UI
- Use classes utilitárias reutilizáveis dos componentes atômicos, não repita estilos inline.

6. Boas Práticas
------------------
React + TypeScript
- Hooks: usar `useEffect` com lista de dependências correta; extrair lógica complexa para hooks customizados.
- State: preferir estados locais para UI e context para estados globais (ex.: auth)
- Typagem: exportar interfaces em `packages/shared/src/types.ts` e reutilizar entre frontend/backend quando pertinente.

Tratamento de erros
- No backend: usar um middleware global de erro que retorne payloads consistentes: `{ success: false, error: { message, code? } }`.
- No frontend: centralizar mensagens (i18n/strings) e exibir toasts/modals para erros bloqueantes.

Segurança
- Não exponha chaves sensíveis no frontend. Use `VITE_` prefix para variáveis públicas; mantenha segredos no backend.

7. Testes, CI e Deploy
-------------------------
Testes
- Unitários: Jest / Vitest para frontend e backend (configurar por workspace)
- Testes de integração: rotas express usando supertest
- Testes E2E: Playwright / Cypress para fluxos críticos (login, criar alerta)

CI (recomendações)
- Pipeline GitHub Actions (arquivo de exemplo em `.github/workflows/ci.yml`) com passos:
   - Install deps
   - Lint
   - Typecheck
   - Run tests
   - Build (frontend/backend)

Deploy
- Backend: containerizar com Docker e deploy em servidor (Heroku, DigitalOcean App Platform, or Kubernetes)
- Frontend: build estático enviado para Vercel/Netlify ou servido por Nginx

8. Troubleshooting & FAQ
---------------------------
- Erro: `Cannot find module '@prisma/client'`
   - Solução: `cd apps/backend` → `npm run prisma:generate` ou `npx prisma generate`

- Dev server travando por import não resolvido
   - Verifique imports relativos e extensões `.ts/.tsx`.
   - Use caminhos absolutos configurados no `tsconfig.paths` se disponível.

- Problemas de CORS com API durante dev
   - Certifique-se que `VITE_API_URL` aponte para `http://localhost:3000` e que o backend aceite requests do origin do frontend (middleware CORS).

- LocalStorage token keys inconsistentes
   - Padronize o uso de `authToken` em todo o frontend. Procure por `localStorage.getItem('token')` e substitua por `authToken` se esse for o padrão.

9. Próximos passos recomendados
--------------------------------
Curto prazo
- Padronizar i18n: mover strings para `apps/frontend/src/i18n/strings.ts` e usar hook `useTranslation()`.
- Normalizar localStorage token key (`authToken`).

Médio prazo
- Formalizar design system (Storybook) para componentes.
- Cobertura de testes e CI completo.

Longo prazo
- Implementar notificações push / integrações (e-mail/Telegram)
- Adicionar caching e métricas (Redis / Prometheus)

---

Se quiser, eu gero automaticamente:
- `COMPONENTS.md` com props extraídas de `apps/frontend/src/components`;
- Um checklist `DEV-SETUP.md` com comandos copy-paste para Windows PowerShell;
- Um PR que padronize `authToken` em todo o frontend.

Diga qual desses itens prefere que eu gere em seguida.

-----------------------------
10. Documentação Técnica Complementar (completa)
------------------------------------------------
Esta seção reúne documentação adicional e muito útil para desenvolvedores e para automação (CI / Docker / Deploy / testes).

10.1 Componentes — Referência detalhada
--------------------------------------
Observação: os componentes estão em `apps/frontend/src/components` e muitos usam tipagens em `packages/shared`.

- `Button` (DesignSystemComponents)
   - Props:
      ```ts
      interface ButtonProps {
         children?: React.ReactNode;
         onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
         variant?: 'primary'|'ghost'|'outline'|'neon';
         size?: 'sm'|'md'|'lg';
         leftIcon?: React.ReactNode;
         rightIcon?: React.ReactNode;
         disabled?: boolean;
         className?: string;
         type?: 'button'|'submit'|'reset';
      }
      ```
   - Example:
      ```tsx
      <Button variant="primary" onClick={handleSave} leftIcon={<SaveIcon/>}>Save</Button>
      ```
   - Behavior: applies accessible roles, supports keyboard focus, shows disabled UI when `disabled`.

- `Card`
   - Props: `children`, `className`, `variant?: 'default'|'neon'`.
   - Example: `<Card className="p-4">content</Card>`

- `Input` / `PasswordInput` / `FormField`
   - Common props: `value`, `onChange`, `placeholder`, `label?`, `error?`, `hint?`, `type?`.
   - `PasswordInput` also exposes a `toggleShow` internal control and accepts `minLength`.
   - Example:
      ```tsx
      <FormField label="Email" hint="We'll never share your email">
         <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      ```

- `Layouts` (PageLayout, Container, HStack, VStack)
   - `PageLayout`: wrapper page with background + header + footer slots.
   - `Container`: centraliza largura e padding padrão.
   - `HStack` / `VStack`: helpers para layout flex horizontal / vertical com gap.
   - Example:
      ```tsx
      <PageLayout>
         <Container>
            <HStack gap={4}><Button>OK</Button><Button>Cancel</Button></HStack>
         </Container>
      </PageLayout>
      ```

- `Header` / `Navbar`
   - Props: nenhum obrigatório; lê `localStorage.userName` para saudação.
   - Contains nav items: Dashboard, Alerts, News, Profile.

- `PriceTicker` / `ParticleBackground`
   - `PriceTicker` busca dados em intervalos regulares e exibe uma linha de preços.
   - `ParticleBackground` desenha canvas com partículas; não possui props.

- Páginas com props importantes
   - `CryptoDetail`:
      ```ts
      interface CryptoDetailProps {
         coinId: string;
         onBack: () => void;
         onCreateAlert?: (coinId: string, coinName: string, currentPrice: number) => void;
      }
      ```

10.2 API — Contratos / Endpoints
--------------------------------
Todas URLs de API usam o prefixo configurado por `VITE_API_URL` no frontend (ex.: `http://localhost:3000`).

- Auth
   - POST `/auth/login`
      - Body: `{ email, password }`
      - Response: `{ data: { token, user } }` ou `{ error }`
   - POST `/auth/register`
      - Body: `{ email, password, name }`

- Alerts
   - GET `/alerts/listar?page=1&limit=10`
      - Response: `{ data: { resultados: Alert[], paginacao: { total, page, limit } } }`
   - POST `/alerts/criar`
      - Body: `{ crypto, tipo, direction, precoAlvo?, percentualAlta?, percentualQueda?, volumeMinimo? }`
      - Auth: Bearer token
   - DELETE `/alerts/remover/:id`
   - PATCH `/alerts/:id/ativar-desativar`

- Coins
   - GET `/coins` — lista de cotações (usado pelo Dashboard)
   - GET `/coins/:id` — detalhes da coin (backend pode proxy para CoinGecko)

Exemplo de resposta (alert):
```json
{
   "data": {
      "resultados": [
         {"id":"uuid","crypto":"bitcoin","tipo":"precoAlvo","precoAlvo":50000,"direction":"above","isActive":true,"createdAt":"..."}
      ],
      "paginacao": {"total": 1, "page":1, "limit":10}
   }
}
```

10.3 Variáveis de Ambiente (lista)
---------------------------------
- Raiz (`.env` / CI)
   - `NODE_ENV` = development|production

- Backend (`apps/backend/.env`)
   - `PORT` — porta do servidor (ex.: 3000)
   - `DATABASE_URL` — string de conexão Postgres (Prisma)
   - `JWT_SECRET` — segredo para tokens JWT
   - `SMTP_*` — variáveis opcionais para envio de e-mail

- Frontend (`apps/frontend/.env`)
   - `VITE_API_URL` — URL base da API (ex.: http://localhost:3000)
   - `VITE_ANALYTICS_KEY` — (opcional)

10.4 TypeScript / Paths
------------------------
Recomenda-se configurar `paths` no `tsconfig.json` raiz e do frontend para facilitar imports do tipo `@/components`:

Exemplo `tsconfig.json` (parte):
```json
{
   "compilerOptions": {
      "baseUrl": ".",
      "paths": {
         "@/*": ["apps/frontend/src/*"],
         "@shared/*": ["packages/shared/src/*"]
      }
   }
}
```

10.5 Lint, Formatação e Testes
-------------------------------
- Lint (ESLint):
   - Rodar: `npm run lint --workspace=apps/frontend` ou `npm run lint` na raiz para todos.
- Formatação (Prettier):
   - Rodar: `npm run format` (se existir script) ou `npx prettier --write .`
- Testes:
   - Frontend: `npm run test --workspace=apps/frontend` (Jest/Vitest)
   - Backend: `npm run test --workspace=apps/backend`

10.6 GitHub Actions — exemplo de CI
-----------------------------------
Crie `.github/workflows/ci.yml` com etapas mínimas:
```yaml
name: CI
on: [push, pull_request]
jobs:
   build:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - name: Setup Node
            uses: actions/setup-node@v4
            with:
               node-version: 18
         - name: Install
            run: npm ci
         - name: Lint
            run: npm run lint
         - name: Typecheck
            run: npm run -s typecheck || true
         - name: Run tests
            run: npm test --workspaces --if-present
         - name: Build
            run: npm run build
```

10.7 Docker / Docker Compose (exemplo)
--------------------------------------
Um `docker-compose.yml` pode conter: backend (node), frontend (nginx) e postgres. Exemplo resumido:
```yaml
version: '3.8'
services:
   db:
      image: postgres:15
      environment:
         POSTGRES_DB: criptocert_db
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
      volumes:
         - db-data:/var/lib/postgresql/data
   backend:
      build: ./apps/backend
      environment:
         DATABASE_URL: postgres://postgres:postgres@db:5432/criptocert_db
      depends_on: [db]
   frontend:
      build: ./apps/frontend
      ports: ["5173:5173"]
volumes:
   db-data:
```

10.8 Migrations (Prisma)
-------------------------
- Criar migration: `npx prisma migrate dev --name init --schema=apps/backend/prisma/schema.prisma`
- Aplicar migrations: `npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma`

10.9 Deploy recomendado (exemplo)
---------------------------------
- Backend: buildar imagem Docker e deploy em container service (testes + health checks)
- Frontend: build estático e publicar em CDN / Vercel / Netlify

10.10 Contribution Guide (PR template)
--------------------------------------
- Regras rápidas:
   - Branch: `feature/<descrição>`, `fix/<descrição>`
   - Commit messages: use Conventional Commits (feat|fix|chore|docs)
   - Incluir descrição e testes manuais no PR

11. Checklist final antes de PR
--------------------------------
- [ ] Rodar `npm test` e `npm run lint`
- [ ] Verificar `npm run build` localmente
- [ ] Atualizar `CHANGELOG.md` (se aplicável)
- [ ] Validar variáveis `.env` e documentação

----
Se desejar que eu injete mais detalhes (por exemplo, gerar `COMPONENTS.md` com props extraídas automaticamente, ou criar o `ci.yml` em `.github/workflows`), diga qual dos itens prefere que eu gere agora e eu faço a alteração.


