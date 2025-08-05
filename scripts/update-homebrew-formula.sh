#!/bin/bash

# Update Homebrew Formula Script
# This script updates the Homebrew cask formula when a new version is released

set -e

# Configuration
REPO_OWNER="bilalmohib"
REPO_NAME="AussieVaultBrowser"
FORMULA_PATH="homebrew/aussie-vault-browser.rb"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍺 Aussie Vault Browser - Homebrew Formula Updater${NC}"
echo "================================================="

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📦 Current version: ${VERSION}${NC}"

# Download the DMG and calculate SHA256
DMG_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/v${VERSION}/AussieVaultBrowser-${VERSION}.dmg"
echo -e "${YELLOW}📥 Downloading DMG to calculate SHA256...${NC}"

# Create temp directory
TEMP_DIR=$(mktemp -d)
DMG_PATH="${TEMP_DIR}/AussieVaultBrowser-${VERSION}.dmg"

# Download the DMG
if curl -L -o "${DMG_PATH}" "${DMG_URL}"; then
  echo -e "${GREEN}✅ DMG downloaded successfully${NC}"
else
  echo -e "${RED}❌ Failed to download DMG from: ${DMG_URL}${NC}"
  echo -e "${YELLOW}💡 Make sure the GitHub release exists and the DMG is uploaded${NC}"
  exit 1
fi

# Calculate SHA256
SHA256=$(shasum -a 256 "${DMG_PATH}" | cut -d' ' -f1)
echo -e "${GREEN}🔐 SHA256: ${SHA256}${NC}"

# Clean up temp file
rm -rf "${TEMP_DIR}"

# Update the formula
echo -e "${YELLOW}📝 Updating Homebrew formula...${NC}"

# Create the updated formula
cat > "${FORMULA_PATH}" << EOF
cask "aussie-vault-browser" do
  version "${VERSION}"
  sha256 "${SHA256}"

  url "https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/v#{version}/AussieVaultBrowser-#{version}.dmg"
  name "Aussie Vault Browser"
  desc "Secure remote browser with VPN capabilities and 1Password integration"
  homepage "https://github.com/${REPO_OWNER}/${REPO_NAME}"

  auto_updates true
  depends_on macos: ">= :big_sur"

  app "Aussie Vault Browser.app"

  postflight do
    # Set permissions for security features
    system_command "/usr/bin/codesign",
                   args: [
                     "--verify",
                     "--verbose",
                     "#{appdir}/Aussie Vault Browser.app"
                   ],
                   sudo: false
  end

  zap trash: [
    "~/Library/Application Support/aussie-vault-browser",
    "~/Library/Caches/com.aussievault.browser",
    "~/Library/Logs/aussie-vault-browser",
    "~/Library/Preferences/com.aussievault.browser.plist",
    "~/Library/Saved Application State/com.aussievault.browser.savedState",
  ]
end
EOF

echo -e "${GREEN}✅ Formula updated successfully!${NC}"

# Instructions for publishing
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Commit the updated formula:"
echo -e "${YELLOW}   git add ${FORMULA_PATH}${NC}"
echo -e "${YELLOW}   git commit -m \"Update Homebrew formula to v${VERSION}\"${NC}"
echo -e "${YELLOW}   git push${NC}"
echo ""
echo "2. To create your own Homebrew tap:"
echo -e "${YELLOW}   gh repo create bilalmohib/homebrew-aussievault --public${NC}"
echo -e "${YELLOW}   git clone https://github.com/bilalmohib/homebrew-aussievault${NC}"
echo -e "${YELLOW}   cp ${FORMULA_PATH} homebrew-aussievault/Casks/aussie-vault-browser.rb${NC}"
echo ""
echo "3. Users can then install with:"
echo -e "${GREEN}   brew install --cask bilalmohib/aussievault/aussie-vault-browser${NC}"
echo ""
echo "   Or the traditional way:"
echo -e "${YELLOW}   brew tap bilalmohib/aussievault${NC}"
echo -e "${YELLOW}   brew install --cask aussie-vault-browser${NC}"
echo ""
echo -e "${BLUE}🚀 Homebrew formula ready for distribution!${NC}" 