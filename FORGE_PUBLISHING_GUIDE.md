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
# Build distributables for current platform
npm run make

# Build for specific platform
npm run make -- --platform=win32
npm run make -- --platform=darwin
npm run make -- --platform=linux

# Publish to GitHub (requires GITHUB_TOKEN)
npm run publish

# Publish for specific platform
npm run publish -- --platform=win32
```

## Platform-Specific Builds

The configuration includes makers for:
- **Windows**: Squirrel.Windows installer (`.exe`)
- **macOS**: ZIP archive (`.zip`)
- **Linux**: DEB package (`.deb`) and RPM package (`.rpm`)

## Publishing Process

1. **Make**: Creates distributables in `out/` directory
2. **Publish**: Uploads distributables to GitHub Releases

The publisher is configured to:
- Create draft releases (you can review before publishing)
- Generate release notes automatically
- Use semantic versioning with 'v' prefix (e.g., v1.0.0)

## Testing Your Setup

1. First, test building locally:
   ```bash
   npm run make
   ```

2. Check the `out/` directory for your distributables

3. Test publishing (will create a draft release):
   ```bash
   npm run publish
   ```

## Troubleshooting

- **Permission errors**: Make sure your GitHub token has the right permissions
- **Build errors**: Check that all dependencies are installed
- **Platform-specific issues**: Some makers only work on their target platform
- **Missing icons**: Add icon files to `public/` directory (icon.ico, icon.png, etc.) 