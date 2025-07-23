#!/bin/bash

# Create One-Line Installer Script
# This creates a simple installer that users can run with a single curl command

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Creating One-Line Installer for Aussie Vault Browser${NC}"
echo "======================================================"

# Create the installer script
cat > install-aussie-vault.sh << 'EOF'
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
EOF

# Make it executable
chmod +x install-aussie-vault.sh

echo -e "${GREEN}✅ One-line installer created: install-aussie-vault.sh${NC}"
echo ""
echo -e "${BLUE}📋 Users can now install with:${NC}"
echo -e "${GREEN}curl -fsSL https://raw.githubusercontent.com/bilalmohib/AussieVaultBrowser/main/install-aussie-vault.sh | bash${NC}"
echo ""
echo -e "${YELLOW}📝 Don't forget to commit and push the installer script:${NC}"
echo "git add install-aussie-vault.sh"
echo "git commit -m \"Add one-line installer script\""
echo "git push"
echo ""
echo -e "${BLUE}🎯 Now users have multiple installation options:${NC}"
echo "1. Homebrew one-command: brew install --cask bilalmohib/aussievault/aussie-vault-browser"
echo "2. One-line installer: curl -fsSL [GitHub URL] | bash"
echo "3. Manual download: GitHub releases page" 