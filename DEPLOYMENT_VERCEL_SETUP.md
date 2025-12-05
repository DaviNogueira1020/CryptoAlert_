# 🚀 Vercel Fullstack Deployment Guide

## ✅ Deployment Successful

Your CryptoAlert application has been deployed to Vercel as a Fullstack application:

**Production URL**: https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app

---

## 📋 Required Configuration Steps

### 1. Set Environment Variables in Vercel Dashboard

Go to: https://vercel.com/davis-projects-74145666/cripto-alert/settings/environment-variables

Add the following environment variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | production | `production` |
| `JWT_SECRET` | Your secret key (min 32 chars) | Generate: `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `CORS_ORIGIN` | Your frontend domain | `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app` |
| `VITE_API_URL` | Backend URL (same as production URL) | `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app` |

**⚠️ CRITICAL**: You MUST set `DATABASE_URL` pointing to a PostgreSQL database. Without it, the backend will fail.

### 2. Database Setup

You have two options:

#### Option A: Use Vercel Postgres (Recommended)
- Create a Vercel Postgres database at: https://vercel.com/docs/storage/vercel-postgres
- Vercel will automatically add the `POSTGRES_URL_*` variables
- Use that connection string as `DATABASE_URL`
- Run migrations: `npm run prisma:migrate:deploy` (setup as post-deployment script)

#### Option B: Use External PostgreSQL
- Set up PostgreSQL on Railway, Render, AWS RDS, or DigitalOcean
- Add the connection string to `DATABASE_URL` in Vercel dashboard
- Ensure the database is accessible from Vercel's IP ranges

### 3. Generate JWT_SECRET

```bash
# On your local machine or use an online generator
openssl rand -base64 32
# Example output: a9Bk/2xL+mNoPqR3StUvWxYz0AbCdEfGhIjKlMnOpQr=

# Copy this value to VERCEL_JWT_SECRET environment variable
```

### 4. Run Prisma Migrations

After setting `DATABASE_URL`, run migrations to create the database schema:

```bash
# Option 1: From command line
npx prisma migrate deploy

# Option 2: Add as Vercel post-deployment command
# Go to Settings > Build & Development Settings > Ignore Build Step
# Add this to your package.json scripts:
"vercel-build": "npm run build && npx prisma migrate deploy"
```

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL PLATFORM                         │
├──────────────────┬───────────────────┬──────────────────────┤
│   Frontend       │   Static Assets   │    Backend API        │
│  (React SPA)     │   (HTML/CSS/JS)   │  (Node.js/Express)    │
│  Next.js         │   Edge Network    │   Serverless Functions│
│  apps/frontend/  │   build/ folder   │   apps/backend/       │
└──────────────────┴───────────────────┴──────────────────────┘
         │
         │  Auto-built from:
         │  buildCommand: npm run build
         │  outputDirectory: apps/frontend/build
         │
         ↓
    ┌─────────────────┐
    │  GitHub (main)  │
    │  DaviNogueira   │
    │  1020/CryptoA   │
    │  lert_          │
    └─────────────────┘
```

### Build Process

1. **Build Command**: `npm run build` (builds both frontend + backend)
2. **Frontend**: Outputs to `apps/frontend/build/` (served as static SPA)
3. **Backend**: Compiled TypeScript served via serverless functions at `/`, `/auth`, `/alerts`, `/coins`, etc.
4. **Routes**: API routes configured in `vercel.json`

---

## 🔗 API Routes

All backend routes are exposed at the root level:

| Endpoint | Method | Protected | Purpose |
|----------|--------|-----------|---------|
| `/health` | GET | ❌ | Server health check |
| `/auth/register` | POST | ❌ | User registration |
| `/auth/login` | POST | ❌ | User login |
| `/auth/me` | GET | ✅ | Current user info |
| `/alerts` | GET/POST | ✅ | List/create alerts |
| `/alerts/:id` | GET/PUT/DELETE | ✅ | Alert operations |
| `/coins` | GET | ❌ | Cryptocurrency data |
| `/users` | GET/POST | ✅ | User management |
| `/notifications` | * | ✅ | Notifications |
| `/docs` | GET | ❌ | Swagger/OpenAPI docs |

### Frontend Configuration

The frontend is configured to hit the same domain:

```typescript
// apps/frontend/src/services/alertsService.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const api = axios.create({
  baseURL: `${API_URL}`,
});
```

**Important**: Set `VITE_API_URL` in Vercel to your production URL (e.g., `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app`)

---

## ✅ Post-Deployment Checklist

- [ ] Set `NODE_ENV=production` in Vercel env vars
- [ ] Generate and set `JWT_SECRET` (min 32 characters)
- [ ] Set `DATABASE_URL` pointing to PostgreSQL
- [ ] Set `CORS_ORIGIN` to your Vercel domain
- [ ] Set `VITE_API_URL` to your Vercel domain
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Test health endpoint: `curl https://your-domain/health`
- [ ] Test frontend loads in browser
- [ ] Test authentication (register/login)
- [ ] Test alert creation
- [ ] Monitor Vercel dashboard for errors

---

## 🐛 Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Vercel build logs for frontend errors

### API calls fail (401/403)
- Verify `JWT_SECRET` matches between frontend and backend
- Check tokens are being sent in Authorization header
- Review backend logs in Vercel dashboard

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel IPs
- Run `npx prisma db push` to ensure schema is current

### 502/503 errors
- Check backend server logs in Vercel
- Verify build completed successfully
- Check `apps/backend/dist/server.js` exists

---

## 📱 Project Links

- **Production**: https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app
- **GitHub**: https://github.com/DaviNogueira1020/CryptoAlert_
- **Vercel Dashboard**: https://vercel.com/davis-projects-74145666/cripto-alert
- **OpenAPI Docs**: https://your-domain/docs

---

## 🔄 Continuous Deployment

Every push to the `main` branch automatically triggers a new deployment on Vercel.

To deploy:
```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel will automatically:
1. Run `npm run build`
2. Deploy frontend to edge network
3. Deploy backend as serverless functions
4. Assign new URLs if needed

---

**Last Updated**: December 4, 2025
**Status**: ✅ DEPLOYED
**Version**: 1.0.0-fullstack
