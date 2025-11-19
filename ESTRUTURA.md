# Guia de Início Rápido - CriptoAlert

## 📋 Resumo das Mudanças

A estrutura do projeto foi completamente reorganizada seguindo as melhores práticas:

### ✅ Problemas Corrigidos:

1. **Estrutura de Pastas Padronizada**
   - ❌ ANTES: `CriptoAlert_` com `CriptAlert_` dentro
   - ✅ AGORA: Estrutura monorepo clara com `apps/backend`, `apps/frontend`, `packages/shared`

2. **Nomes de Arquivo Corrigidos**
   - ❌ ANTES: `alerts.repository..ts` (com dois pontos!)
   - ✅ AGORA: `alerts.repository.ts`

3. **Prisma Schema Consolidado**
   - ❌ ANTES: Dois schemas diferentes (raiz e Backend)
   - ✅ AGORA: Um único schema em `apps/backend/prisma/schema.prisma`

4. **Package.json Organizado**
   - ❌ ANTES: Dependências misturadas (Backend + Frontend + Prisma)
   - ✅ AGORA: Cada workspace tem suas próprias dependências

5. **TypeScript Configuração Corrigida**
   - ❌ ANTES: `tsconfig.json` incompleto
   - ✅ AGORA: Configurações corretas para Backend e Frontend

6. **Workspaces npm Configurados**
   - ✅ AGORA: Gerenciamento de múltiplos projetos com npm workspaces

## 🏗️ Nova Estrutura

```
CriptoAlert/
├── apps/
│   ├── backend/              # API Node.js + Express
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── types/
│   │   │   ├── lib/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/             # React + Vite
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── hooks/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       ├── public/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   └── shared/               # Tipos compartilhados
│       ├── src/
│       │   ├── types.ts
│       │   └── index.ts
│       └── package.json
│
├── .env                      # Variáveis de ambiente (base)
├── .env.example             # Template de .env
├── .gitignore               # Padrão correto
├── package.json             # Root com workspaces
├── tsconfig.json            # Configuração base
└── README.md
```

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
# Na raiz do projeto
npm install

# Isso instala dependências de todos os workspaces automaticamente
```

### 2. Configurar Banco de Dados

```bash
# Editar .env com suas credenciais PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/criptocert_db"

# Gerar Prisma Client
npm run prisma:generate

# Fazer push do schema para o banco
npm run prisma:push

# (Opcional) Abrir Prisma Studio
npm run prisma:studio --workspace=apps/backend
```

### 3. Iniciar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
npm run dev --workspace=apps/backend
# Servidor rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
npm run dev --workspace=apps/frontend
# Aplicação rodando em http://localhost:5173
```

Ou em um único comando (PowerShell):
```powershell
npm run dev
```

### 4. Build para Produção

```bash
npm run build
```

Isso compila:
- Backend (TypeScript → JavaScript)
- Frontend (Vite build otimizado)

## 📝 Scripts Disponíveis

### Root Level
```bash
npm run dev              # Inicia Backend e Frontend em paralelo
npm run build            # Build de todos os workspaces
npm run lint             # Lint de todos os workspaces
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Cria migration e aplica
npm run prisma:push      # Sincroniza schema com banco
```

### Backend Específico
```bash
npm run dev --workspace=apps/backend
npm run build --workspace=apps/backend
npm run start --workspace=apps/backend
npm run prisma:studio --workspace=apps/backend
```

### Frontend Específico
```bash
npm run dev --workspace=apps/frontend
npm run build --workspace=apps/frontend
npm run preview --workspace=apps/frontend
npm run lint --workspace=apps/frontend
```

## 🔄 API Endpoints

### Alerts
- `GET /api/alerts` - Listar todos os alertas
- `GET /api/alerts/:id` - Obter alerta por ID
- `POST /api/alerts` - Criar novo alerta
- `PUT /api/alerts/:id` - Atualizar alerta
- `DELETE /api/alerts/:id` - Deletar alerta

### Exemplo de Requisição

```bash
# Criar alerta
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "crypto": "BTC",
    "targetPrice": 50000,
    "direction": "above"
  }'
```

## 🗄️ Schema Prisma

O schema foi consolidado em `apps/backend/prisma/schema.prisma` com as seguintes models:

- **User**: Usuário do sistema
- **Alert**: Alertas de preço de criptomoedas

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  alerts Alert[]
}

model Alert {
  id          String   @id @default(uuid())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  crypto      String
  targetPrice Float
  direction   String   // "above" ou "below"
  isActive    Boolean  @default(true)
}
```

## 🧹 Arquivos Antigos

Os seguintes arquivos/pastas podem ser deletados (eram duplicados/inúteis):
- `Backend/` (antiga pasta)
- `CriptAlert_/` (antiga pasta)
- `prisma/` (raiz com schema vazio)
- `prisma.config.ts` (arquivo não padrão)

## 🔧 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Erro de conexão com banco de dados
1. Verificar se PostgreSQL está rodando
2. Verificar credenciais em `.env`
3. Criar banco de dados se não existir:
```sql
CREATE DATABASE criptocert_db;
```

### Porta 3000 já em uso
```bash
# Alterar em .env
PORT=3001
```

## 📚 Tecnologias

- **Backend**: Express 5, TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: React 19, Vite, TailwindCSS, Radix UI
- **Build**: npm workspaces
- **Dev Tools**: ts-node-dev, ESLint, Prettier

## 🎯 Próximos Passos Sugeridos

1. Adicionar autenticação (JWT)
2. Implementar validação com Zod/Yup
3. Adicionar testes (Jest, Vitest)
4. Configurar CI/CD
5. Adicionar logging estruturado
6. Implementar cache (Redis)

---

**Projeto reorganizado com sucesso! ✨**
