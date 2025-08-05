\# 🚀 Automated Release System Documentation

## 📋 Overview

This automated release system allows you to **build and publish** releases from your **private `AussieVaultBrowser` repository** to the **public `aussie-vault-browser-releases` repository** while keeping your source code completely private.

## 🏗️ Architecture

```
┌─────────────────────────┐    ┌──────────────────────────┐    ┌─────────────────────────┐
│   Private Repository    │    │   Public Releases Repo   │    │   Homebrew Tap Repo     │
│   AussieVaultBrowser/   │───▶│ aussie-vault-browser-    │───▶│ homebrew-aussievault/   │
│                         │    │       releases/          │    │                         │
│ • Source Code (Private) │    │ • DMG Files (Public)     │    │ • Cask Formula (Public) │
│ • Build Scripts         │    │ • GitHub Releases        │    │ • Installation Recipe   │
│ • Release Automation    │    │ • Release Notes          │    │                         │
└─────────────────────────┘    └──────────────────────────┘    └─────────────────────────┘
```

## 🎯 Quick Start

### **Option 1: Version Bump + Release**
```bash
npm run release:version 1.0.2
```

### **Option 2: Release Current Version**
```bash
npm run release
```

### **Option 3: Manual Build + Release**
```bash
npm run build
npm run release:quick
```

## 📚 Detailed Workflow

### **1. Preparation** ✅

- [x] Private source repository: `AussieVaultBrowser/`
- [x] Public releases repository: `aussie-vault-browser-releases/`
- [x] Homebrew tap repository: `homebrew-aussievault/`
- [x] Release scripts configured and executable
- [x] All repositories properly linked

### **2. Release Process**

When you run a release command, the system automatically:

1. **🔍 Validates Setup**
   - Checks all required repositories exist
   - Verifies scripts are executable
   - Confirms dependencies are installed

2. **🧹 Cleans Build Environment**
   - Removes previous build artifacts
   - Ensures clean build state

3. **🔨 Builds Application**
   - Compiles TypeScript
   - Builds Vite bundle
   - Creates macOS DMG with electron-forge

4. **📦 Publishes to Releases Repository**
   - Copies DMG to public releases repo
   - Creates Git tag for version
   - Pushes to GitHub
   - Prepares release assets

5. **🍺 Updates Homebrew Cask**
   - Updates version in cask formula
   - Commits and pushes changes
   - Maintains installation recipe

6. **✅ Completion**
   - Provides next steps
   - Shows installation commands
   - Links to GitHub releases page

## 📋 Manual Steps (After Automation)

After the automated process completes, you need to:

1. **Create GitHub Release** 📦
   - Go to: https://github.com/bilalmohib/aussie-vault-browser-releases/releases
   - Edit the auto-created release tag
   - Upload the DMG file
   - Add release notes
   - Publish the release

2. **Test Installation** 🧪
   ```bash
   brew install --cask bilalmohib/aussievault/aussie-vault-browser
   ```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run release:version [version]` | Updates version and releases |
| `npm run release` | Releases current version |
| `npm run release:quick` | Quick release (build + publish) |
| `./scripts/test-release.sh` | Test release setup |
| `./scripts/publish-release.sh` | Main release script |
| `./scripts/build-and-release.sh` | Version bump + release |

## 🗂️ File Structure

```
AussieVaultBrowser/
├── scripts/
│   ├── publish-release.sh      # Main automation script
│   ├── build-and-release.sh    # Version bump + release
│   └── test-release.sh         # Setup verification
├── .github/workflows/
│   └── release.yml             # GitHub Actions (optional)
├── package.json                # Updated with release scripts
└── RELEASE_AUTOMATION.md       # This documentation
```

## 🔐 Security Benefits

✅ **Source code remains completely private**  
✅ **Only built binaries are public**  
✅ **Client confidentiality maintained**  
✅ **Professional distribution method**  
✅ **Standard industry practice**  

## 🚨 Important Notes

1. **GitHub Repository Setup**: Ensure the public releases repository is created at:
   - https://github.com/bilalmohib/aussie-vault-browser-releases

2. **Repository Visibility**: The releases repository MUST be public for Homebrew to work

3. **Manual Release Step**: After automation, you still need to manually upload the DMG to GitHub releases

4. **Version Management**: Use semantic versioning (e.g., 1.0.1, 1.0.2, 1.1.0)

## 🛠️ Troubleshooting

### **"Directory not found" Error**
```bash
# Ensure all repositories are in the correct structure:
BC/
├── AussieVaultBrowser/           # Your private source code
├── aussie-vault-browser-releases/ # Public releases
└── homebrew-aussievault/         # Homebrew tap
```

### **"Build Failed" Error**
```bash
# Clean and rebuild
rm -rf out/ dist/ dist-electron/ node_modules/
npm install
npm run build
```

### **"Git Push Failed" Error**
```bash
# Check remote repositories are properly configured
git remote -v  # In each repository
```

## 🎉 Success Workflow

1. **Make code changes** in `AussieVaultBrowser/`
2. **Test locally** with `npm run dev`
3. **Run release** with `npm run release:version X.Y.Z`
4. **Complete GitHub release** manually
5. **Users install** with `brew install --cask bilalmohib/aussievault/aussie-vault-browser`

---

**🇦🇺 Built with ❤️ for Australian users** 