# macOS Code Signing and Distribution Guide

## Problem Description
When building Electron apps for macOS without proper code signing, users encounter a "damaged and can't be opened" error due to macOS Gatekeeper security features.

## Quick Fix for Testing (Bypass Gatekeeper)

If you need to test an unsigned app immediately:

```bash
# Remove quarantine attribute from the app
sudo xattr -rd com.apple.quarantine "/path/to/Secure Remote Browser.app"
```

## Option 1: Proper Code Signing (Recommended for Distribution)

### Prerequisites
1. **Apple Developer Account** ($99/year)
2. **Developer ID Application Certificate** from Apple Developer Portal
3. **App-specific password** for notarization

**📋 For detailed step-by-step setup instructions, see [APPLE_DEVELOPER_SETUP.md](APPLE_DEVELOPER_SETUP.md)**

### Setup Steps

1. **Get your Team ID and Certificate Identity:**
   ```bash
   # List available certificates
   security find-identity -v -p codesigning
   ```

2. **Set environment variables:**
   ```bash
   # In your CI/CD or local environment
   export APPLE_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"
   export APPLE_ID="your-apple-id@email.com"
   export APPLE_PASSWORD="your-app-specific-password"
   export APPLE_TEAM_ID="YOUR_TEAM_ID"
   ```

3. **Build with signing:**
   ```bash
   npm run make:mac:silicon
   npm run publish:silicon
   ```

### Getting App-Specific Password
1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in → App-Specific Passwords → Generate
3. Use this password for `APPLE_PASSWORD`

## Option 2: Unsigned Distribution with User Instructions

If you can't set up code signing, you can distribute unsigned builds with clear user instructions.

### For End Users (Include in your README/documentation):

```markdown
## Installing on macOS

Due to macOS security features, you may see a "damaged" error when first opening the app.

**Solution:**
1. Download and extract the app
2. Open Terminal
3. Run: `sudo xattr -rd com.apple.quarantine "/path/to/Secure Remote Browser.app"`
4. Enter your password when prompted
5. The app will now open normally

**Alternative method:**
1. Right-click the app → "Open"
2. Click "Open" again in the security dialog
```

## Option 3: Self-Signed Certificate (Development)

For development/internal use, you can create a self-signed certificate:

```bash
# Create self-signed certificate
security create-certificate -c "MyCompany" -t 1 -d 365 -s -k ~/Library/Keychains/login.keychain
```

Update your environment:
```bash
export APPLE_IDENTITY="MyCompany"
```

## Verification Commands

```bash
# Check if app is signed
codesign -dv --verbose=4 "/path/to/Secure Remote Browser.app"

# Verify signature
spctl -a -v "/path/to/Secure Remote Browser.app"
```

## Troubleshooting

### Common Issues:
1. **"No identity found"** - Install Developer ID certificate
2. **"Notarization failed"** - Check Apple ID credentials
3. **"Hardened runtime violation"** - Review entitlements.plist

### Debug Commands:
```bash
# Check keychain certificates
security find-identity -v -p codesigning

# Test app launch
open "/path/to/Secure Remote Browser.app"
```

## Current Configuration

The project is now configured with:
- ✅ Code signing setup in `forge.config.cjs`
- ✅ Entitlements file (`entitlements.plist`)
- ✅ Environment variable support
- ✅ Notarization configuration

To use properly signed builds, set up your Apple Developer account and environment variables as described above. 