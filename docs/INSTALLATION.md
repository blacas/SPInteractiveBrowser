# 🚀 Installation Guide

Multiple ways to install Aussie Vault Browser - choose what works best for you!

## 🍺 Option 1: Homebrew (Recommended)

**One command installation:**
```bash
brew install --cask bilalmohib/aussievault/aussie-vault-browser
```

This is the fastest and cleanest method. Homebrew will handle everything automatically.

## 📥 Option 2: Curl Installer

**One-line installation script:**
```bash
curl -fsSL https://raw.githubusercontent.com/bilalmohib/AussieVaultBrowser/main/install-aussie-vault.sh | bash
```

This script will:
- Install Homebrew if not present
- Install Aussie Vault Browser
- Show usage instructions

## 📦 Option 3: Manual Download

1. Visit [GitHub Releases](https://github.com/bilalmohib/AussieVaultBrowser/releases)
2. Download the latest `.dmg` file for macOS
3. Open the DMG and drag the app to Applications

## 🔄 Updates & Management

### Update to Latest Version
```bash
brew upgrade --cask aussie-vault-browser
```

### Uninstall
```bash
brew uninstall --cask aussie-vault-browser
```

### Check Current Version
```bash
brew list --cask | grep aussie-vault-browser
```

## 🏢 Enterprise Installation

### For IT Administrators

**Silent Installation:**
```bash
# Install without user interaction
brew install --cask bilalmohib/aussievault/aussie-vault-browser --quiet
```

**Verify Installation:**
```bash
# Check if app is installed
ls -la "/Applications/Aussie Vault Browser.app"
```

**Deployment Script Example:**
```bash
#!/bin/bash
# Enterprise deployment script

# Install Homebrew if needed (admin permissions required)
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Aussie Vault Browser
brew install --cask bilalmohib/aussievault/aussie-vault-browser --quiet

# Verify installation
if [[ -d "/Applications/Aussie Vault Browser.app" ]]; then
    echo "✅ Aussie Vault Browser installed successfully"
else
    echo "❌ Installation failed"
    exit 1
fi
```

## 🖥️ System Requirements

- **macOS**: 10.15 (Catalina) or later
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Internet**: Required for VPN and initial setup

## 🔧 Troubleshooting

### Common Issues

**"App is damaged" error:**
```bash
sudo xattr -rd com.apple.quarantine "/Applications/Aussie Vault Browser.app"
```

**Homebrew not found:**
```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Permission denied:**
```bash
# Make sure you have admin rights or use sudo for Homebrew installation
sudo chown -R $(whoami) /usr/local/Homebrew
```

**Network issues:**
- Check internet connection
- Verify firewall settings
- Try manual download if automated installation fails

### Getting Help

If you encounter issues:

1. **Check our [GitHub Issues](https://github.com/bilalmohib/AussieVaultBrowser/issues)**
2. **Create a new issue** with:
   - macOS version
   - Installation method tried
   - Error message (if any)
   - Screenshots (helpful)

## 🎯 Quick Start After Installation

1. **Launch** the app from Applications or Spotlight
2. **Sign in** with your credentials
3. **Configure VPN** (if required)
4. **Start browsing** securely!

---

**🇦🇺 Made in Australia** - Secure browsing for Australian users 