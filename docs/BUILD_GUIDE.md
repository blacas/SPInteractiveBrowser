# 🔨 Build Guide - Multi-Platform Releases

## 🎯 Quick Reference

| Command | Purpose | Works On |
|---------|---------|----------|
| `npm run make` | Build for your current OS | ✅ Any OS |
| `npm run make:all` | Attempt all platforms | ⚠️ Limited by OS |
| `npm run make:win` | Windows only | ✅ Any OS (usually) |
| `npm run make:mac` | macOS only | 🍎 macOS required |
| `npm run make:linux` | Linux only | 🐧 Linux required |

## 🚀 For Regular Development

### Build for Your Current Platform
```bash
npm run make        # Builds for Windows (if on Windows)
npm run publish     # Publishes for Windows (if on Windows)
```

## 🌍 For Multi-Platform Releases

### Method 1: GitHub Actions (Recommended)
**Best for complete releases with all platforms:**

1. **Create a Git tag:**
   ```bash
   git tag v1.2.5
   git push origin v1.2.5
   ```

2. **GitHub Actions automatically builds:**
   - 🪟 Windows on `windows-latest`
   - 🍎 macOS on `macos-latest` 
   - 🐧 Linux on `ubuntu-latest`

3. **All platforms get published to the same release!**

### Method 2: Manual Cross-Platform
**If you have access to multiple machines:**

```bash
# On Windows machine:
npm run make:win && npm run publish:win

# On macOS machine:  
npm run make:mac && npm run publish:mac

# On Linux machine:
npm run make:linux && npm run publish:linux
```

## 🔍 Understanding Platform Limitations

### Why Cross-Platform Building is Limited

| Platform | Limitation | Reason |
|----------|------------|---------|
| **Windows → macOS** | ❌ Cannot build | Universal binaries need macOS tools |
| **Windows → Linux** | ❌ Cannot build | DEB/RPM makers need Linux tools |
| **macOS → Windows** | ⚠️ Sometimes works | Windows tools can run in emulation |
| **macOS → Linux** | ⚠️ Sometimes works | Some Linux tools available |
| **Linux → Windows** | ⚠️ Sometimes works | Wine can help but unreliable |
| **Linux → macOS** | ❌ Cannot build | Apple tools require macOS |

### What Actually Happens

When you run `npm run make:all` on Windows:
- ✅ **Windows builds successfully**
- ❌ **macOS fails** with universal binary errors
- ❌ **Linux fails** with "cannot run on win32" errors

**This is normal and expected!** The script shows exactly what worked and what didn't.

## 📁 Build Output Structure

```
out/make/
├── squirrel.windows/          # Windows installer
│   └── x64/
│       ├── *.Setup.exe        # Windows installer
│       └── *.nupkg           # NuGet package
├── zip/                       # macOS builds
│   └── darwin/
│       ├── x64/              # Intel Macs
│       ├── arm64/            # Apple Silicon
│       └── universal/        # Universal binary
└── deb/ & rpm/               # Linux packages
    └── x64/
        ├── *.deb             # Debian/Ubuntu
        └── *.rpm             # Red Hat/Fedora
```

## 🎯 Release Workflow Recommendations

### For Small Teams
```bash
# Developer workflow:
npm run make        # Build for current platform
npm run publish     # Publish current platform

# When ready for full release:
git tag v1.2.5      # Trigger GitHub Actions
git push origin v1.2.5
```

### For Enterprise
1. **Use GitHub Actions** for all releases
2. **Set up branch protection** requiring CI to pass
3. **Tag releases** to trigger multi-platform builds
4. **Monitor Actions** tab for build status

## 🐛 Troubleshooting

### "Cannot make for linux and target deb"
- **Expected on Windows/macOS**
- **Solution:** Use GitHub Actions or Linux machine

### macOS Universal Binary Errors
- **Expected on non-macOS**
- **Solution:** Use GitHub Actions or macOS machine

### Windows Builds Failing
- **Check:** Node.js version (need 18+)
- **Check:** npm dependencies (`npm ci`)
- **Try:** Run as Administrator

### GitHub Actions Not Publishing
- **Check:** `GITHUB_TOKEN` permissions
- **Check:** Repository settings → Actions permissions
- **Check:** Tag format matches `v*.*.*`

## 💡 Pro Tips

1. **Test locally first:** Always run `npm run make` to verify your platform works
2. **Use semantic versioning:** Tags like `v1.2.3` trigger CI automatically  
3. **Check CI logs:** Actions tab shows detailed build information
4. **Draft releases:** CI creates draft releases for review before publishing
5. **Cross-platform testing:** Use VMs or cloud instances for testing other platforms

---

**🎉 With this setup, every release automatically includes downloads for Windows, macOS, and Linux users!** 