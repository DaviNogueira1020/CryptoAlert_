# CriptoAlert 🚀

Real-time cryptocurrency price alerts application with TypeScript, Node.js, React, and PostgreSQL.

## 📁 Project Structure

```
CriptoAlert/
├── apps/
│   ├── backend/      # Node.js + Express API
│   └── frontend/     # React + Vite SPA
├── packages/
│   └── shared/       # Shared types and utilities
└── ...config files
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Radix UI
- **Database**: PostgreSQL with Prisma migrations
- **Package Manager**: npm workspaces

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+
- PostgreSQL 12+

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd CriptoAlert
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your database URL
```

4. Setup database
```bash
npm run prisma:generate
npm run prisma:push
```

5. Start development servers
```bash
npm run dev
```

The backend will run on `http://localhost:3000` and frontend on `http://localhost:5173`

## 📝 Scripts

### Root Level
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database

### Backend
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production build

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔄 API Endpoints

### Alerts
- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create new alert
- `GET /api/alerts/:id` - Get alert by ID
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

## 📦 Environment Variables

See `.env.example` for all available variables.

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

ISC
