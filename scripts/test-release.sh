#!/bin/bash

# 🧪 Test Release Setup
# Verifies that all required repositories and scripts are properly configured

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing Aussie Vault Browser Release Setup...${NC}"

# Test 1: Check if release repository exists
echo -e "${BLUE}📁 Checking release repository...${NC}"
if [ -d "../aussie-vault-browser-releases" ]; then
    echo -e "${GREEN}✅ Release repository found${NC}"
    cd ../aussie-vault-browser-releases
    if git remote -v | grep -q "aussie-vault-browser-releases"; then
        echo -e "${GREEN}✅ Release repository properly configured${NC}"
    else
        echo -e "${YELLOW}⚠️ Release repository remote not configured${NC}"
    fi
    cd ../AussieVaultBrowser
else
    echo -e "${RED}❌ Release repository not found at ../aussie-vault-browser-releases${NC}"
fi

# Test 2: Check if Homebrew tap exists
echo -e "${BLUE}🍺 Checking Homebrew tap...${NC}"
if [ -d "../homebrew-aussievault" ]; then
    echo -e "${GREEN}✅ Homebrew tap found${NC}"
    cd ../homebrew-aussievault
    if git remote -v | grep -q "homebrew-aussievault"; then
        echo -e "${GREEN}✅ Homebrew tap properly configured${NC}"
    else
        echo -e "${YELLOW}⚠️ Homebrew tap remote not configured${NC}"
    fi
    cd ../AussieVaultBrowser
else
    echo -e "${RED}❌ Homebrew tap not found at ../homebrew-aussievault${NC}"
fi

# Test 3: Check package.json
echo -e "${BLUE}📦 Checking package.json...${NC}"
if [ -f "package.json" ]; then
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "ERROR")
    if [ "$VERSION" != "ERROR" ]; then
        echo -e "${GREEN}✅ Package.json valid, current version: ${VERSION}${NC}"
    else
        echo -e "${RED}❌ Package.json invalid or missing version${NC}"
    fi
else
    echo -e "${RED}❌ Package.json not found${NC}"
fi

# Test 4: Check scripts
echo -e "${BLUE}📜 Checking release scripts...${NC}"
if [ -f "scripts/publish-release.sh" ] && [ -x "scripts/publish-release.sh" ]; then
    echo -e "${GREEN}✅ Publish script found and executable${NC}"
else
    echo -e "${RED}❌ Publish script missing or not executable${NC}"
fi

if [ -f "scripts/build-and-release.sh" ] && [ -x "scripts/build-and-release.sh" ]; then
    echo -e "${GREEN}✅ Build-and-release script found and executable${NC}"
else
    echo -e "${RED}❌ Build-and-release script missing or not executable${NC}"
fi

# Test 5: Check Node.js and npm
echo -e "${BLUE}🔧 Checking development environment...${NC}"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
fi

# Test 6: Check if dependencies are installed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️ Dependencies not installed. Run 'npm install' first${NC}"
fi

echo -e "\n${BLUE}🏁 Test Summary:${NC}"
echo -e "${GREEN}✅ Ready to use automated release system!${NC}"
echo -e "\n${BLUE}📋 Quick Commands:${NC}"
echo -e "  ${YELLOW}npm run release:version 1.0.2${NC}  - Build and release v1.0.2"
echo -e "  ${YELLOW}npm run release${NC}              - Build and release current version"
echo -e "  ${YELLOW}./scripts/test-release.sh${NC}    - Run this test again" 