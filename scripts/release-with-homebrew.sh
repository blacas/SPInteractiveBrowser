#!/bin/bash

# Complete Release Script with Homebrew Support
# This script handles the entire release process including Homebrew formula updates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Aussie Vault Browser - Complete Release Process${NC}"
echo "=================================================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
  echo -e "${RED}❌ Error: Not in project root directory${NC}"
  exit 1
fi

# Get current version
VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📦 Current version: ${VERSION}${NC}"

# Confirm release
echo -e "${YELLOW}❓ Do you want to release version ${VERSION}? (y/N)${NC}"
read -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}⏹️  Release cancelled${NC}"
  exit 0
fi

# Check if tag already exists
if git tag -l | grep -q "^v${VERSION}$"; then
  echo -e "${RED}❌ Tag v${VERSION} already exists${NC}"
  echo -e "${YELLOW}💡 Update version in package.json or delete the existing tag${NC}"
  exit 1
fi

# Build for all platforms
echo -e "${YELLOW}🔨 Building for all platforms...${NC}"
npm run make:all

# Publish to GitHub
echo -e "${YELLOW}📤 Publishing to GitHub...${NC}"
npm run publish:all

# Wait a moment for GitHub to process the release
echo -e "${YELLOW}⏳ Waiting for GitHub to process the release...${NC}"
sleep 10

# Update Homebrew formula
echo -e "${YELLOW}🍺 Updating Homebrew formula...${NC}"
./scripts/update-homebrew-formula.sh

# Create or update Homebrew tap
echo -e "${YELLOW}🏷️  Setting up Homebrew tap...${NC}"

TAP_DIR="../homebrew-aussievault"
if [[ ! -d "$TAP_DIR" ]]; then
  echo -e "${YELLOW}📁 Creating Homebrew tap repository...${NC}"
  cd ..
  gh repo create bilalmohib/homebrew-aussievault --public --description "Homebrew tap for Aussie Vault Browser"
  git clone https://github.com/bilalmohib/homebrew-aussievault.git
  cd homebrew-aussievault
  
  # Create Casks directory
  mkdir -p Casks
  
  # Create README
  cat > README.md << EOF
# Aussie Vault Browser Homebrew Tap

This tap provides easy installation of Aussie Vault Browser via Homebrew.

## Installation

\`\`\`bash
brew tap bilalmohib/aussievault
brew install --cask aussie-vault-browser
\`\`\`

## About

Aussie Vault Browser is a secure remote browser with VPN capabilities and 1Password integration.

For more information, visit: [https://github.com/bilalmohib/AussieVaultBrowser](https://github.com/bilalmohib/AussieVaultBrowser)
EOF

  git add .
  git commit -m "Initial tap setup"
  git push
  
  cd ../AussieVaultBrowser
else
  echo -e "${GREEN}✅ Homebrew tap directory already exists${NC}"
fi

# Copy updated formula to tap
echo -e "${YELLOW}📋 Copying formula to tap...${NC}"
cp homebrew/aussie-vault-browser.rb ../homebrew-aussievault/Casks/

# Update tap repository
cd ../homebrew-aussievault
git add .
git commit -m "Update aussie-vault-browser to v${VERSION}"
git push

cd ../AussieVaultBrowser

echo ""
echo -e "${GREEN}🎉 Release Complete!${NC}"
echo "======================"
echo -e "${GREEN}✅ Built for all platforms${NC}"
echo -e "${GREEN}✅ Published to GitHub: https://github.com/bilalmohib/AussieVaultBrowser/releases/tag/v${VERSION}${NC}"
echo -e "${GREEN}✅ Homebrew formula updated${NC}"
echo -e "${GREEN}✅ Homebrew tap updated${NC}"
echo ""
echo -e "${BLUE}📋 Users can now install with:${NC}"
echo -e "${GREEN}   brew install --cask bilalmohib/aussievault/aussie-vault-browser${NC}"
echo ""
echo -e "${BLUE}🔗 Share these installation instructions:${NC}"
echo ""
echo "# One-command installation:"
echo "brew install --cask bilalmohib/aussievault/aussie-vault-browser"
echo ""
echo "# Or traditional two-command:"
echo "brew tap bilalmohib/aussievault"
echo "brew install --cask aussie-vault-browser"
echo ""
echo -e "${GREEN}🚀 Happy browsing!${NC}" 