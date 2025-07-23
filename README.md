# 🇦🇺 Aussie Vault Browser

A secure, privacy-focused browser application with VPN capabilities and 1Password integration, specifically designed for Australian users.

## ✨ Features

- **🔐 Enhanced Security**: Built-in VPN protection and secure browsing
- **🔑 1Password Integration**: Seamless password management
- **🇦🇺 Australian Focus**: Optimized for Australian users and services
- **⚡ Fast Performance**: Electron-based with modern web technologies
- **🎨 Modern UI**: Clean, intuitive interface built with React and Tailwind CSS

## 🚀 Quick Installation

### macOS - One-Command Installation

**Homebrew (Recommended):**
```bash
brew install --cask bilalmohib/aussievault/aussie-vault-browser
```

**Curl Installer:**
```bash
curl -fsSL https://raw.githubusercontent.com/bilalmohib/AussieVaultBrowser/main/install-aussie-vault.sh | bash
```

**Alternative (Two-step Homebrew):**
```bash
brew tap bilalmohib/aussievault
brew install --cask aussie-vault-browser
```

### Manual Download

Download the latest release from [GitHub Releases](https://github.com/bilalmohib/AussieVaultBrowser/releases)

- **macOS**: Download `.dmg` file
- **Windows**: Download `.exe` installer  
- **Linux**: Download `.deb` or `.rpm` package

## 🔧 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.x (for native modules)

### Setup

```bash
# Clone the repository
git clone https://github.com/bilalmohib/AussieVaultBrowser.git
cd AussieVaultBrowser

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package for current platform
npm run make

# Package for all platforms
npm run make:all
```

### Release Process

```bash
# Complete release with Homebrew publishing
npm run release:homebrew

# Or update just the Homebrew formula
npm run update:homebrew
```

## 🚀 Release Management

### Automated Release Process

This project includes automated scripts to build and publish releases to the public repository while keeping the source code private.

#### Quick Release Commands

```bash
# Build and release with version bump
npm run release:version [version]

# Build and release current version
npm run release

# Quick build and release (no prompts)
npm run release:quick
```

#### Manual Release Process

1. **Update Version** (if needed):
   ```bash
   npm version 1.0.2 --no-git-tag-version
   ```

2. **Run Release Script**:
   ```bash
   ./scripts/publish-release.sh
   ```

3. **Complete GitHub Release**:
   - Go to: https://github.com/bilalmohib/aussie-vault-browser-releases/releases
   - Edit the created release
   - Upload the DMG file
   - Publish the release

#### Installation for Users

Once released, users can install via Homebrew:

```bash
brew install --cask bilalmohib/aussievault/aussie-vault-browser
```

### Repository Structure

- **Private Repo** (`AussieVaultBrowser/`): Contains source code (this repository)
- **Public Releases** (`aussie-vault-browser-releases/`): Contains releases only
- **Homebrew Tap** (`homebrew-aussievault/`): Contains Homebrew cask formula

## 📋 Admin Dashboard

Access the admin dashboard to manage users and monitor activity:

```bash
cd admin-aussie-vault-browser
npm install
npm run dev
```

Features:
- User management with access levels
- Session monitoring  
- Security event tracking
- VPN connection analytics
- Real-time activity monitoring

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# VPN Configuration
VPN_PROVIDER=wireguard
VPN_SERVER_REGION=australia
VPN_AUTO_CONNECT=true

# Security Settings  
SECURITY_HTTPS_ONLY=true
SECURITY_BLOCK_DOWNLOADS=false
SECURITY_FAIL_CLOSED_VPN=true

# Database (for admin dashboard)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### Access Levels

- **Level 1**: Restricted access to approved sites only
- **Level 2**: Manager access with additional permissions  
- **Level 3**: Full access to all features

## 🔐 Security Features

- **Sandboxed Browsing**: Isolated browser environment
- **VPN Enforcement**: Automatic VPN connection for secure browsing
- **Content Filtering**: Block malicious sites and downloads
- **Session Management**: Secure session handling and monitoring
- **Audit Logging**: Complete activity logging for compliance

## 🌐 VPN Setup

The browser includes built-in VPN support for Australian servers:

1. **WireGuard Configuration**: Automatic setup for Australian endpoints
2. **Connection Monitoring**: Real-time VPN status and failover
3. **Geo-Blocking**: Ensure Australian IP addresses
4. **Speed Optimization**: Optimized for Australian network infrastructure

## 📱 Browser Features

- **Secure Downloads**: Controlled download management with scanning
- **Password Integration**: Native 1Password extension support  
- **Context Menus**: Right-click to save pages as PDF
- **Session Persistence**: Secure session storage and recovery
- **Multi-Window**: Support for multiple browser windows

## 🏢 Enterprise Deployment

### System Requirements

- **macOS**: 10.15+ (Catalina or later)
- **Windows**: Windows 10/11
- **Linux**: Ubuntu 18.04+, CentOS 7+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for application + data

### Deployment Options

1. **Homebrew** (macOS): Centralized package management
2. **MSI Installer** (Windows): Group Policy deployment
3. **DEB/RPM Packages** (Linux): Repository-based distribution
4. **Docker**: Containerized deployment option

## 📊 Analytics & Monitoring

The admin dashboard provides comprehensive analytics:

- User session tracking
- VPN connection statistics  
- Security event monitoring
- Download and navigation logs
- Real-time system health

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable  
5. Submit a pull request

## 📚 Documentation

- [Admin Panel Setup](admin-aussie-vault-browser/README.md)
- [VPN Configuration](docs/vpn-setup.md)
- [1Password Integration](docs/1password-setup.md)
- [Homebrew Publishing](HOMEBREW_SETUP.md)

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/bilalmohib/AussieVaultBrowser/issues) with:

- Operating system and version
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- VPN powered by [WireGuard](https://www.wireguard.com/) 
- Password management via [1Password](https://1password.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ in Australia 🇦🇺

For support, please contact [support@aussievault.com](mailto:support@aussievault.com)
