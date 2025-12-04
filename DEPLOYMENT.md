# 🚀 Guia de Deployment - CryptoAlert

## Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Setup Local](#setup-local)
3. [Preparação para Produção](#preparação-para-produção)
4. [Deployment Backend](#deployment-backend)
5. [Deployment Frontend](#deployment-frontend)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Monitoramento](#monitoramento)
8. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Sistema
- Node.js 18+ 
- npm ou yarn
- Git
- PostgreSQL (production) ou SQLite (development)
- Docker (opcional, para containerização)

### Contas/Serviços
- Conta em plataforma de hosting (Vercel, Railway, Heroku, etc)
- Banco de dados PostgreSQL (produçã)
- (Opcional) SendGrid ou similar para emails
- (Opcional) Twilio para SMS

---

## Setup Local

### 1. Clonar repositório
```bash
git clone https://github.com/DaviNogueira1020/CryptoAlert_.git
cd CryptoAlert_
```

### 2. Instalar dependências
```bash
# Backend
cd apps/backend
npm install

# Frontend
cd ../frontend
npm install

# Volta para raiz
cd ../..
```

### 3. Configurar variáveis de ambiente

**Backend:**
```bash
cd apps/backend
cp .env.example .env
# Edite .env com suas configurações locais
```

**.env local do backend (exemplo):**
```
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=dev-secret-key-change-in-production
ALERTS_CHECK_INTERVAL=60000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env.local
# Edite .env.local
```

**.env.local local do frontend (exemplo):**
```
VITE_API_URL=http://localhost:3000
```

### 4. Setup do banco de dados

**Backend:**
```bash
cd apps/backend

# Criar e rodar migrations
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# (Opcional) Seed de dados de teste
npx prisma db seed
```

### 5. Iniciar em desenvolvimento

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
# API rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
# App rodando em http://localhost:5173
```

---

## Preparação para Produção

### 1. Build do Backend
```bash
cd apps/backend

# Limpar build anterior
rm -rf dist

# Build TypeScript
npm run build

# Verificar tamanho do bundle
du -sh dist/
```

### 2. Build do Frontend
```bash
cd apps/frontend

# Build Vite
npm run build

# Verificar tamanho
du -sh dist/

# (Opcional) Preview de produção
npm run preview
```

### 3. Testes
```bash
# Backend
cd apps/backend
npm run test

# Frontend
cd apps/frontend
npm run test  # Se houver testes
```

### 4. Lint & Type Check
```bash
# Backend
cd apps/backend
npm run lint
npx tsc --noEmit

# Frontend
cd apps/frontend
npm run lint
```

---

## Deployment Backend

### Opção 1: Railway.app (Recomendado para iniciantes)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Add PostgreSQL plugin
# - Go to dashboard, add PostgreSQL
# - Railway criará DATABASE_URL automaticamente

# 5. Deploy
railway up

# 6. Set environment variables
railway service add env
# Adicione: JWT_SECRET, NODE_ENV=production, etc

# 7. View logs
railway logs -f
```

### Opção 2: Heroku

```bash
# 1. Instalar CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Criar app
heroku create cryptoalert-api

# 4. Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Setar variáveis
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
heroku config:set ALERTS_CHECK_INTERVAL=60000

# 6. Deploy
git push heroku main

# 7. Ver logs
heroku logs --tail
```

### Opção 3: Docker + VPS (AWS, DigitalOcean, etc)

```bash
# 1. Build image
docker build -t cryptoalert-api .

# 2. Run container
docker run \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@db:5432/cryptoalert" \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  cryptoalert-api

# 3. (Opcional) Push to Docker Hub
docker tag cryptoalert-api yourusername/cryptoalert-api:latest
docker push yourusername/cryptoalert-api:latest
```

**Dockerfile produção:**
```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies (production only)
RUN npm ci --only=production

# Copy source
COPY . .

# Copy Prisma files
COPY apps/backend/prisma ./apps/backend/prisma

# Generate Prisma Client
RUN npx prisma generate --schema=./apps/backend/prisma/schema.prisma

# Build
RUN npm run build

# Expose
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/server.js"]
```

---

## Deployment Frontend

### Opção 1: Vercel (Recomendado)

```bash
# 1. Instalar CLI
npm install -g vercel

# 2. Deploy
cd apps/frontend
vercel

# 3. Set environment variables no dashboard
# VITE_API_URL=https://cryptoalert-api.railway.app

# 4. Redeploy
vercel --prod
```

### Opção 2: Netlify

```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Connect com Git (recomendado)
cd apps/frontend
netlify init

# 3. Set build settings:
# Build command: npm run build
# Publish directory: dist
# Environment variables:
#   VITE_API_URL=https://your-api.com

# 4. Deploy
netlify deploy --prod
```

### Opção 3: GitHub Pages + GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'apps/frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd apps/frontend && npm ci
      
      - name: Build
        run: cd apps/frontend && npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./apps/frontend/dist
```

---

## Variáveis de Ambiente

### Backend (Produção)
```env
# Server
PORT=3000
NODE_ENV=production

# Database - IMPORTANTE: Use PostgreSQL em produção
DATABASE_URL=postgresql://user:password@host:5432/cryptoalert?schema=public

# JWT - Gere um secret forte!
# Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=sua-chave-super-secreta-aleatoria-de-32-caracteres

# Alerts
ALERTS_CHECK_INTERVAL=60000

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# JWT Expiração
JWT_EXPIRES_IN=7d
```

**Como gerar JWT_SECRET forte:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copie a saída e use como JWT_SECRET
```

### Frontend (Produção)
```env
# API URL da sua instância backend
VITE_API_URL=https://api.seu-dominio.com
```

---

## Monitoramento

### Backend

**Health Checks:**
```bash
# Verificar se servidor está rodando
curl https://api.seu-dominio.com/health

# Verificar readiness (BD conectado)
curl https://api.seu-dominio.com/health/ready

# Verificar liveness
curl https://api.seu-dominio.com/health/live
```

**Logs:**
- Railway: `railway logs -f`
- Heroku: `heroku logs --tail`
- Docker: `docker logs -f container-id`

**Banco de Dados:**
```bash
# Conectar ao PostgreSQL produção
psql postgresql://user:password@host:5432/cryptoalert

# Ver alerts
SELECT * FROM "Alert" LIMIT 10;

# Ver notificações
SELECT * FROM "Notification" LIMIT 10;
```

### Frontend
- Vercel Analytics: Dashboard em vercel.com
- Sentry (opcional): Configure em .env.example
- Google Analytics (opcional): Adicione script em index.html

---

## Troubleshooting

### Backend não conecta ao banco
```bash
# Verificar CONNECTION
curl https://api.seu-dominio.com/health/ready

# Verificar logs
heroku logs --tail

# Verificar DATABASE_URL
heroku config:get DATABASE_URL
```

### Frontend não carrega API
```bash
# Verificar VITE_API_URL
echo $VITE_API_URL

# Verificar CORS no backend
# Backend deve ter Access-Control-Allow-Origin configurado

# Testar API manualmente
curl https://api.seu-dominio.com/alerts
```

### Erro 401 Unauthorized
- JWT_SECRET não corresponde entre backend e requisição
- Token expirou (JWT_EXPIRES_IN)
- Token não sendo enviado no header `Authorization: Bearer token`

### Database locked (SQLite)
- Use PostgreSQL em produção
- SQLite é apenas para desenvolvimento

### Alerts não estão sendo verificados
- Verificar se job está rodando: `curl https://api.seu-dominio.com/health`
- Verificar ALERTS_CHECK_INTERVAL (em ms, padrão 60000 = 1 minuto)
- Ver logs do job

---

## Checklista de Deploy

- [ ] Build backend sem erros: `npm run build`
- [ ] Build frontend sem erros: `npm run build`
- [ ] Testes passando: `npm test`
- [ ] `.env` preenchido corretamente (não commitar!)
- [ ] Migrations do banco rodam: `npx prisma migrate deploy`
- [ ] JWT_SECRET forte gerado
- [ ] DATABASE_URL é PostgreSQL em produção
- [ ] VITE_API_URL apontando para backend correto
- [ ] Healthchecks respondendo
- [ ] CORS configurado corretamente
- [ ] Rate limiting configurado
- [ ] Logs configurados
- [ ] Backups do banco configurados
- [ ] Monitoramento ativo

---

## Suporte

Para problemas, criar issue no GitHub com:
- Logs completos
- Versão do Node
- Plataforma de deploy
- Passos para reproduzir
