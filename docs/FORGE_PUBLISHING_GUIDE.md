# Electron Forge Publishing Guide

## Required Configuration Changes

### 1. Update forge.config.js with your GitHub repository details

Edit `forge.config.js` and update these fields:

```javascript
publishers: [
  {
    name: '@electron-forge/publisher-github',
    config: {
      repository: {
        owner: 'your-actual-github-username',  // Replace with your GitHub username
        name: 'secure-remote-browser',         // Replace with your repository name
      },
      prerelease: false,
      draft: true,
      generateReleaseNotes: true,
      tagPrefix: 'v',
    },
  },
],
```

### 2. Set up GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with these scopes:
   - `repo` (Full control of private repositories)
   - `write:packages` (Upload packages to GitHub Package Registry)
3. Set the token as an environment variable:
   ```bash
   # Windows (PowerShell)
   $env:GITHUB_TOKEN = "your_token_here"
   
   # Linux/macOS
   export GITHUB_TOKEN="your_token_here"
   ```

### 3. Optional: Set up Windows Code Signing

If you want to code sign your Windows releases, set these environment variables:

```bash
# Windows Certificate File Path
$env:WINDOWS_CERTIFICATE_FILE = "path/to/your/certificate.p12"

# Windows Certificate Password
$env:WINDOWS_CERTIFICATE_PASSWORD = "your_certificate_password"
```

### 4. Build and Publish Commands

```bash
# Build distributables for ALL platforms (Windows, macOS, Linux)
npm run make

# Build for all platforms (explicit)
npm run make:all

# Build for specific platform
npm run make:win           # Windows only
npm run make:mac           # macOS Universal (Intel + Apple Silicon)
npm run make:mac:intel     # macOS Intel only
npm run make:mac:silicon   # macOS Apple Silicon only
npm run make:linux         # Linux only

# Publish to GitHub for ALL platforms (requires GITHUB_TOKEN)
npm run publish

# Publish for all platforms (explicit)
npm run publish:all

# Publish for specific platform
npm run publish:win           # Windows only
npm run publish:mac           # macOS Universal (Intel + Apple Silicon)
npm run publish:mac:intel     # macOS Intel only
npm run publish:mac:silicon   # macOS Apple Silicon only
npm run publish:linux         # Linux only
```

**🚀 Default Behavior Change**: The `make` and `publish` commands now build for **all three platforms** by default (Windows, macOS, and Linux). This ensures every release includes downloads for all supported operating systems.

## Platform-Specific Builds

The configuration includes makers for all platforms. When you run `npm run make`, you'll get:

### Windows
- **Installer**: `Secure.Remote.Browser-1.2.4.Setup.exe` (Squirrel installer)
- **Package**: `secure_remote_browser-1.2.4-full.nupkg` (NuGet package)

### macOS  
- **Universal Binary**: `Secure.Remote.Browser-1.2.4-darwin-universal.zip` (Intel + Apple Silicon)
- **Intel Only**: `Secure.Remote.Browser-1.2.4-darwin-x64.zip` (Intel Macs)
- **Apple Silicon Only**: `Secure.Remote.Browser-1.2.4-darwin-arm64.zip` (Apple Silicon Macs)

### Linux
- **Debian/Ubuntu**: `secure-remote-browser_1.2.4_amd64.deb` (DEB package)
- **Red Hat/Fedora**: `secure-remote-browser-1.2.4.x86_64.rpm` (RPM package)

## Publishing Process

1. **Make**: Creates distributables in `out/` directory
2. **Publish**: Uploads distributables to GitHub Releases

The publisher is configured to:
- Create draft releases (you can review before publishing)
- Generate release notes automatically
- Use semantic versioning with 'v' prefix (e.g., v1.0.0)

## Testing Your Setup

1. **Quick test** - Build and compile for all platforms:
   ```bash
   npm run test:build
   ```

2. **Full test** - Build distributables for all platforms locally:
   ```bash
   npm run make
   ```

3. **Check output** - Verify the `out/` directory contains files for all platforms:
   ```
   out/
   ├── make/
   │   ├── squirrel.windows/           # Windows files
   │   ├── zip/darwin/                 # macOS files  
   │   ├── deb/                        # Linux DEB files
   │   └── rpm/                        # Linux RPM files
   ```

4. **Test publishing** (will create a draft release):
   ```bash
   npm run publish
   ```

## Troubleshooting

- **Permission errors**: Make sure your GitHub token has the right permissions
- **Build errors**: Check that all dependencies are installed
- **Platform-specific issues**: Some makers only work on their target platform
- **Missing icons**: Add icon files to `public/` directory (icon.ico, icon.png, etc.) 