# Secure Remote Browser - Complete Setup Guide

## 🎯 Overview

This guide will walk you through setting up the Secure Remote Browser Platform step-by-step. This is an Electron application that provides secure, VPN-routed access to SharePoint documents with vault-managed credentials.

### What This Application Does
- **Secure Browsing**: All web traffic is routed through Australian VPN servers
- **Automatic Login**: Automatically logs into SharePoint using stored credentials
- **No Downloads**: Prevents any files from being downloaded to your local machine
- **View-Only Access**: You can only view documents, not save them locally
- **Fail-Safe Security**: If VPN disconnects, the browser stops working immediately

### Architecture Overview
- **Frontend**: React + TypeScript + Electron (the user interface)
- **VPN**: Australian-based routing for all browser traffic (ensures compliance)
- **Vault**: Secure credential management (stores SharePoint passwords safely)
- **SharePoint**: Automated credential injection (logs you in automatically)
- **Security**: Fail-closed VPN, download blocking, view-only access

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For version control
- **Internet Connection**: Stable broadband connection

### Required Accounts & Services
1. **VPN Provider Account** (choose one):
   - NordLayer (Enterprise - Recommended)
   - ExpressVPN (Reliable option)
   - WireGuard + Australian VPS (Cost-effective)

2. **Vault Service** (choose one):
   - HashiCorp Vault (Enterprise - Recommended)
   - AWS Secrets Manager
   - Azure Key Vault
   - 1Password Business (Alternative)

3. **SharePoint Access**:
   - SharePoint tenant URL
   - Service account credentials
   - Document library access

## 🚀 Step 1: Initial Setup

### 1.1 Download and Install Required Software

**Install Node.js:**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the prompts
4. Open a terminal/command prompt and verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers like `v18.17.0` and `9.6.7`

**Install Git:**
1. Go to https://git-scm.com/
2. Download Git for your operating system
3. Run the installer with default settings
4. Verify installation:
   ```bash
   git --version
   ```

### 1.2 Get the Application Code

**Option A: If you have the code already**
1. Open terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd /path/to/secure-remote-browser
   ```

**Option B: If you need to clone from Git**
1. Open terminal/command prompt
2. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd secure-remote-browser
   ```

### 1.3 Install Application Dependencies

**Install all required packages:**
```bash
# This will install all the packages needed for the application
npm install
```

**Wait for installation to complete** (this may take 2-5 minutes)

### 1.4 Create Configuration File

**Create the environment file:**

**On Windows:**
```cmd
# Create the .env file
echo. > .env
```

**On Mac/Linux:**
```bash
touch .env
```

**Open the .env file in a text editor** (Notepad, VS Code, etc.) - we'll fill this in later steps.

## 🔐 Step 2: VPN Configuration

**Why we need VPN:** Your browsing must appear to come from Australia for compliance reasons. We'll set up a VPN that routes all browser traffic through Australian servers.

### 2.1 Choose Your VPN Provider (Pick ONE option)

#### Option A: NordLayer (Easiest for Business) 💼

**What is NordLayer:** A business VPN service with good Australian servers and API access.

**Step-by-step setup:**

1. **Create account:**
   - Go to https://nordlayer.com/
   - Click "Get Started" or "Try for Free"
   - Fill in your business email and create password
   - Choose the plan (they have 7-day free trial)

2. **Get your API key:**
   - Log into your NordLayer dashboard
   - Go to "Settings" → "API"
   - Click "Generate API Key"
   - **IMPORTANT:** Copy this key immediately and save it somewhere safe
   - Example key looks like: `nl_api_abc123def456ghi789`

3. **Find Australian servers:**
   - In the dashboard, go to "Servers"
   - Look for servers in "Australia" 
   - Note down a server ID (looks like `au-server-01` or similar)

4. **Add to your .env file:**
   ```env
   # NordLayer Configuration
   VPN_PROVIDER=nordlayer
   NORDLAYER_API_KEY=nl_api_abc123def456ghi789
   NORDLAYER_SERVER_ID=au-server-01
   VPN_AUTO_CONNECT=true
   ```

#### Option B: ExpressVPN 🌐

**What is ExpressVPN:** A popular consumer VPN with reliable Australian servers.

**Step-by-step setup:**

1. **Create account:**
   - Go to https://www.expressvpn.com/
   - Choose a subscription plan
   - Create account with email and password

2. **Get API access:**
   - Log into your ExpressVPN account
   - Go to "Account Settings" → "API Access"
   - Click "Generate API Key"
   - Copy the key (looks like: `exp_abc123def456`)

3. **Find Australian servers:**
   - In the app or dashboard, look for "Australia" locations
   - Common locations: "Australia - Sydney", "Australia - Melbourne"
   - Note the location ID

4. **Add to your .env file:**
   ```env
   # ExpressVPN Configuration
   VPN_PROVIDER=expressvpn
   EXPRESSVPN_API_KEY=exp_abc123def456
   EXPRESSVPN_LOCATION_ID=australia-sydney
   VPN_AUTO_CONNECT=true
   ```

#### Option C: WireGuard + Australian VPS (Advanced) 🔧

**What is this:** Setting up your own VPN server in Australia. Cheaper but requires technical knowledge.

**Step-by-step setup:**

1. **Create Australian VPS:**
   - Go to DigitalOcean, Vultr, or Linode
   - Create account and add payment method
   - Create a new "Droplet" or "Server"
   - Choose location: Australia (Sydney/Melbourne)
   - Choose plan: Basic $5-10/month is enough
   - Select Ubuntu 20.04 LTS

2. **Install WireGuard on server:**
   - SSH into your server: `ssh root@your-server-ip`
   - Run the WireGuard installation script:
     ```bash
     wget https://git.io/wireguard -O wireguard-install.sh
     bash wireguard-install.sh
     ```
   - Follow the prompts to create a client configuration

3. **Download configuration file:**
   - The script will create a `.conf` file
   - Download this file to your computer
   - Save it as `wireguard-australia.conf`

4. **Add to your .env file:**
   ```env
   # WireGuard Configuration
   VPN_PROVIDER=wireguard
   WIREGUARD_CONFIG_PATH=./config/wireguard-australia.conf
   WIREGUARD_ENDPOINT=your-server-ip:51820
   VPN_AUTO_CONNECT=true
   ```

### 2.2 Test Your VPN Setup

**Before continuing, test your VPN:**

1. **Connect to your VPN** using the provider's app
2. **Check your IP location:**
   - Go to https://whatismyipaddress.com/
   - Verify it shows an Australian location
   - If not, try different Australian servers

**Add basic VPN settings to .env file:**
```env
# Basic VPN Settings (add these regardless of provider)
VPN_SERVER_REGION=australia
VPN_AUTO_CONNECT=true
VPN_FAIL_CLOSED=true
```

## 🏦 Step 3: Vault Service Setup

**Why we need Vault:** We need a secure place to store SharePoint passwords. Instead of hardcoding passwords in the application, we store them in a "vault" (secure storage) that the application can access.

### 3.1 Choose Your Vault Provider (Pick ONE option)

#### Option A: HashiCorp Vault Cloud (Recommended for Beginners) ☁️

**What is HashiCorp Vault:** A professional service for storing passwords and secrets securely.

**Step-by-step setup:**

1. **Create HashiCorp Cloud account:**
   - Go to https://portal.cloud.hashicorp.com/
   - Click "Sign Up"
   - Use your business email
   - Verify your email address

2. **Create a Vault cluster:**
   - After logging in, click "Create Vault cluster"
   - Choose "HCP Vault Secrets" (simplest option)
   - Select region: "Australia" or closest to you
   - Choose the free tier to start
   - Give it a name like "sharepoint-vault"
   - Click "Create cluster"
   - **Wait 5-10 minutes** for cluster to be ready

3. **Get your connection details:**
   - Once cluster is ready, click on it
   - Copy the "Cluster URL" (looks like: `https://vault-cluster-abc123.vault.hashicorp.cloud:8200`)
   - Note the "Namespace" (usually `admin`)

4. **Create authentication method:**
   - In the Vault dashboard, go to "Access" → "Auth Methods"
   - Click "Enable new method"
   - Select "AppRole"
   - Enable it with default settings

5. **Set up permissions:**
   - Go to "Policies" → "Create policy"
   - Name it: `sharepoint-policy`
   - Add this policy content:
     ```hcl
     path "secret/data/sharepoint/*" {
       capabilities = ["read"]
     }
     ```
   - Save the policy

6. **Create AppRole for the application:**
   - Go to "Access" → "Auth Methods" → "AppRole"
   - Click "Create role"
   - Role name: `sharepoint-app`
   - Token policies: Select `sharepoint-policy`
   - Save the role

7. **Get your credentials:**
   - Click on the `sharepoint-app` role
   - Copy the "Role ID" (looks like: `12345678-1234-1234-1234-123456789012`)
   - Click "Generate Secret ID"
   - Copy the "Secret ID" (looks like: `87654321-4321-4321-4321-210987654321`)

8. **Add to your .env file:**
   ```env
   # HashiCorp Vault Cloud Configuration
   VAULT_PROVIDER=hashicorp
   VAULT_ADDR=https://vault-cluster-abc123.vault.hashicorp.cloud:8200
   VAULT_NAMESPACE=admin
   VAULT_ROLE_ID=12345678-1234-1234-1234-123456789012
   VAULT_SECRET_ID=87654321-4321-4321-4321-210987654321
   ```

#### Option B: HashiCorp Vault Self-Hosted (Advanced) 🔧

**What is this:** Running your own Vault server. More control but requires technical setup.

**Step-by-step setup:**

1. **Install Vault on your server:**
   ```bash
   # Download Vault
   curl -O https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip
   unzip vault_1.15.0_linux_amd64.zip
   sudo mv vault /usr/local/bin/
   ```

2. **Start Vault in development mode:**
   ```bash
   # Start Vault (development mode - not for production!)
   vault server -dev
   ```
   - This will show you a root token - save it!
   - Keep this terminal open

3. **In a new terminal, configure Vault:**
   ```bash
   # Set Vault address
   export VAULT_ADDR='http://127.0.0.1:8200'
   
   # Login with root token
   vault auth -method=token token=your-root-token-here
   
   # Enable AppRole
   vault auth enable approle
   
   # Create policy
   vault policy write sharepoint-policy - <<EOF
   path "secret/data/sharepoint/*" {
     capabilities = ["read"]
   }
   EOF
   
   # Create AppRole
   vault write auth/approle/role/sharepoint-app \
     token_policies="sharepoint-policy" \
     token_ttl=1h \
     token_max_ttl=4h
   
   # Get credentials
   vault read auth/approle/role/sharepoint-app/role-id
   vault write -f auth/approle/role/sharepoint-app/secret-id
   ```

4. **Add to your .env file:**
   ```env
   # HashiCorp Vault Self-Hosted Configuration
   VAULT_PROVIDER=hashicorp
   VAULT_ADDR=http://127.0.0.1:8200
   VAULT_NAMESPACE=
   VAULT_ROLE_ID=your-role-id-from-above
   VAULT_SECRET_ID=your-secret-id-from-above
   ```

#### Option C: AWS Secrets Manager (For AWS Users) 🟡

**What is AWS Secrets Manager:** Amazon's service for storing passwords and secrets securely.

**Step-by-step setup:**

1. **Create AWS account (if you don't have one):**
   - Go to https://aws.amazon.com/
   - Click "Create an AWS Account"
   - Fill in details and add payment method
   - Choose the free tier

2. **Install AWS CLI on your computer:**
   
   **Windows:**
   - Download from: https://aws.amazon.com/cli/
   - Run the installer
   
   **Mac:**
   ```bash
   brew install awscli
   ```
   
   **Linux:**
   ```bash
   pip install awscli
   ```

3. **Configure AWS credentials:**
   - Go to AWS Console → IAM → Users
   - Create a new user called "sharepoint-app"
   - Create access keys for this user
   - Copy the Access Key ID and Secret Access Key
   
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key  
   # Region: ap-southeast-2 (Australia)
   # Output format: json
   ```

4. **Create IAM policy for secrets access:**
   - Go to AWS Console → IAM → Policies
   - Click "Create policy"
   - Choose JSON tab and paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue",
           "secretsmanager:DescribeSecret"
         ],
         "Resource": "arn:aws:secretsmanager:ap-southeast-2:*:secret:sharepoint/*"
       }
     ]
   }
   ```
   - Name it: `SharePointSecretsRead`
   - Attach this policy to your `sharepoint-app` user

5. **Add to your .env file:**
   ```env
   # AWS Secrets Manager Configuration
   VAULT_PROVIDER=aws
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   ```

#### Option D: Azure Key Vault (For Microsoft Users) 🔷

**What is Azure Key Vault:** Microsoft's service for storing passwords and secrets securely.

**Step-by-step setup:**

1. **Create Azure account (if you don't have one):**
   - Go to https://azure.microsoft.com/
   - Click "Start free"
   - Sign up with Microsoft account

2. **Install Azure CLI:**
   
   **Windows:**
   - Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
   
   **Mac:**
   ```bash
   brew install azure-cli
   ```
   
   **Linux:**
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

3. **Login to Azure:**
   ```bash
   az login
   # This will open a browser window to login
   ```

4. **Create resource group and Key Vault:**
   ```bash
   # Create resource group in Australia
   az group create --name SharePointVault --location australiaeast
   
   # Create Key Vault (name must be globally unique)
   az keyvault create \
     --name sharepoint-secrets-12345 \
     --resource-group SharePointVault \
     --location australiaeast
   ```

5. **Create service principal for app access:**
   ```bash
   # Create service principal
   az ad sp create-for-rbac --name "sharepoint-app" --skip-assignment
   
   # This will output JSON with:
   # - appId (client ID)
   # - password (client secret)  
   # - tenant (tenant ID)
   ```

6. **Give permissions to Key Vault:**
   ```bash
   # Replace with your values from step 5
   az keyvault set-policy \
     --name sharepoint-secrets-12345 \
     --spn YOUR-APP-ID \
     --secret-permissions get list
   ```

7. **Add to your .env file:**
   ```env
   # Azure Key Vault Configuration
   VAULT_PROVIDER=azure
   AZURE_TENANT_ID=your-tenant-id
   AZURE_CLIENT_ID=your-app-id
   AZURE_CLIENT_SECRET=your-password
   AZURE_VAULT_URL=https://sharepoint-secrets-12345.vault.azure.net/
   ```

### 3.2 Configure Vault in Environment

Add to your `.env` file:

```env
# Vault Configuration
VAULT_PROVIDER=hashicorp  # or aws, azure, onepassword

# HashiCorp Vault
VAULT_ADDR=https://your-vault-cluster.vault.hashicorp.cloud:8200
VAULT_NAMESPACE=admin
VAULT_ROLE_ID=your_role_id
VAULT_SECRET_ID=your_secret_id

# AWS Secrets Manager
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Azure Key Vault
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_VAULT_URL=https://sharepointsecrets.vault.azure.net/
```

## 📁 Step 4: SharePoint Configuration

**Why we need SharePoint setup:** We need to configure the application to automatically log into your company's SharePoint and access documents without you having to enter passwords each time.

### 4.1 Gather SharePoint Information

**Contact your IT administrator and ask for:**

1. **SharePoint Tenant URL:**
   - This is your company's SharePoint address
   - Examples: 
     - `https://yourcompany.sharepoint.com`
     - `https://companyname.sharepoint.com`
     - `https://companyname-admin.sharepoint.com`

2. **Document Library URLs:**
   - Specific SharePoint libraries you need access to
   - Examples:
     - `https://yourcompany.sharepoint.com/sites/Documents`
     - `https://yourcompany.sharepoint.com/sites/HR/Documents`
     - `https://yourcompany.sharepoint.com/sites/Finance/Shared Documents`

3. **Service Account Credentials:**
   - A dedicated SharePoint account for the application (NOT your personal account)
   - This should be a service account like: `sharepoint-service@yourcompany.com`
   - The password for this account
   - **Important:** This account needs read access to the document libraries

**Test the credentials manually:**
1. Open a browser
2. Go to your SharePoint URL
3. Login with the service account credentials
4. Verify you can access the document libraries
5. **If login fails, contact IT to fix the account before continuing**

### 4.2 Store SharePoint Credentials in Your Vault

**Choose the method based on which vault you set up in Step 3:**

#### If you chose HashiCorp Vault:

1. **Install Vault CLI (if not already done):**
   ```bash
   # Download appropriate version from https://developer.hashicorp.com/vault/downloads
   # For Windows: download .exe and add to PATH
   # For Mac: brew install vault
   # For Linux: see installation instructions above
   ```

2. **Set up Vault connection:**
   ```bash
   # Set your vault address (replace with your actual vault URL)
   export VAULT_ADDR="https://vault-cluster-abc123.vault.hashicorp.cloud:8200"
   export VAULT_NAMESPACE="admin"
   
   # Login using AppRole (replace with your actual Role ID and Secret ID)
   vault write auth/approle/login \
     role_id="12345678-1234-1234-1234-123456789012" \
     secret_id="87654321-4321-4321-4321-210987654321"
   ```

3. **Store SharePoint credentials:**
   ```bash
   # Store the main credentials (replace with your actual values)
   vault kv put secret/sharepoint/credentials \
     username="sharepoint-service@yourcompany.com" \
     password="your-actual-password" \
     tenant_url="https://yourcompany.sharepoint.com"
   
   # Store domain access levels
   vault kv put secret/sharepoint/domains \
     level1_domains="yourcompany.sharepoint.com,yourcompany-my.sharepoint.com" \
     level2_domains="microsoft.com,office.com,msn.com" \
     level3_enabled="true"
   ```

4. **Verify the secrets were stored:**
   ```bash
   # Check if credentials are readable
   vault kv get secret/sharepoint/credentials
   vault kv get secret/sharepoint/domains
   ```

#### If you chose AWS Secrets Manager:

1. **Store SharePoint credentials:**
   ```bash
   # Create the credentials secret (replace with your actual values)
   aws secretsmanager create-secret \
     --name "sharepoint/credentials" \
     --description "SharePoint service account credentials" \
     --secret-string '{
       "username":"sharepoint-service@yourcompany.com",
       "password":"your-actual-password",
       "tenant_url":"https://yourcompany.sharepoint.com"
     }'
   
   # Create the domains configuration
   aws secretsmanager create-secret \
     --name "sharepoint/domains" \
     --description "SharePoint domain access configuration" \
     --secret-string '{
       "level1_domains":"yourcompany.sharepoint.com,yourcompany-my.sharepoint.com",
       "level2_domains":"microsoft.com,office.com,msn.com",
       "level3_enabled":"true"
     }'
   ```

2. **Verify the secrets were stored:**
   ```bash
   # Check if credentials are readable
   aws secretsmanager get-secret-value --secret-id "sharepoint/credentials"
   aws secretsmanager get-secret-value --secret-id "sharepoint/domains"
   ```

#### If you chose Azure Key Vault:

1. **Store SharePoint credentials:**
   ```bash
   # Store individual secrets (replace with your actual values)
   az keyvault secret set \
     --vault-name sharepoint-secrets-12345 \
     --name sharepoint-username \
     --value "sharepoint-service@yourcompany.com"
   
   az keyvault secret set \
     --vault-name sharepoint-secrets-12345 \
     --name sharepoint-password \
     --value "your-actual-password"
   
   az keyvault secret set \
     --vault-name sharepoint-secrets-12345 \
     --name sharepoint-tenant-url \
     --value "https://yourcompany.sharepoint.com"
   
   # Store domain configurations
   az keyvault secret set \
     --vault-name sharepoint-secrets-12345 \
     --name level1-domains \
     --value "yourcompany.sharepoint.com,yourcompany-my.sharepoint.com"
   
   az keyvault secret set \
     --vault-name sharepoint-secrets-12345 \
     --name level2-domains \
     --value "microsoft.com,office.com,msn.com"
   ```

2. **Verify the secrets were stored:**
   ```bash
   # Check if secrets are readable
   az keyvault secret show --vault-name sharepoint-secrets-12345 --name sharepoint-username
   az keyvault secret show --vault-name sharepoint-secrets-12345 --name sharepoint-password
   ```

### 4.3 Configure SharePoint Settings in .env File

**Now add SharePoint configuration to your .env file:**

**Open your .env file** (created in Step 1.4) and add these settings:

```env
# SharePoint Configuration (replace with your actual values)
SHAREPOINT_TENANT_URL=https://yourcompany.sharepoint.com
SHAREPOINT_AUTO_LOGIN=true
SHAREPOINT_DEFAULT_ACCESS_LEVEL=1

# Document Libraries - add the URLs you got from IT (comma-separated, no spaces)
SHAREPOINT_DOCUMENT_LIBRARIES=https://yourcompany.sharepoint.com/sites/Documents,https://yourcompany.sharepoint.com/sites/HR/Documents

# Access Level Domains (these control what websites users can visit)
# Level 1: Only SharePoint domains
LEVEL1_DOMAINS=yourcompany.sharepoint.com,yourcompany-my.sharepoint.com
# Level 2: SharePoint + Microsoft domains
LEVEL2_DOMAINS=microsoft.com,office.com,msn.com,live.com
# Level 3: Full browsing (all websites through VPN)
LEVEL3_ENABLED=true
```

**What these settings mean:**
- `SHAREPOINT_TENANT_URL`: Your main SharePoint address
- `SHAREPOINT_AUTO_LOGIN=true`: Automatically log in using stored credentials
- `SHAREPOINT_DEFAULT_ACCESS_LEVEL=1`: Start users with Level 1 access (SharePoint only)
- `SHAREPOINT_DOCUMENT_LIBRARIES`: Specific libraries users can access
- `LEVEL1_DOMAINS`: Only these domains work for Level 1 users
- `LEVEL2_DOMAINS`: Additional domains for Level 2 users
- `LEVEL3_ENABLED=true`: Allow Level 3 (full internet) access

## ⚙️ Step 5: Complete Your Environment Configuration

### 5.1 Create Your Complete .env File

**Time to put it all together!** Open your `.env` file and make sure it contains all the settings from the previous steps.

**Your complete `.env` file should look like this example:**

```env
# ================================
# APPLICATION SETTINGS
# ================================
NODE_ENV=production
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
# Choose ONE of the VPN options below based on what you set up in Step 2
# ================================

# Option A: If you chose NordLayer
VPN_PROVIDER=nordlayer
VPN_SERVER_REGION=australia
VPN_AUTO_CONNECT=true
VPN_FAIL_CLOSED=true
NORDLAYER_API_KEY=nl_api_abc123def456ghi789
NORDLAYER_SERVER_ID=au-server-01

# Option B: If you chose ExpressVPN (comment out NordLayer above)
# VPN_PROVIDER=expressvpn
# VPN_SERVER_REGION=australia
# VPN_AUTO_CONNECT=true
# VPN_FAIL_CLOSED=true
# EXPRESSVPN_API_KEY=exp_abc123def456
# EXPRESSVPN_LOCATION_ID=australia-sydney

# Option C: If you chose WireGuard (comment out others above)
# VPN_PROVIDER=wireguard
# VPN_SERVER_REGION=australia
# VPN_AUTO_CONNECT=true
# VPN_FAIL_CLOSED=true
# WIREGUARD_CONFIG_PATH=./config/wireguard-australia.conf
# WIREGUARD_ENDPOINT=your-server-ip:51820

# ================================
# VAULT CONFIGURATION
# Choose ONE of the vault options below based on what you set up in Step 3
# ================================

# Option A: If you chose HashiCorp Vault
VAULT_PROVIDER=hashicorp
VAULT_ADDR=https://vault-cluster-abc123.vault.hashicorp.cloud:8200
VAULT_NAMESPACE=admin
VAULT_ROLE_ID=12345678-1234-1234-1234-123456789012
VAULT_SECRET_ID=87654321-4321-4321-4321-210987654321

# Option B: If you chose AWS Secrets Manager (comment out HashiCorp above)
# VAULT_PROVIDER=aws
# AWS_REGION=ap-southeast-2
# AWS_ACCESS_KEY_ID=your-access-key-id
# AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Option C: If you chose Azure Key Vault (comment out others above)
# VAULT_PROVIDER=azure
# AZURE_TENANT_ID=your-tenant-id
# AZURE_CLIENT_ID=your-app-id
# AZURE_CLIENT_SECRET=your-password
# AZURE_VAULT_URL=https://sharepoint-secrets-12345.vault.azure.net/

# ================================
# SHAREPOINT CONFIGURATION
# Replace with your actual company details from Step 4
# ================================
SHAREPOINT_TENANT_URL=https://yourcompany.sharepoint.com
SHAREPOINT_AUTO_LOGIN=true
SHAREPOINT_DEFAULT_ACCESS_LEVEL=1
SHAREPOINT_DOCUMENT_LIBRARIES=https://yourcompany.sharepoint.com/sites/Documents,https://yourcompany.sharepoint.com/sites/HR/Documents

# ================================
# ACCESS CONTROL LEVELS
# Replace "yourcompany" with your actual company name
# ================================
# Level 1: Only SharePoint domains
LEVEL1_DOMAINS=yourcompany.sharepoint.com,yourcompany-my.sharepoint.com
# Level 2: SharePoint + Microsoft domains
LEVEL2_DOMAINS=microsoft.com,office.com,msn.com,live.com,microsoftonline.com
# Level 3: Full browsing (all websites through VPN)
LEVEL3_ENABLED=true

# ================================
# LOGGING SETTINGS
# ================================
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

### 5.2 Important: Customize Your .env File

**⚠️ CRITICAL: Replace the example values with your actual information:**

1. **Replace `yourcompany`** with your actual company name everywhere
2. **Replace API keys** with the real keys from your VPN provider
3. **Replace vault credentials** with your actual vault credentials
4. **Replace SharePoint URLs** with your actual SharePoint URLs
5. **Comment out** the sections you're NOT using (add `#` at the beginning of the line)

**Example of what to replace:**
- `yourcompany.sharepoint.com` → `acmecorp.sharepoint.com`
- `nl_api_abc123def456ghi789` → Your actual NordLayer API key
- `12345678-1234-1234-1234-123456789012` → Your actual Vault Role ID

### 5.3 Create Logs Directory

**Create a folder for application logs:**

**On Windows:**
```cmd
mkdir logs
```

**On Mac/Linux:**
```bash
mkdir logs
```

### 5.4 Build the Application

**Now let's build the application:**

```bash
# First, build the React frontend
npm run build
```

**Wait for this to complete** (may take 1-2 minutes)

**If you see any errors here, STOP and fix them before continuing**

## 🚀 Step 6: Running the Application

### 6.1 First Run - Development Mode

**Let's test the application in development mode first:**

```bash
# Start the application in development mode
npm run dev
```

**What should happen:**
1. You'll see log messages in the terminal
2. The application window should open
3. You should see the dashboard with VPN and Vault status indicators
4. If everything is configured correctly, you should see:
   - ✅ VPN Status: Connected (Australia)
   - ✅ Vault Status: Connected
   - Browser window ready for use

**If the application doesn't start or shows errors:**
1. Read the error messages carefully
2. Check your .env file for typos
3. Verify your VPN and Vault credentials
4. See the Troubleshooting section below

### 6.2 Testing Basic Functionality

**Once the application starts successfully:**

1. **Test VPN Connection:**
   - Look for the VPN status indicator in the dashboard
   - It should show "Connected" and display an Australian IP address
   - If it shows "Disconnected", check your VPN provider settings

2. **Test Vault Connection:**
   - Look for the Vault status indicator
   - It should show "Connected"
   - If it shows "Failed", check your vault credentials

3. **Test SharePoint Access:**
   - Click on the browser area
   - Navigate to your SharePoint URL
   - The application should automatically log you in
   - If login fails, check your stored SharePoint credentials

### 6.3 Building for Production (Optional)

**If everything works in development mode, you can build a production version:**

```bash
# Build the application for distribution
npm run dist
```

**This will create executable files in the `dist` folder:**
- **Windows**: `dist/Secure Remote Browser Setup 1.0.0.exe`
- **Mac**: `dist/Secure Remote Browser-1.0.0.dmg`
- **Linux**: `dist/Secure Remote Browser-1.0.0.AppImage`

**To run the production version:**

**Windows:**
```cmd
# Install and run the setup file
./dist/Secure Remote Browser Setup 1.0.0.exe
```

**Mac:**
```bash
# Open the DMG file and drag to Applications
open "./dist/Secure Remote Browser-1.0.0.dmg"
```

**Linux:**
```bash
# Make executable and run
chmod +x "./dist/Secure Remote Browser-1.0.0.AppImage"
"./dist/Secure Remote Browser-1.0.0.AppImage"
```

## 🔍 Step 7: Verification & Testing

### 7.1 Initial Checks

1. **Application Startup**:
   - Application launches without errors
   - Dashboard loads with VPN status indicator
   - Vault connection status shows as connected

2. **VPN Verification**:
   - Check VPN status indicator (should show Australian IP)
   - Verify fail-closed behavior (DevTools blocked until VPN connects)
   - Test VPN reconnection handling

3. **Vault Verification**:
   - Vault connection indicator shows green
   - Credentials are retrieved successfully
   - Test credential refresh mechanism

4. **SharePoint Integration**:
   - Navigate to SharePoint URL
   - Verify automatic login works
   - Test document viewing capabilities

### 7.2 Security Testing

```bash
# Test VPN fail-closed behavior
# Disconnect VPN and verify browser blocks access

# Test download blocking
# Try to download a file and verify it's blocked

# Test domain restrictions
# Try accessing non-whitelisted domains (should be blocked for Level 1/2 users)
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. VPN Connection Failed
```
Error: VPN connection to Australian server failed
```
**Solution**:
- Check VPN provider credentials in `.env`
- Verify Australian server availability
- Check internet connection
- Review VPN provider dashboard for account status

#### 2. Vault Authentication Failed
```
Error: Failed to authenticate with vault
```
**Solution**:
- Verify vault credentials in `.env`
- Check vault server accessibility
- Confirm AppRole/IAM permissions
- Test vault connection manually

#### 3. SharePoint Auto-Login Failed
```
Error: Could not inject SharePoint credentials
```
**Solution**:
- Verify SharePoint credentials in vault
- Check SharePoint tenant URL
- Confirm service account permissions
- Test manual SharePoint login

#### 4. Application Won't Start
```
Error: Electron failed to start
```
**Solution**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild Electron
npm run electron:rebuild

# Check for TypeScript errors
npm run type-check
```

### Debug Mode

Enable debug mode for detailed logging:

```env
# Add to .env file
LOG_LEVEL=debug
DEBUG=true
ELECTRON_ENABLE_LOGGING=true
```

## 📊 Monitoring & Maintenance

### 7.1 Log Files

Monitor application logs:
- **Location**: `./logs/app.log`
- **VPN Status**: Check for Australian IP confirmations
- **Vault Operations**: Monitor credential retrievals
- **Security Events**: Review blocked downloads/access attempts

### 7.2 Health Checks

Regular monitoring points:
- VPN connection status and IP geolocation
- Vault credential refresh cycles
- SharePoint service account validity
- Download blocking effectiveness

## 🔄 Next Steps

### Phase 2 Enhancements
1. **Admin Panel**: Deploy Next.js + Supabase admin interface
2. **User Management**: Implement role-based access controls
3. **Audit Logging**: Enhanced security event logging
4. **Mobile Support**: Progressive Web App features
5. **SSO Integration**: Enterprise authentication

### Production Deployment
1. **Code Signing**: Sign Electron application for distribution
2. **Auto-Updates**: Implement automatic update mechanism
3. **Monitoring**: Set up application performance monitoring
4. **Backup**: Vault backup and disaster recovery plan

## 📞 Support

For technical support:
1. Check troubleshooting section above
2. Review application logs (`./logs/app.log`)
3. Verify all environment variables are correctly set
4. Test individual components (VPN, Vault, SharePoint) separately

## 🔒 Security Notes

- **Never commit `.env` file** to version control
- **Rotate credentials regularly** (every 90 days recommended)
- **Monitor vault access logs** for unauthorized attempts
- **Keep VPN client updated** for latest security patches
- **Regular security audits** of SharePoint permissions

---

**🎉 Congratulations!** 

Your Secure Remote Browser is now configured and ready to provide secure, VPN-routed access to SharePoint documents with vault-managed credentials. The application will automatically handle VPN connections, credential injection, and maintain a secure browsing environment that meets your compliance requirements. 