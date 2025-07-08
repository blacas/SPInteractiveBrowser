# 🔒 Secure Remote Browser Platform

A secure, VPN-routed desktop application built with Electron and React for accessing SharePoint documents through a controlled browser environment.

## 📋 Overview

This application provides secure remote access to SharePoint-hosted documents with the following key features:

- **🌐 Australian VPN Routing**: All browser traffic routed through Australian VPN endpoints
- **🔑 Vault-Managed Credentials**: Shared SharePoint credentials securely managed via vault services
- **📄 View-Only File Access**: Documents viewed in-browser only, never downloaded locally
- **🛡️ Role-Based Access Control**: Three access levels with different browsing permissions
- **⚡ Fail-Closed Security**: Browser access blocked if VPN connection fails

## 🏗️ Architecture

### Core Components

- **Electron Main Process**: Security enforcement, VPN integration, vault communication
- **React Frontend**: User interface, browser controls, authentication
- **Webview Security**: Sandboxed browsing with credential injection
- **Vault Integration**: Secure credential storage and rotation
- **VPN Management**: Australian endpoint connection and monitoring

### Access Levels

| Level | Description | Allowed Domains | SharePoint Access |
|-------|-------------|-----------------|-------------------|
| **1** | Restricted | SharePoint, Office365 only | ✅ View-only |
| **2** | Manager | SharePoint + Whitelisted domains | ✅ View-only |
| **3** | Full Access | All domains (VPN-routed) | ✅ View-only |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Australian VPN service account (NordLayer/ExpressVPN/WireGuard)
- Vault service (HashiCorp Vault/AWS Secrets Manager/Azure KeyVault)
- SharePoint tenant access

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd secure-remote-browser

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# VPN Configuration
VPN_PROVIDER=nordlayer              # nordlayer | expressvpn | wireguard
VPN_ENDPOINT=au-sydney-01.vpn.com   # Australian VPN endpoint
VPN_API_KEY=your-vpn-api-key       # VPN service API key

# Vault Configuration  
VAULT_PROVIDER=hashicorp            # hashicorp | aws-secrets | azure-keyvault
VAULT_ADDR=https://vault.company.com # Vault service URL
VAULT_ROLE_ID=your-role-id          # Vault authentication
VAULT_SECRET_ID=your-secret-id      # Vault authentication

# SharePoint Configuration
SHAREPOINT_TENANT=company.sharepoint.com
SHAREPOINT_LIBRARY=/sites/documents/Shared Documents

# Application Settings
NODE_ENV=development
LOG_LEVEL=info
```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🔧 Configuration

### VPN Provider Setup

#### Option 1: NordLayer (Recommended for Enterprise)
```typescript
// Provides enterprise-grade security with Australian endpoints
vpn: {
  provider: 'nordlayer',
  australianEndpoints: [
    'au-sydney-01.nordlayer.com',
    'au-melbourne-01.nordlayer.com'
  ],
  features: ['enterprise-grade', 'api-integration', 'fail-safe']
}
```

#### Option 2: ExpressVPN (Reliable Alternative)
```typescript
vpn: {
  provider: 'expressvpn', 
  australianEndpoints: [
    'australia-sydney.expressvpn.com',
    'australia-melbourne.expressvpn.com'
  ],
  features: ['high-speed', 'reliable', 'automation-friendly']
}
```

#### Option 3: WireGuard + Australian VPS (Cost-Effective)
```typescript
vpn: {
  provider: 'wireguard',
  australianEndpoints: ['au-syd-wg.yourdomain.com'],
  features: ['full-control', 'cost-effective', 'high-performance']
}
```

### Vault Provider Setup

#### HashiCorp Vault (Recommended)
```bash
# Enable AppRole authentication
vault auth enable approle

# Create policy for SharePoint secrets
vault policy write sharepoint-policy - <<EOF
path "secret/data/sharepoint" {
  capabilities = ["read"]
}
path "secret/data/sharepoint-config" {
  capabilities = ["read"]  
}
EOF

# Create role
vault write auth/approle/role/secure-browser \
    token_policies="sharepoint-policy" \
    token_ttl=1h \
    token_max_ttl=4h
```

#### Store SharePoint Credentials
```bash
# Store shared SharePoint credentials
vault kv put secret/sharepoint \
    username="sharepoint-service@company.com" \
    password="secure-password-from-vault"

# Store SharePoint configuration
vault kv put secret/sharepoint-config \
    tenantUrl="https://company.sharepoint.com" \
    libraryPath="/sites/documents/Shared Documents" \
    allowedFileTypes="pdf,docx,xlsx,pptx"
```

## 🛡️ Security Features

### Browser Security
- ✅ **Context Isolation**: Webview runs in isolated context
- ✅ **No Local Downloads**: Files cannot be saved to local machine
- ✅ **HTTPS Enforcement**: HTTP requests blocked (except localhost)
- ✅ **Header Security**: Security headers injected automatically
- ✅ **DevTools Disabled**: Production builds disable developer tools

### VPN Security
- ✅ **Fail-Closed**: Browser blocked if VPN disconnects
- ✅ **Australian Exit Points**: All traffic originates from Australia
- ✅ **Connection Monitoring**: Real-time VPN status tracking
- ✅ **Auto-Reconnection**: Automatic retry on connection failure

### Credential Security  
- ✅ **Vault Management**: Credentials stored securely in vault
- ✅ **Auto-Injection**: SharePoint login automated via vault
- ✅ **Rotation Support**: Credential rotation without app restart
- ✅ **No Local Storage**: Credentials never stored locally

## 🔄 Usage Workflow

1. **App Launch**: User opens Secure Remote Browser
2. **Authentication**: User logs in with personal credentials  
3. **VPN Connection**: Australian VPN automatically established
4. **Vault Access**: SharePoint credentials retrieved from vault
5. **Browser Access**: Controlled browsing based on access level
6. **SharePoint Auto-Login**: Vault credentials auto-injected
7. **Document Viewing**: PDFs and documents viewed in-browser only

## 📊 Monitoring & Logging

### VPN Status Monitoring
```typescript
// Real-time VPN status in UI
vpnStatus: "connected" | "connecting" | "disconnected" | "failed"

// Australian IP verification
connection: {
  endpoint: "au-sydney-01.vpn.com",
  location: "Sydney, Australia", 
  ipAddress: "203.219.252.100",
  latency: 45
}
```

### Security Logging
```typescript
// Navigation attempts logged
navigationAttempt: {
  url: "https://example.com",
  timestamp: new Date(),
  allowed: false,
  accessLevel: 1,
  vpnActive: true
}
```

## 🎯 Development Roadmap

### Phase 1: MVP (Current)
- [x] Basic browser with access controls
- [x] VPN integration framework  
- [x] Vault service architecture
- [x] SharePoint credential injection
- [ ] Real VPN provider integration
- [ ] Production vault deployment

### Phase 2: Admin Panel
- [ ] Next.js + Supabase admin application
- [ ] User management interface
- [ ] Role assignment controls  
- [ ] System monitoring dashboard

### Phase 3: Enhanced Security
- [ ] Certificate pinning
- [ ] Advanced audit logging
- [ ] Real-time threat detection
- [ ] Compliance reporting

## 🔍 Troubleshooting

### VPN Connection Issues
```bash
# Check VPN status
curl -X GET "${VPN_API_ENDPOINT}/status" \
  -H "Authorization: Bearer ${VPN_API_KEY}"

# Test Australian IP
curl https://ipapi.co/json
```

### Vault Access Issues  
```bash
# Test vault connectivity
vault status

# Verify credentials
vault kv get secret/sharepoint
```

### SharePoint Access Issues
- Verify tenant URL in configuration
- Check shared credentials in vault
- Confirm library permissions
- Test SharePoint URL manually

## 📞 Support & Configuration

For VPN and Vault provider recommendations based on your infrastructure:

- **Enterprise Setup**: HashiCorp Vault + NordLayer
- **AWS Native**: AWS Secrets Manager + ExpressVPN  
- **Cost-Effective**: Custom Vault + WireGuard
- **Azure Native**: Azure KeyVault + ExpressVPN

---

**🔒 Security Notice**: This application is designed for secure document access. All traffic is routed through Australian VPN endpoints, and documents are never downloaded to local machines. Ensure proper vault and VPN configuration before production deployment.
