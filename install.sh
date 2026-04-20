#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Classicmodels Project Setup${NC}\n"

# Check Node.js
echo -e "${YELLOW}[1/4] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}\n"

# Check npm
echo -e "${YELLOW}[2/4] Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm $NPM_VERSION found${NC}\n"

# Install backend dependencies
echo -e "${YELLOW}[3/4] Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}\n"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Instructions
echo -e "${GREEN}✅ Setup completed!${NC}\n"

echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Configure database settings in backend/.env"
echo "2. Start the backend server:"
echo -e "   ${GREEN}cd backend && npm run dev${NC}"
echo "3. Open frontend in your browser:"
echo -e "   ${GREEN}Open frontend/index.html with Live Server${NC}"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "- Quick Start: QUICK_START.md"
echo "- Full Guide: README.md"
echo "- API Docs: API_DOCS.md"
echo ""
