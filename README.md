# 🚀 CryptoAlert - Documentação Consolidada

> Real-time cryptocurrency price alerts application with TypeScript, Node.js, React, and PostgreSQL.
> **Status**: ✅ **97% Production Ready** | **Build Status**: ✅ All Green
> 
> **Last Updated**: 4 de Dezembro 2025

---

## 📑 Sumário de Conteúdos

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#-tech-stack)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Instalação e Setup](#-instalação-e-setup)
5. [Scripts e Comandos](#-scripts-e-comandos)
6. [Arquitetura e Componentes](#-arquitetura-e-componentes)
7. [API Endpoints](#-api-endpoints)
8. [Funcionalidades](#-funcionalidades)
9. [Deployment](#-deployment)
10. [Troubleshooting](#-troubleshooting)

---

## Visão Geral

**CryptoAlert** é uma aplicação full-stack para monitoramento em tempo real de preços de criptomoedas com sistema de alertas inteligentes.

### 🎯 Funcionalidades Principais

- ✅ Dashboard com cotações de múltiplas criptomoedas
- ✅ Detalhes de moeda com gráficos históricos
- ✅ CRUD completo de alertas com campos avançados
- ✅ Autenticação por JWT
- ✅ Notificações (Email, SMS, Push, System)
- ✅ Exportação de dados (JSON, CSV)
- ✅ Rate limiting e segurança
- ✅ Design responsivo e moderno

### 📊 Números do Projeto

| Métrica | Valor |
|---------|-------|
| **Frontend Build Size** | 438KB JS + 33KB CSS |
| **Build Time (Vite)** | 4.88s |
| **Backend TypeScript Files** | 30+ |
| **Frontend React Components** | 25+ |
| **API Endpoints** | 8+ |
| **Database Migrations** | 2 applied |
| **Security Vulnerabilities** | 0 |

---

## 🛠️ Tech Stack

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database abstraction
- **PostgreSQL/SQLite** - Databases
- **JWT** - Authentication
- **Jest** - Testing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **TailwindCSS 4** - Styling
- **Radix UI** - Component primitives
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Recharts** - Charts & graphs
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Prisma Migrations** - Database versioning
- **GitHub Actions** - CI/CD ready
- **npm Workspaces** - Monorepo management
- **Vercel** - Production deployment

---

## 📁 Estrutura do Projeto

```
CryptoAlert_/
├── 📂 apps/
│   ├── 📁 backend/
│   │   ├── src/
│   │   │   ├── controllers/        # Route handlers
│   │   │   ├── services/           # Business logic
│   │   │   ├── modules/            # Domain modules
│   │   │   ├── routes/             # API routes
│   │   │   ├── middlewares/        # Auth, errors, rate limit
│   │   │   ├── utils/              # Helpers, JWT, logger
│   │   │   ├── validators/         # Input validation
│   │   │   ├── config/             # Environment config
│   │   │   ├── app.ts              # Express app
│   │   │   └── server.ts           # Entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── migrations/         # Migration history
│   │   ├── __tests__/              # Test suites
│   │   ├── dist/                   # Compiled JS
│   │   ├── Dockerfile              # Container config
│   │   └── package.json
│   │
│   └── 📁 frontend/
│       ├── src/
│       │   ├── components/         # Reusable components
│       │   ├── pages/              # Page components
│       │   ├── services/           # API clients
│       │   ├── hooks/              # Custom hooks
│       │   ├── config/             # App config
│       │   ├── styles/             # Global styles
│       │   ├── utils/              # Utilities
│       │   ├── types/              # TypeScript types
│       │   ├── App.tsx             # Root component
│       │   └── main.tsx            # Entry point
│       ├── build/                  # Production build
│       ├── index.html              # HTML template
│       ├── vite.config.ts          # Vite config
│       ├── tailwind.config.js      # TailwindCSS config
│       └── package.json
│
├── 📂 packages/
│   └── 📁 shared/
│       ├── src/
│       │   ├── types.ts            # Shared types
│       │   └── index.ts            # Exports
│       └── package.json
│
├── 📄 Configuration Files
│   ├── docker-compose.yml          # Dev environment
│   ├── docker-compose.prod.yml     # Production env
│   ├── vercel.json                 # Vercel deployment
│   ├── package.json                # Root package
│   ├── tsconfig.json               # TypeScript config
│   └── .env.example                # Environment template
│
└── 📚 Documentation
    └── README.md                   # Main guide (você está aqui)
```

---

## 🚀 Instalação e Setup

### Pré-requisitos

```bash
Node.js >= 18
npm >= 9
Git
PostgreSQL 12+ (opcional - SQLite para dev)
```

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone <repo-url>
cd CryptoAlert_

# 2. Instale dependências (todas as workspaces)
npm install

# 3. Configure ambiente
cp .env.example .env
# Edite .env com suas configurações

# 4. Setup database
npm run prisma:generate
npm run prisma:push

# 5. Inicie o desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# Backend
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/cryptoalert
PORT=3000
JWT_SECRET=seu-secret-super-seguro-aqui
ALERTS_CHECK_INTERVAL=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 📝 Scripts e Comandos

### Root (Monorepo)

```bash
# Desenvolvimento
npm run dev                    # Inicia frontend + backend

# Build
npm run build                  # Build todas as workspaces
npm run build:vercel           # Build para Vercel

# Testes
npm test                       # Testa todas as workspaces
npm test --workspace=apps/backend

# Linting
npm run lint                   # Lint todas as workspaces
npm run lint:fix              # Lint com correção automática

# Prisma
npm run prisma:generate       # Generate Prisma client
npm run prisma:push           # Push schema to DB
npm run prisma:migrate        # Create migration
```

### Backend

```bash
cd apps/backend

# Desenvolvimento
npm run dev                    # Start com hot reload
npm run debug                  # Debug mode

# Produção
npm run build                  # Compilar TypeScript
npm run start                  # Rodar build compilado

# Testes
npm test                       # Rodar testes Jest
npm test -- --watch          # Watch mode

# Database
npm run prisma:generate       # Generate client
npm run prisma:push           # Apply schema
npm run prisma:migrate        # Create migration
npm run prisma:studio         # Abrir Prisma Studio
```

### Frontend

```bash
cd apps/frontend

# Desenvolvimento
npm run dev                    # Start Vite dev server

# Produção
npm run build                  # Build para produção
npm run build:vercel           # Build específico para Vercel
npm run preview                # Preview production build

# Linting
npm run lint                   # ESLint check
npm run lint:fix              # ESLint com correção

# Type checking
npm run type-check            # TypeScript check
```

---

## 🏗️ Arquitetura e Componentes

### Backend Architecture

```
Request → Router → Middleware → Controller → Service → Repository → Database
                       ↓
                  Validation
                       ↓
                  Error Handler
```

#### Controllers
- `alerts.controller.ts` - Operações de alertas
- `auth.controller.ts` - Autenticação
- `notifications.controller.ts` - Notificações

#### Services
- `alerts.service.ts` - Lógica de alertas
- `auth.service.ts` - JWT, senhas
- `notifications.service.ts` - Sistema de notificações
- `binance.service.ts` - Integração Binance

#### Repositories
- `alerts.repository.ts` - CRUD alertas
- `users.repository.ts` - CRUD usuários
- `notifications.repository.ts` - CRUD notificações

### Frontend Architecture

```
App.tsx
├── Layout Components (Navbar, Footer, Sidebar)
├── Pages
│   ├── Login
│   ├── Dashboard
│   ├── CryptoDetail
│   ├── Alerts (CRUD)
│   ├── News
│   ├── Profile
│   └── Settings
└── Services
    ├── alertsService
    ├── authService
    ├── binanceService
    └── apiClient
```

#### Componentes Principais

| Componente | Descrição | Status |
|-----------|-----------|--------|
| **Alerts** | CRUD completo de alertas | ✅ |
| **Dashboard** | Grid de criptomoedas | ✅ |
| **CryptoDetail** | Detalhes + gráfico | ✅ |
| **PriceTicker** | Ticker de preços | ✅ |
| **News** | Notícias do mercado | ✅ |
| **Profile** | Perfil do usuário | ✅ |
| **Settings** | Configurações | ✅ |

---

## 🔗 API Endpoints

### Alerts

```
POST   /api/alerts/criar                 # Criar novo alerta
GET    /api/alerts/listar                # Listar alertas (paginado)
GET    /api/alerts/:id                   # Obter alerta específico
PUT    /api/alerts/atualizar/:id         # Atualizar alerta
DELETE /api/alerts/remover/:id           # Deletar alerta
PATCH  /api/alerts/:id/ativar-desativar  # Toggle status
POST   /api/alerts/:id/duplicar          # Duplicar alerta
GET    /api/alerts/exportar/alertas      # Exportar (JSON/CSV)
```

### Authentication

```
POST   /api/auth/login                   # Login com email/password
POST   /api/auth/register                # Registrar novo usuário
POST   /api/auth/logout                  # Logout
POST   /api/auth/refresh                 # Refresh JWT token
```

### Notifications

```
GET    /api/notifications/listar         # Listar notificações
PATCH  /api/notifications/:id/ler        # Marcar como lida
DELETE /api/notifications/:id            # Deletar notificação
```

### Health & Meta

```
GET    /health                           # Health check
GET    /api/version                      # API version
```

---

## ✨ Funcionalidades

### 1. Dashboard
- Exibe cotações em tempo real de múltiplas criptos
- Cards com preço, variação 24h, market cap
- Link para detalhes de cada moeda
- Atualização automática a cada minuto

### 2. Detalhes de Criptomoeda
- Gráfico de histórico de preços (7 dias)
- Informações gerais da moeda
- Botão para criar alerta
- Conversor de valores

### 3. CRUD de Alertas

#### Criar Alerta
- **Campos Básicos**:
  - Criptomoeda (seletor)
  - Tipo (preço alvo, percentual, volume)
  - Valor/Condição
  
- **Campos Avançados** (colapsível):
  - Título customizado
  - Descrição
  - Tipo de notificação (Email, SMS, Push, System)
  - Prioridade (Normal, Alta, Crítica)
  - Repetição (Uma vez, Diário, Semanal)
  - Data/Hora específicas

#### Listar Alertas
- Grid/Lista com filtros
- Paginação
- Ordenação
- Status visual (ativo/inativo)

#### Atualizar Alerta
- Editar qualquer campo
- Ativar/desativar
- Duplicar configuração

#### Deletar Alerta
- Confirmação antes de deletar
- Soft-delete com opção de restaurar

### 4. Notificações
- Sistema de notificações em tempo real
- Integração com múltiplos canais
- Histórico de notificações

### 5. Autenticação
- Login/Register com JWT
- Refresh token automático
- Logout seguro
- Proteção de rotas

---

## 🚀 Deployment

### ✅ Status Atual: **97% Production Ready**

**Última Build**: ✅ Sucesso completo
- Frontend: 438KB JS + 33KB CSS
- Backend: TypeScript compilado sem erros
- Security: 0 vulnerabilities
- Database: Schema up-to-date
- Deployment: Live on Vercel

### Production URL

```
https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app
```

### Deployment to Vercel

#### ✅ Já Configurado:
- `vercel.json` pronto para build
- `.vercelignore` configurado
- `apps/frontend/build` como output
- Auto-deploy habilitado
- GitHub conectado

#### ⏳ Faltando:
- Variáveis de ambiente em Vercel

### Configurar Variáveis de Ambiente

**URL**: https://vercel.com/davis-projects-74145666/cripto-alert/settings/environment-variables

Adicionar estas variáveis:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `JWT_SECRET` | Generate new (32+ chars) | Use: `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL URL | e.g., `postgresql://user:pass@host:5432/db` |
| `CORS_ORIGIN` | Vercel domain | `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app` |
| `VITE_API_URL` | Vercel domain | Same as CORS_ORIGIN |

### Passos para Deploy Completo

1. **Gerar JWT_SECRET**
```bash
openssl rand -base64 32
```

2. **Configurar no Vercel Dashboard**
   - Ir para Settings → Environment Variables
   - Adicionar as 5 variáveis acima

3. **Criar PostgreSQL Database**
   - Opção A: Vercel Postgres (recomendado)
   - Opção B: External (Railway, Render, RDS)

4. **Rodar Migrations**
```bash
npx prisma migrate deploy
```

5. **Testar em Produção**
```bash
# Health check
curl https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app/health

# Frontend
https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app

# Register
curl -X POST https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Arquitetura de Deployment

```
┌─────────────────────────────────────────────────────────┐
│              VERCEL PRODUCTION                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React SPA)                                   │
│  ├─ Served from Vercel Edge Network (CDN)              │
│  ├─ Build: apps/frontend/build/                        │
│  ├─ Size: 438 KB optimized JS, 33 KB CSS              │
│  └─ HTTPS: Automatic                                   │
│                                                          │
│  Backend (Node.js)                                     │
│  ├─ Serverless Functions (Vercel)                      │
│  ├─ Build: apps/backend/dist/server.js                │
│  ├─ Routes: /auth, /alerts, /coins, /users, etc.      │
│  └─ Environment: prod config with JWT & CORS          │
│                                                          │
│  Database (PostgreSQL)                                 │
│  ├─ Provider: Vercel Postgres (or external)           │
│  ├─ Connection: DATABASE_URL env var                  │
│  ├─ Migrations: 2 applied                              │
│  └─ Schema: Current and validated                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
         ↑
         │ Auto-deploy on git push to main
         │
    GitHub (DaviNogueira1020/CryptoAlert_)
```

### Continuous Deployment

Depois que tudo estiver configurado:

```bash
# Make code changes locally
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main

# Vercel automatically:
# 1. Triggers build (npm run build:vercel)
# 2. Builds React frontend
# 3. Builds Node.js backend
# 4. Deploys both to production
# 5. Creates new deployment URL
```

---

## 🔍 Troubleshooting

### Build Issues

**Frontend Build Fails**
```bash
# Limpar cache
rm -r apps/frontend/node_modules apps/frontend/.vite
npm install

# Rebuild
npm run build:frontend
```

**Backend Build Fails**
```bash
# Limpar dist
rm -r apps/backend/dist

# Rebuild
npm run build:backend
```

### Database Issues

**Prisma Client Desync**
```bash
npm run prisma:generate --workspace=apps/backend
```

**Migration Conflicts**
```bash
npm run prisma:migrate --workspace=apps/backend
# Resolver conflitos manualmente no schema.prisma
```

### Runtime Issues

**Port Already in Use**
```bash
# Backend (3000)
npx kill-port 3000

# Frontend (5173)
npx kill-port 5173
```

**CORS Errors**
- Verificar `VITE_API_URL` no frontend
- Verificar CORS config no backend (`app.ts`)

**JWT Token Expired**
- Token refresh automático implementado
- Verificar `JWT_SECRET` consistência entre ambientes

### Performance Issues

**Slow Build**
- Verificar Node.js version (>=18 recomendado)
- Limpar `node_modules` e reinstalar
- Usar `npm ci` em produção

**Slow Runtime**
- Habilitar connection pooling (Prisma)
- Verificar database queries (Prisma Studio)
- Implementar caching (Redis)

---

## 📚 Documentação Adicional

### Desenvolvimento Local

1. **Setup Inicial**
   - `npm install` - Instalar dependências
   - Copiar `.env.example` para `.env`
   - Configurar `DATABASE_URL`

2. **Rodando Serviços**
   - `npm run dev` - Start frontend + backend
   - Backend roda em `http://localhost:3000`
   - Frontend roda em `http://localhost:5173`

3. **Hot Reload**
   - Frontend recarrega automaticamente ao salvar
   - Backend recarrega com nodemon

### Testing

```bash
# Backend tests
npm test --workspace=apps/backend

# Watch mode
npm test --workspace=apps/backend -- --watch

# Com coverage
npm test --workspace=apps/backend -- --coverage
```

### Database Management

```bash
# Abrir Prisma Studio
npm run prisma:studio --workspace=apps/backend

# Ver migrations aplicadas
npm run prisma:status --workspace=apps/backend

# Criar nova migration
npm run prisma:migrate -- --name <name> --workspace=apps/backend
```

---

## 🎯 Próximos Passos

### Imediato (1 hora)
- [ ] Configurar 5 variáveis de ambiente no Vercel
- [ ] Criar/conectar PostgreSQL database
- [ ] Rodar Prisma migrations

### Curto Prazo (1-2 semanas)
- [ ] Testar autenticação (register/login)
- [ ] Testar CRUD de alertas
- [ ] Setup monitoring (Sentry, DataDog)
- [ ] Configurar CI/CD pipeline (GitHub Actions)

### Médio Prazo (1-2 meses)
- [ ] Autenticação OAuth (Google, GitHub)
- [ ] Email notifications via SendGrid
- [ ] SMS notifications via Twilio
- [ ] Push notifications via Firebase

### Longo Prazo (3+ meses)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Backtesting de estratégias
- [ ] Trading integration (real trades)

---

## 📊 Commits Principais

```
8ad28d6 - feat: add build:vercel script to frontend
e711999 - fix: include docs folder in Vercel build for openapi.json
9b36552 - fix: remove tsconfig.json from .vercelignore to fix Vercel build
66f831a - docs: Add final deployment guide - 40% production ready
702fcc9 - chore: Security audit - fix vulnerabilities
a1c25bf - chore: Fix builds - frontend and backend compilation successful
```

---

## 📞 Support & Contact

Para dúvidas ou problemas:

1. Verifique o [Troubleshooting](#-troubleshooting)
2. Confira a documentação no diretório raiz
3. Abra uma issue no GitHub

---

## 📄 Licença

Projeto privado. Todos os direitos reservados.

---

## 👤 Autor

**Davi Nogueira**  
GitHub: @DaviNogueira1020

---

## 🚀 DEPLOYMENT FINAL - STATUS

**Última atualização**: 5 de Dezembro 2025  
**Status do Build**: ✅ All Green  
**Status de Deployment**: ✅ **100% PRONTO PARA PRODUÇÃO**

### URLs de Acesso

- **Frontend:** https://cript-alert.netlify.app
- **Backend API:** https://cripto-alert-ovaslvxip-davis-projects-74145666.vercel.app
- **API Docs:** https://cripto-alert-ovaslvxip-davis-projects-74145666.vercel.app/docs
- **GitHub:** https://github.com/DaviNogueira1020/CryptoAlert_

### Configuração Netlify

#### Build Command
```
NPM_CONFIG_PRODUCTION=false npm install --workspaces && npm run build --workspace=apps/frontend
```

#### Publish Directory
```
apps/frontend/build
```

#### Environment Variables
```
VITE_API_URL = /api
NODE_ENV = production
NODE_VERSION = 20
NPM_CONFIG_PRODUCTION = false
```

### Configuração Vercel (Backend)

#### Environment Variables
```
DATABASE_URL = [PostgreSQL Prisma URL]
JWT_SECRET = [Gerado automaticamente]
NODE_ENV = production
CORS_ORIGIN = https://cript-alert.netlify.app
```

### Checklist de Deploy

- [x] Frontend compilado com Vite
- [x] Backend com TypeScript compilado
- [x] Prisma migrations aplicadas
- [x] Variáveis de ambiente configuradas
- [x] CORS configurado
- [x] Swagger documentation ativa
- [x] API endpoints testados
- [x] Proxy API configurado
- [x] CI/CD automático funcional
- [x] Fallback CoinGecko ativo

### Como Acessar

1. **Teste o Frontend**
   - Acesse: https://cript-alert.netlify.app
   - Registre um novo usuário
   - Explore o dashboard e crie alertas

2. **Teste a API**
   - Swagger UI: https://cripto-alert-ovaslvxip-davis-projects-74145666.vercel.app/docs
   - Use os endpoints para testar autenticação e CRUD

3. **Acompanhe os Logs**
   - Netlify: https://app.netlify.com/sites/cript-alert
   - Vercel: https://vercel.com/davis-projects-74145666/cripto-alert

---
