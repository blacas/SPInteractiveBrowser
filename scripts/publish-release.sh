#!/bin/bash

# 🚀 Aussie Vault Browser - Automated Release Publisher
# Builds the app and publishes to public releases repository

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRIVATE_REPO_DIR="$(pwd)"
RELEASES_REPO_DIR="../aussie-vault-browser-releases"
HOMEBREW_TAP_DIR="../homebrew-aussievault"

echo -e "${BLUE}🚀 Starting Aussie Vault Browser Release Process...${NC}"

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        echo -e "${RED}❌ Error: Directory $1 not found!${NC}"
        echo -e "${YELLOW}💡 Please ensure the releases repository is cloned to: $1${NC}"
        exit 1
    fi
}

# Function to get version from package.json
get_version() {
    node -p "require('./package.json').version"
}

# Function to prepare GitHub release
prepare_github_release() {
    local version=$1
    local dmg_file=$2
    
    echo -e "${BLUE}📦 Preparing GitHub release v${version}...${NC}"
    
    cd "$RELEASES_REPO_DIR"
    
    # Check if release already exists
    if git tag -l | grep -q "v${version}"; then
        echo -e "${YELLOW}⚠️ Release v${version} already exists. Updating...${NC}"
        git tag -d "v${version}" 2>/dev/null || true
        git push origin :refs/tags/v${version} 2>/dev/null || true
    fi
    
    # Create and push tag (without large files)
    git tag "v${version}"
    git push origin "v${version}"
    
    echo -e "${GREEN}✅ GitHub release tag v${version} created successfully!${NC}"
    echo -e "${BLUE}📁 DMG file ready for upload: ${dmg_file}${NC}"
    echo -e "${YELLOW}📋 Next step: Upload DMG manually to GitHub Release${NC}"
    
    cd "$PRIVATE_REPO_DIR"
}

# Function to update Homebrew cask
update_homebrew_cask() {
    local version=$1
    
    echo -e "${BLUE}🍺 Updating Homebrew cask...${NC}"
    
    cd "$HOMEBREW_TAP_DIR"
    
    # Update version in cask file
    sed -i '' "s/version \".*\"/version \"${version}\"/" Casks/aussie-vault-browser.rb
    
    # Commit and push
    git add .
    git commit -m "feat: Update cask to v${version}" || echo "No changes to commit"
    git push origin main
    
    echo -e "${GREEN}✅ Homebrew cask updated to v${version}!${NC}"
    
    cd "$PRIVATE_REPO_DIR"
}

# Function to copy DMG to desktop for easy access
copy_dmg_to_desktop() {
    local dmg_file=$1
    local version=$2
    
    if [ -f "$dmg_file" ]; then
        cp "$dmg_file" ~/Desktop/"AussieVaultBrowser-${version}.dmg"
        echo -e "${GREEN}✅ DMG copied to Desktop for easy upload!${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if required directories exist
    check_directory "$RELEASES_REPO_DIR"
    check_directory "$HOMEBREW_TAP_DIR"
    
    # Get version from package.json
    VERSION=$(get_version)
    echo -e "${GREEN}📋 Building version: ${VERSION}${NC}"
    
    # Clean previous builds
    echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
    rm -rf out/ dist/ dist-electron/
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Build the application
    echo -e "${BLUE}🔨 Building Aussie Vault Browser...${NC}"
    npm run make
    
    # Check if DMG was created
    DMG_FILE="out/make/Aussie Vault Browser-${VERSION}-arm64.dmg"
    if [ ! -f "$DMG_FILE" ]; then
        echo -e "${RED}❌ Error: DMG file not found at $DMG_FILE${NC}"
        echo -e "${YELLOW}💡 Build may have failed. Check the output above.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo -e "${BLUE}📁 DMG created: $DMG_FILE${NC}"
    
    # Copy DMG to desktop for easy access
    copy_dmg_to_desktop "$DMG_FILE" "$VERSION"
    
    # Prepare GitHub release (without copying large files)
    prepare_github_release "$VERSION" "$DMG_FILE"
    
    # Update Homebrew cask
    update_homebrew_cask "$VERSION"
    
    echo -e "${GREEN}🎉 Release process completed successfully!${NC}"
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "  1. Go to: ${YELLOW}https://github.com/bilalmohib/aussie-vault-browser-releases/releases${NC}"
    echo -e "  2. Click 'Draft a new release'"
    echo -e "  3. Choose tag: ${YELLOW}v${VERSION}${NC}"
    echo -e "  4. Upload DMG: ${YELLOW}~/Desktop/AussieVaultBrowser-${VERSION}.dmg${NC}"
    echo -e "  5. Add release title: ${YELLOW}🇦🇺 Aussie Vault Browser v${VERSION}${NC}"
    echo -e "  6. Publish the release"
    echo -e "  7. Test installation: ${YELLOW}brew install --cask bilalmohib/aussievault/aussie-vault-browser${NC}"
}

# Run main function
main "$@" 