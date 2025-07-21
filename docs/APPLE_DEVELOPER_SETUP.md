# Apple Developer Account Setup Guide

## Step 1: Create Apple Developer Account

### 1.1 Sign Up for Apple Developer Program
1. Go to [developer.apple.com](https://developer.apple.com)
2. Click **"Account"** in the top navigation
3. Sign in with your existing Apple ID or create a new one
4. Click **"Join the Apple Developer Program"**
5. Choose **"Individual"** or **"Organization"** ($99/year)
6. Complete the enrollment process and payment

### 1.2 Wait for Approval
- Individual accounts: Usually approved within 24-48 hours
- Organization accounts: May take 1-7 days for verification

## Step 2: Download Development Tools

### 2.1 Install Xcode (Required for Certificates)
1. Open Mac App Store
2. Search for "Xcode" and install (it's free, ~15GB)
3. Open Xcode and accept the license agreement

**Note:** You don't need to use Xcode for development, but it's required for certificate management.

## Step 3: Create Developer ID Certificate

### 3.1 Generate Certificate Signing Request (CSR)
1. Open **Keychain Access** (found in Applications > Utilities)
2. Go to **Keychain Access** menu → **Certificate Assistant** → **Request a Certificate From a Certificate Authority**
3. Fill in:
   - **User Email Address**: Your Apple ID email
   - **Common Name**: Your name or company name
   - **CA Email Address**: Leave blank
   - Select **"Saved to disk"**
4. Click **"Continue"** and save the `.certSigningRequest` file

### 3.2 Create Certificate in Apple Developer Portal
1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in and go to **"Account"** → **"Certificates, Identifiers & Profiles"**
3. Click **"Certificates"** in the sidebar
4. Click the **"+"** button to add a new certificate
5. Under **"Software"**, select **"Developer ID Application"**
6. Click **"Continue"**
7. Upload the `.certSigningRequest` file you created
8. Click **"Continue"** → **"Download"**
9. Double-click the downloaded `.cer` file to install it in Keychain

## Step 4: Get Your Credentials

### 4.1 Find Your Team ID
1. In Apple Developer portal, go to **"Membership"** section
2. Your **Team ID** is displayed (10-character alphanumeric string)
3. Copy this value - you'll use it as `APPLE_TEAM_ID`

### 4.2 Find Your Certificate Identity
Open Terminal and run:
```bash
security find-identity -v -p codesigning
```

You'll see output like:
```
1) A1B2C3D4E5F6... "Developer ID Application: Your Name (A1B2C3D4E5)"
```

The part in quotes is your `APPLE_IDENTITY`.

### 4.3 Your Apple ID
- This is the email address you use to sign into your Apple Developer account
- Use this as `APPLE_ID`

### 4.4 Generate App-Specific Password
1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. In **"Security"** section, click **"App-Specific Passwords"**
4. Click **"Generate an app-specific password"**
5. Enter a label like "Electron App Notarization"
6. Copy the generated password - use this as `APPLE_PASSWORD`

**⚠️ Important:** This is NOT your regular Apple ID password! It's a special 16-character password just for this app.

## Step 5: Set Environment Variables

Create a `.env` file in your project root or set these in your system:

```bash
# Your Apple Developer credentials
export APPLE_IDENTITY="Developer ID Application: Your Name (YOUR_TEAM_ID)"
export APPLE_ID="your-email@example.com"
export APPLE_PASSWORD="your-app-specific-password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

## Step 6: Test Your Setup

### 6.1 Verify Certificate Installation
```bash
# Check if certificate is installed
security find-identity -v -p codesigning
```

### 6.2 Test Build with Signing
```bash
# Build signed version
npm run make:mac:silicon
```

## Costs and Alternatives

### Apple Developer Program Cost
- **$99/year** for Individual account
- **$99/year** for Organization account
- **$299/year** for Enterprise account (rarely needed)

### Free Alternatives (Limited)
If $99/year is too expensive, you have options:

1. **Self-signed certificate** (development only):
   ```bash
   security create-certificate -c "MyCompany" -t 1 -d 365 -s -k ~/Library/Keychains/login.keychain
   export APPLE_IDENTITY="MyCompany"
   ```

2. **Distribute unsigned with user instructions** (current approach):
   - Users run: `sudo xattr -rd com.apple.quarantine "App.app"`
   - Include clear instructions in your documentation

## Troubleshooting

### Common Issues:

1. **"No identities found"**
   - Make sure you downloaded and installed the certificate
   - Check Keychain Access → My Certificates

2. **"Invalid Apple ID or password"**
   - Use app-specific password, not your regular Apple ID password
   - Generate a new app-specific password if needed

3. **"Team ID not found"**
   - Make sure you're enrolled in Apple Developer Program
   - Check the Membership section in developer portal

### Debug Commands:
```bash
# List all certificates
security find-identity -v

# Check keychain contents
open /Applications/Utilities/Keychain\ Access.app

# Test notarization (after building)
xcrun altool --notarization-history 0 -u "$APPLE_ID" -p "$APPLE_PASSWORD"
```

## Summary

To get your credentials:
1. **Apple ID**: Your existing or new Apple ID email
2. **Apple Password**: Generate app-specific password at appleid.apple.com
3. **Team ID**: Found in Apple Developer portal → Membership
4. **Certificate Identity**: Create certificate, then find with `security find-identity`

**Total setup time**: 1-2 hours (plus approval wait time)  
**Annual cost**: $99 for proper code signing, or $0 for workarounds 