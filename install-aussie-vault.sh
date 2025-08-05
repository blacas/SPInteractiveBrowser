#!/bin/bash

# Aussie Vault Browser One-Line Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/bilalmohib/AussieVaultBrowser/main/install-aussie-vault.sh | bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🇦🇺 Aussie Vault Browser Installer${NC}"
echo "=================================="

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${RED}❌ This installer is for macOS only${NC}"
  echo -e "${YELLOW}💡 For other platforms, visit: https://github.com/bilalmohib/AussieVaultBrowser/releases${NC}"
  exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
  echo -e "${YELLOW}🍺 Homebrew not found. Installing Homebrew first...${NC}"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Add Homebrew to PATH for this session
  if [[ -f "/opt/homebrew/bin/brew" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -f "/usr/local/bin/brew" ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
fi

echo -e "${YELLOW}📦 Installing Aussie Vault Browser...${NC}"

# Install using the one-command method
if brew install --cask bilalmohib/aussievault/aussie-vault-browser; then
  echo ""
  echo -e "${GREEN}🎉 Success! Aussie Vault Browser has been installed!${NC}"
  echo ""
  echo -e "${BLUE}📱 You can now:${NC}"
  echo "  • Find the app in Applications folder"
  echo "  • Search for 'Aussie Vault Browser' in Spotlight"
  echo "  • Launch from Launchpad"
  echo ""
  echo -e "${BLUE}🔄 To update in the future:${NC}"
  echo "  brew upgrade --cask aussie-vault-browser"
  echo ""
  echo -e "${BLUE}🗑️  To uninstall:${NC}"
  echo "  brew uninstall --cask aussie-vault-browser"
  echo ""
  echo -e "${GREEN}🚀 Happy secure browsing!${NC}"
else
  echo -e "${RED}❌ Installation failed${NC}"
  echo -e "${YELLOW}💡 Try manual installation:${NC}"
  echo "  1. Visit: https://github.com/bilalmohib/AussieVaultBrowser/releases"
  echo "  2. Download the latest .dmg file"
  echo "  3. Open and drag to Applications"
  exit 1
fi
