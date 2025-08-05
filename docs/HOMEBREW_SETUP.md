# Homebrew Publishing Setup

This guide explains how to publish Aussie Vault Browser to Homebrew, allowing users to install it with a simple `brew install` command.

## 🍺 What is Homebrew?

Homebrew is the most popular package manager for macOS. With Homebrew support, users can install Aussie Vault Browser with:

```bash
# One-command installation (recommended)
brew install --cask bilalmohib/aussievault/aussie-vault-browser
```

Or the traditional two-command approach:
```bash
brew tap bilalmohib/aussievault
brew install --cask aussie-vault-browser
```

## 📋 Prerequisites

Before setting up Homebrew publishing, ensure you have:

1. **GitHub CLI installed**: `brew install gh`
2. **GitHub authentication**: `gh auth login`
3. **Apple Developer Account** (for code signing - optional but recommended)
4. **Environment variables** (for code signing):
   ```bash
   export APPLE_DEVELOPER_ID="Developer ID Application: Your Name (TEAM_ID)"
   export APPLE_ID="your-apple-id@example.com"
   export APPLE_PASSWORD="app-specific-password"
   export APPLE_TEAM_ID="YOUR_TEAM_ID"
   ```

## 🚀 Quick Start

### 1. One-Command Release

For a complete release with Homebrew publishing:

```bash
./scripts/release-with-homebrew.sh
```

This script will:
- Build for all platforms
- Publish to GitHub Releases
- Update the Homebrew formula
- Create/update the Homebrew tap
- Provide installation instructions

### 2. Manual Process

If you prefer to do it step by step:

#### Step 1: Build and Publish
```bash
# Build for macOS
npm run make:mac

# Publish to GitHub
npm run publish:mac
```

#### Step 2: Update Homebrew Formula
```bash
./scripts/update-homebrew-formula.sh
```

#### Step 3: Set up Homebrew Tap
```bash
# Create the tap repository (only needed once)
gh repo create bilalmohib/homebrew-aussievault --public

# Clone and set up
git clone https://github.com/bilalmohib/homebrew-aussievault.git
cd homebrew-aussievault
mkdir -p Casks

# Copy the formula
cp ../AussieVaultBrowser/homebrew/aussie-vault-browser.rb Casks/

# Commit and push
git add .
git commit -m "Add aussie-vault-browser cask"
git push
```

## 📁 File Structure

```
AussieVaultBrowser/
├── homebrew/
│   └── aussie-vault-browser.rb     # Homebrew cask formula
├── scripts/
│   ├── release-with-homebrew.sh    # Complete release script
│   └── update-homebrew-formula.sh  # Formula updater
└── HOMEBREW_SETUP.md              # This file
```

## 🔧 Configuration Files

### Homebrew Cask Formula (`homebrew/aussie-vault-browser.rb`)

This file defines how Homebrew should install your app:

```ruby
cask "aussie-vault-browser" do
  version "1.0.1"
  sha256 "calculated-automatically"
  
  url "https://github.com/bilalmohib/AussieVaultBrowser/releases/download/v#{version}/AussieVaultBrowser-#{version}.dmg"
  name "Aussie Vault Browser"
  desc "Secure remote browser with VPN capabilities and 1Password integration"
  homepage "https://github.com/bilalmohib/AussieVaultBrowser"
  
  app "Aussie Vault Browser.app"
end
```

### Electron Forge Configuration

Updated `forge.config.cjs` includes:
- DMG maker for better macOS distribution
- Proper code signing configuration
- GitHub publishing setup

## 📦 Release Process

### For New Versions

1. **Update version** in `package.json`
2. **Run release script**: `./scripts/release-with-homebrew.sh`
3. **Verify installation**: Test with `brew install --cask aussie-vault-browser`

### What Happens During Release

1. **Build**: Creates DMG files for macOS
2. **Publish**: Uploads to GitHub Releases
3. **Calculate SHA256**: Downloads DMG and calculates checksum
4. **Update Formula**: Updates version and SHA256 in cask file
5. **Update Tap**: Commits changes to Homebrew tap repository

## 🏷️ Homebrew Tap

Your Homebrew tap is located at: `https://github.com/bilalmohib/homebrew-aussievault`

Users can install with one command:
```bash
brew install --cask bilalmohib/aussievault/aussie-vault-browser
```

Or add the tap first:
```bash
brew tap bilalmohib/aussievault
```

## 👥 User Installation

Once published, users can install with:

```bash
# One-command installation
brew install --cask bilalmohib/aussievault/aussie-vault-browser

# Upgrade to newer versions
brew upgrade --cask aussie-vault-browser

# Uninstall
brew uninstall --cask aussie-vault-browser
```

Alternative two-command installation:
```bash
# Add your tap first
brew tap bilalmohib/aussievault

# Then install the app
brew install --cask aussie-vault-browser
```

## 🔍 Troubleshooting

### Common Issues

1. **SHA256 Mismatch**
   - Delete the old DMG from GitHub releases
   - Rebuild and re-upload
   - Run the update script again

2. **Code Signing Issues**
   - Ensure Apple Developer ID is set correctly
   - Check that certificates are installed
   - For development, you can disable signing temporarily

3. **GitHub API Rate Limits**
   - Use GitHub token: `gh auth login`
   - Wait a few minutes between operations

### Validation

Test your Homebrew cask:

```bash
# Validate the cask syntax
brew cask audit aussie-vault-browser

# Test installation in a clean environment
brew install --cask aussie-vault-browser --verbose
```

## 📈 Analytics

Track installation metrics:
- GitHub releases download counts
- Homebrew analytics (if opted in)
- User feedback through GitHub issues

## 🤝 Contributing to Homebrew Core

To submit to the main Homebrew cask repository:

1. Fork `homebrew/homebrew-cask`
2. Add your cask to `Casks/aussie-vault-browser.rb`
3. Submit a pull request

Requirements:
- App must be free or have a free tier
- Must be distributed officially
- Must be notable/popular enough

## 📚 Resources

- [Homebrew Cask Documentation](https://docs.brew.sh/Cask-Cookbook)
- [Electron Forge Publishing](https://www.electronforge.io/guides/publishing)
- [Apple Code Signing Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)

---

🎉 **Happy Brewing!** Your users will love the simple installation experience. 