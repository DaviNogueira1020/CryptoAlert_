# CryptoAlert 🚀

Real-time cryptocurrency price alerts application with TypeScript, Node.js, React, and PostgreSQL.

## 📁 Project Structure

```
CryptoAlert/
├── apps/
│   ├── backend/      # Node.js + Express API
│   └── frontend/     # React + Vite SPA
├── packages/
│   └── shared/       # Shared types and utilities
└── ...config files
```

## 🛠️ Tech Stack

**Backend:**
- Node.js 20+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (production) / SQLite (development)
- JWT Authentication

**Frontend:**
- React 18+
- TypeScript
- Vite
- TailwindCSS v4
- Framer Motion
- Lucide React Icons
- Axios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation & Setup

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**macOS/Linux (Bash):**
```bash
bash setup.sh
```

**Manual Setup:**
```bash
# 1. Install dependencies
cd apps/backend && npm install && cd ../..
cd apps/frontend && npm install && cd ../..

# 2. Configure environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# 3. Setup database
cd apps/backend
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# 4. Start development
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2
cd apps/frontend && npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: See API_DOCUMENTATION.md

## 📝 Available Scripts

### Backend (apps/backend/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run test         # Run tests
npm run lint         # Run linter
```

### Frontend (apps/frontend/)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoints reference
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment guide
- **[Database Schema](./apps/backend/prisma/schema.prisma)** - Prisma schema

## 🔐 Authentication

All endpoints (except `/auth/*`) require JWT authentication:

```
Authorization: Bearer <token>
```

### Auth Endpoints
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and get token
- `GET /auth/verify` - Verify token

## 📊 Core Features

### Alerts
- ✅ Price target alerts
- ✅ Percentage change alerts
- ✅ Volume alerts
- ✅ Alert favorites
- ✅ Multiple notifications
- ✅ Alert scheduling
- ✅ Alert history

### Notifications
- ✅ Real-time alerts
- ✅ Notification center
- ✅ Mark as read
- ✅ Delete notifications

### User Management
- ✅ Registration
- ✅ Login with JWT
- ✅ Profile management
- ✅ Secure password

## 🔄 API Overview

### Main Endpoints

**Alerts:**
- `GET /alerts` - List user's alerts
- `POST /alerts` - Create new alert
- `GET /alerts/:id` - Get alert details
- `PUT /alerts/:id` - Update alert
- `DELETE /alerts/:id` - Delete alert

**Notifications:**
- `GET /notifications` - List notifications
- `PATCH /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

**Health:**
- `GET /health` - Service status
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## 🗄️ Database

### Schema
- `User` - User accounts
- `Alert` - Cryptocurrency price alerts
- `Notification` - Alert notifications

### Enums
- `AlertTipo` - Alert types
- `AlertDirection` - Price direction (above, below)
- `AlertPriority` - Alert priority levels

## 🚀 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment guide.

### Supported Platforms
- Railway.app (recommended)
- Heroku
- Vercel (frontend)
- AWS, DigitalOcean (Docker)

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm run test

# Test alerts
node test-binance-alerts.js
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd apps/backend
npx prisma db push
npx prisma generate
npm install
```

### Frontend can't connect to API
```bash
# Check VITE_API_URL
echo $VITE_API_URL

# Backend running?
curl http://localhost:3000/health
```

## 📦 Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
ALERTS_CHECK_INTERVAL=60000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Open Pull Request

## 📄 License

ISC

## 📞 Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Create a GitHub issue

---

**Status:** ✅ Production Ready
