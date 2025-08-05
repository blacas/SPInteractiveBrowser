#!/bin/bash

# 🚀 Quick Build and Release Script
# Usage: ./scripts/build-and-release.sh [version]

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get version argument or prompt
if [ -z "$1" ]; then
    echo -e "${YELLOW}📋 Current version: $(node -p "require('./package.json').version")${NC}"
    read -p "Enter new version (e.g., 1.0.2): " NEW_VERSION
else
    NEW_VERSION="$1"
fi

echo -e "${BLUE}🔄 Updating version to ${NEW_VERSION}...${NC}"

# Update package.json version
npm version "$NEW_VERSION" --no-git-tag-version

echo -e "${BLUE}🚀 Running release process...${NC}"

# Run the main release script
./scripts/publish-release.sh

echo -e "${GREEN}✅ Build and release completed for v${NEW_VERSION}!${NC}" 