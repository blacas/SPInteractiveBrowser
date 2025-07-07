# 1Password Vault Setup Guide for Secure Remote Browser

## 🎯 Overview

This guide will walk you through setting up 1Password Business as your vault service for the Secure Remote Browser. You'll get both automatic SharePoint login AND the familiar 1Password browser extension experience.

### What You'll Have After Setup:
- ✅ **Automatic SharePoint Login** - No passwords needed, completely invisible
- ✅ **1Password Extension** - Familiar UI for all other websites  
- ✅ **Secure Credential Management** - IT controls SharePoint access
- ✅ **Best User Experience** - Works like any normal browser

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Active internet connection
- ✅ Admin access to create business accounts
- ✅ SharePoint service account credentials
- ✅ Credit card for 1Password Business (14-day free trial available)

---

## 🚀 Step 1: Create 1Password Business Account

### 1.1 Sign Up for 1Password Business

1. **Open your web browser** and go to: https://1password.com/business/
2. **Click "Get started"** (big blue button)
3. **Choose "1Password Business"** plan
4. **Fill in your information:**
   - Business email address
   - Your name
   - Company name
   - Password (make it strong!)
5. **Click "Create account"**
6. **Check your email** and click the verification link

### 1.2 Complete Initial Setup

1. **Download 1Password app** when prompted (optional but recommended)
2. **Save your Secret Key** - This is CRITICAL! 
   - Copy it to a safe place
   - You'll need this to access your account
3. **Set up your Master Password**
4. **Complete the setup wizard**

---

## 🔐 Step 2: Set Up 1Password Connect

### 2.1 What is 1Password Connect?

1Password Connect is a secure API server that allows applications to access your 1Password vaults without user interaction. This is what enables automatic SharePoint login.

### 2.2 Deploy 1Password Connect (Easiest Method)

**Option A: Using Docker (Recommended)**

1. **Install Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Download and install for your operating system
   - Start Docker Desktop

2. **Create 1Password Connect credentials:**
   - Log into your 1Password Business account
   - Go to **"Integrations"** → **"1Password Connect"**
   - Click **"Deploy 1Password Connect"**
   - Choose **"Download credentials file"**
   - Save the file as `1password-credentials.json`

3. **Create a folder for 1Password Connect:**
   ```bash
   # On Windows (PowerShell)
   mkdir C:\1password-connect
   cd C:\1password-connect
   
   # On Mac/Linux
   mkdir ~/1password-connect
   cd ~/1password-connect
   ```

4. **Copy the credentials file:**
   - Move `1password-credentials.json` to the folder you just created

5. **Run 1Password Connect:**
   ```bash
   # Run this command in PowerShell/Terminal
   docker run -d \
     --name onepassword-connect \
     -p 8080:8080 \
     -p 8443:8443 \
     -v ${PWD}/1password-credentials.json:/home/opuser/.op/1password-credentials.json \
     -v ${PWD}/data:/home/opuser/.op/data \
     1password/connect-api:latest
   ```

6. **Verify it's running:**
   ```bash
   # Check if container is running
   docker ps
   
   # You should see "onepassword-connect" in the list
   ```

7. **Test the connection:**
   - Open your browser
   - Go to: http://localhost:8080/health
   - You should see: `{"name":"1Password Connect API","version":"1.x.x"}`

**Option B: Using 1Password Connect Cloud (Alternative)**

1. **In your 1Password Business account:**
   - Go to **"Developer Tools"** → **"1Password Connect"**
   - Choose **"Connect Cloud"** (hosted by 1Password)
   - **Note the Connect Host URL** provided (e.g., `https://your-instance.1password.com`)

---

## 🔑 Step 3: Create Service Account

### 3.1 Create Service Account for the Application

1. **In your 1Password Business account:**
   - Go to **"Service Accounts"** in the left menu
   - Click **"Create Service Account"**

2. **Fill in the details:**
   - **Name:** `SharePoint Secure Browser`
   - **Description:** `Service account for secure browser vault access`
   - **Vault Access:** Select "Specific vaults" (we'll create one next)

3. **Create the vault:**
   - Click **"Create new vault"**
   - **Vault name:** `SharePoint Secrets`
   - **Description:** `Secure storage for SharePoint credentials`
   - **Click "Create vault"**

4. **Set permissions:**
   - **Grant the service account "Read" access** to the `SharePoint Secrets` vault
   - **Click "Create Service Account"**

5. **IMPORTANT - Save your token:**
   - **Copy the service account token** (starts with `ops_`)
   - **Save it immediately** - you won't see it again!
   - Example: `ops_abc123def456ghi789jkl012mno345pqr678stu901vwx234`

---

## 📝 Step 4: Store SharePoint Credentials

### 4.1 Create SharePoint Login Item

1. **Go to your 1Password web interface:**
   - Log into: https://my.1password.com
   - Navigate to the **"SharePoint Secrets"** vault

2. **Create new login item:**
   - Click **"New Item"** → **"Login"**

3. **Fill in basic information:**
   - **Title:** `SharePoint Service Account`
   - **Username:** `your-sharepoint-service@datalifesaver.onmicrosoft.com`
   - **Password:** `your-actual-sharepoint-password`
   - **Website:** `https://datalifesaver.sharepoint.com`

### 4.2 Add Custom Fields for Configuration

**Still in the same item, add these custom fields:**

1. **Click "Add more"** → **"Text"**
   - **Label:** `tenant_url`
   - **Value:** `https://datalifesaver.sharepoint.com`

2. **Add another text field:**
   - **Label:** `level1_domains`
   - **Value:** `datalifesaver.sharepoint.com,sharepoint.com,office365.com`

3. **Add another text field:**
   - **Label:** `level2_domains`
   - **Value:** `microsoft.com,office.com,msn.com,live.com`

4. **Add another text field:**
   - **Label:** `level3_enabled`
   - **Value:** `true`

5. **Save the item**

### 4.3 Get the Item ID

1. **Click on the "SharePoint Service Account" item** you just created
2. **Look at the browser URL** - it will look like:
   `https://my.1password.com/vaults/[vault-id]/items/[item-id]`
3. **Copy the item ID** (the part after `/items/`)
   - Example: `abc123def456ghi789`
4. **Save this ID** - you'll need it for your `.env` file

---

## ⚙️ Step 5: Configure Your Application

### 5.1 Install 1Password CLI (Optional but Helpful)

**Windows:**
1. Go to: https://developer.1password.com/docs/cli/get-started/
2. Download the Windows installer
3. Run the installer

**Mac:**
```bash
brew install --cask 1password-cli
```

**Linux:**
```bash
curl -sS https://downloads.1password.com/linux/keys/1password.asc | gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" | sudo tee /etc/apt/sources.list.d/1password.list
sudo apt update && sudo apt install 1password-cli
```

### 5.2 Test Your Setup (Optional)

**If you installed the CLI, test your connection:**

```bash
# Set environment variables (replace with your actual values)
export OP_CONNECT_HOST=http://localhost:8080
export OP_CONNECT_TOKEN=ops_abc123def456ghi789jkl012mno345pqr678stu901vwx234

# Test connection
curl -H "Authorization: Bearer $OP_CONNECT_TOKEN" \
     "$OP_CONNECT_HOST/v1/health"

# Should return: {"name":"1Password Connect API","version":"1.x.x"}

# Test getting your item (replace with your actual item ID)
curl -H "Authorization: Bearer $OP_CONNECT_TOKEN" \
     "$OP_CONNECT_HOST/v1/items/abc123def456ghi789"

# Should return JSON with your SharePoint credentials
```

---

## 📄 Step 6: Update Your .env File

### 6.1 Your Corrected .env File

**Replace your current `.env` file with this corrected version:**

```env
# ================================
# APPLICATION SETTINGS
# ================================
NODE_ENV=development
APP_NAME=Secure Remote Browser
APP_VERSION=1.0.0

# ================================
# SECURITY SETTINGS
# ================================
SECURITY_BLOCK_DOWNLOADS=true
SECURITY_HTTPS_ONLY=true
SECURITY_FAIL_CLOSED_VPN=true
SECURITY_BLOCK_DEVTOOLS=true

# ================================
# VPN CONFIGURATION
# ================================
VPN_PROVIDER=wireguard
VPN_SERVER_REGION=australia
VPN_AUTO_CONNECT=true
VPN_FAIL_CLOSED=true
WIREGUARD_CONFIG_PATH=./config/wireguard-australia.conf
WIREGUARD_ENDPOINT=134.199.169.102:59926

# ================================
# 1PASSWORD VAULT CONFIGURATION
# ================================
VAULT_PROVIDER=1password

# 1Password Connect Configuration
OP_CONNECT_HOST=http://localhost:8080
OP_CONNECT_TOKEN=ops_abc123def456ghi789jkl012mno345pqr678stu901vwx234
OP_SHAREPOINT_ITEM_ID=abc123def456ghi789

# Extension Integration
ONEPASSWORD_EXTENSION_ENABLED=true
ONEPASSWORD_AUTO_DETECT=true
ONEPASSWORD_EXTENSION_ID=aeblfdkhhhdcdjpifhhbdiojplfjncoa

# ================================
# SHAREPOINT CONFIGURATION
# ================================
SHAREPOINT_TENANT_URL=https://datalifesaver.sharepoint.com
SHAREPOINT_AUTO_LOGIN=true
SHAREPOINT_DEFAULT_ACCESS_LEVEL=1
SHAREPOINT_DOCUMENT_LIBRARIES=https://datalifesaver.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx

# ================================
# ACCESS CONTROL LEVELS
# ================================
# Level 1: Only SharePoint domains
LEVEL1_DOMAINS=datalifesaver.sharepoint.com,sharepoint.com,onedrive.com,office365.com,sharepointonline.com
# Level 2: SharePoint + Microsoft domains  
LEVEL2_DOMAINS=microsoft.com,office.com,msn.com,live.com,microsoftonline.com
# Level 3: Full browsing (all websites through VPN)
LEVEL3_ENABLED=true

# ================================
# LOGGING SETTINGS
# ================================
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# ================================
# SYSTEM SETTINGS (Optional)
# ================================
DIGITAL_OCEAN_PASSWORD=B^BEqm4b9fRgU$3
```

### 6.2 What You Need to Replace

**In the `.env` file above, replace these placeholder values with your actual values:**

1. **OP_CONNECT_TOKEN:** Replace `ops_abc123def456ghi789jkl012mno345pqr678stu901vwx234` with your actual service account token from Step 3
2. **OP_SHAREPOINT_ITEM_ID:** Replace `abc123def456ghi789` with your actual item ID from Step 4.3
3. **If using 1Password Connect Cloud:** Replace `OP_CONNECT_HOST=http://localhost:8080` with your actual Connect Cloud URL

---

## 🏃 Step 7: Run Your Application

### 7.1 Build and Start

```bash
# Make sure you're in your project directory
cd secure-remote-browser

# Install dependencies (if not already done)
npm install

# Build the application
npm run build

# Start the application
npm run dev
```

### 7.2 What You Should See

**If everything is configured correctly:**

1. **VPN Status:** ✅ Connected (Australia)
2. **Vault Status:** ✅ Connected (1Password)
3. **1Password Extension Helper:** Shows installation status
4. **SharePoint Access:** Automatic login when you navigate to SharePoint

---

## 🔧 Step 8: Install 1Password Browser Extension

### 8.1 Automatic Detection

The application will automatically try to detect and load your 1Password extension. If it finds it, you'll see:
- ✅ Green badge: "Installed"
- Version information
- "Best of both worlds" message

### 8.2 Manual Installation (If Needed)

**If the extension isn't automatically detected:**

1. **In the application dashboard, you'll see:**
   - 🟡 Yellow badge: "Not Installed"
   - Installation guide button

2. **Click "Show Installation Guide"**

3. **Follow these steps:**
   - Open Chrome or Edge browser
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Go to Chrome Web Store: https://chromewebstore.google.com/detail/1password-%E2%80%93-password-mana/aeblfdkhhhdcdjpifhhbdiojplfjncoa
   - Click "Add to Chrome/Edge"
   - **Restart your Secure Remote Browser**

4. **Verify installation:**
   - Restart the secure browser
   - Check the 1Password Extension Helper card
   - Should now show "Installed"

---

## ✅ Step 9: Test Everything

### 9.1 Test SharePoint Auto-Login

1. **Navigate to SharePoint:**
   - Click on SharePoint in your browser
   - Go to: `https://datalifesaver.sharepoint.com`

2. **What should happen:**
   - Page loads automatically
   - No password prompts
   - You're already logged in
   - Documents are visible immediately

3. **If it doesn't work:**
   - Check the console for errors
   - Verify your 1Password Connect is running
   - Check your item ID in the `.env` file

### 9.2 Test 1Password Extension

1. **Navigate to another website:**
   - Go to any website with login (gmail.com, etc.)

2. **What should happen:**
   - 1Password extension icon appears in toolbar
   - Click the icon to see your passwords
   - Normal 1Password autofill experience

### 9.3 Test Both Working Together

1. **Try SharePoint** - Should be automatic, no extension popup
2. **Try another site** - Should show extension, manual autofill
3. **Both should work without conflicts**

---

## 🛠️ Troubleshooting

### Issue 1: "1Password Connect not configured"

**Symptoms:** Error in console about Connect not being configured

**Solutions:**
1. Check that Docker container is running: `docker ps`
2. Verify `OP_CONNECT_HOST` and `OP_CONNECT_TOKEN` in `.env` file
3. Test connection: `curl http://localhost:8080/health`

### Issue 2: "Failed to retrieve 1Password secret"

**Symptoms:** SharePoint login fails, credentials not found

**Solutions:**
1. Check that item ID is correct in `.env` file
2. Verify service account has read access to vault
3. Ensure item contains required fields (username, password, etc.)

### Issue 3: Extension not loading

**Symptoms:** Extension shows as "Not Installed" even though it's installed

**Solutions:**
1. Restart the secure browser application
2. Check that 1Password extension is enabled in Chrome/Edge
3. Try manually loading the extension path

### Issue 4: SharePoint URL errors

**Symptoms:** Can't access SharePoint, navigation fails

**Solutions:**
1. Verify SharePoint URL is correct: `https://datalifesaver.sharepoint.com`
2. Check that service account has access to SharePoint
3. Test manual login with the credentials

---

## 🎯 Final Verification

### ✅ Checklist

- [ ] 1Password Business account created
- [ ] 1Password Connect running (Docker container or Cloud)
- [ ] Service account created with proper permissions
- [ ] SharePoint credentials stored in vault with all required fields
- [ ] `.env` file updated with correct values
- [ ] Application builds and starts successfully
- [ ] VPN connects to Australia
- [ ] Vault shows as connected
- [ ] SharePoint auto-login works
- [ ] 1Password extension loads and works for other sites

### 🎉 Success!

You now have a fully functional secure remote browser with:
- 🔐 **Automatic SharePoint login** via 1Password API
- 🧩 **1Password extension** for other websites
- 🔒 **Enterprise-grade security** with VPN and credential management
- 🎯 **Best user experience** - familiar and intuitive

---

## 📞 Support

If you encounter issues:

1. **Check the logs:** `./logs/app.log`
2. **Verify each step:** Go through this guide step by step
3. **Test components individually:** VPN, 1Password Connect, SharePoint access
4. **Check environment variables:** Ensure all values are correct in `.env`

**Common commands for debugging:**

```bash
# Check Docker containers
docker ps

# Check 1Password Connect health
curl http://localhost:8080/health

# View application logs
tail -f ./logs/app.log

# Test SharePoint URL
curl -I https://datalifesaver.sharepoint.com
``` 