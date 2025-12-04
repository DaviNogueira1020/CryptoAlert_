#!/bin/bash
# Setup script para CryptoAlert
# Usage: bash setup.sh

set -e  # Exit on error

echo "🚀 CryptoAlert Setup Script"
echo "============================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

# Check npm
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
echo "   Backend..."
cd apps/backend
npm install
cd ../..

echo "   Frontend..."
cd apps/frontend
npm install
cd ../..
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Setup .env files
echo "⚙️  Setting up environment variables..."

if [ ! -f "apps/backend/.env" ]; then
    echo "   Creating apps/backend/.env..."
    cp apps/backend/.env.example apps/backend/.env
    echo -e "${YELLOW}⚠️  Edit apps/backend/.env with your configuration${NC}"
else
    echo -e "${GREEN}✓ apps/backend/.env already exists${NC}"
fi

if [ ! -f "apps/frontend/.env.local" ]; then
    echo "   Creating apps/frontend/.env.local..."
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo -e "${YELLOW}⚠️  Edit apps/frontend/.env.local if needed${NC}"
else
    echo -e "${GREEN}✓ apps/frontend/.env.local already exists${NC}"
fi
echo ""

# Database setup
echo "🗄️  Setting up database..."
cd apps/backend

if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found${NC}"
    exit 1
fi

echo "   Running Prisma migrations..."
npx prisma migrate dev --name init || true
npx prisma generate

echo -e "${GREEN}✓ Database ready${NC}"
cd ../..
echo ""

# Generate JWT Secret
echo "🔐 Generating JWT_SECRET..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${YELLOW}Generated JWT_SECRET: $JWT_SECRET${NC}"
echo -e "${YELLOW}Add this to apps/backend/.env as JWT_SECRET=${NC}"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Edit apps/backend/.env with your configuration"
echo "2. Edit apps/frontend/.env.local if needed"
echo "3. Add JWT_SECRET to apps/backend/.env: $JWT_SECRET"
echo ""
echo "🚀 Start development:"
echo "   Terminal 1 (Backend):  cd apps/backend && npm run dev"
echo "   Terminal 2 (Frontend): cd apps/frontend && npm run dev"
echo ""
echo "📚 See DEPLOYMENT.md for production setup"
echo ""
