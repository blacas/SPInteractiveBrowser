// Application Configuration
// Based on project requirements and user specifications

export const APP_CONFIG = {
  // VPN Configuration
  vpn: {
    // Recommended Australian VPN providers
    providers: {
      nordlayer: {
        name: 'NordLayer',
        australianEndpoints: [
          'au-sydney-01.nordlayer.com',
          'au-melbourne-01.nordlayer.com',
          'au-brisbane-01.nordlayer.com'
        ],
        apiEndpoint: 'https://api.nordlayer.com',
        features: ['enterprise-grade', 'api-integration', 'fail-safe']
      },
      expressvpn: {
        name: 'ExpressVPN',
        australianEndpoints: [
          'australia-sydney.expressvpn.com',
          'australia-melbourne.expressvpn.com',
          'australia-perth.expressvpn.com'
        ],
        apiEndpoint: 'https://api.expressvpn.com',
        features: ['high-speed', 'reliable', 'automation-friendly']
      },
      wireguard: {
        name: 'WireGuard + Australian VPS',
        australianEndpoints: [
          'au-syd-wg.yourdomain.com',
          'au-mel-wg.yourdomain.com'
        ],
        apiEndpoint: 'custom',
        features: ['full-control', 'cost-effective', 'high-performance']
      }
    },
    // Default provider (can be changed based on setup)
    defaultProvider: 'nordlayer',
    
    // VPN Settings
    settings: {
      autoConnect: true,
      failClosed: true, // Block browser if VPN fails
      retryAttempts: 3,
      healthCheckInterval: 30000, // 30 seconds
      connectionTimeout: 10000 // 10 seconds
    }
  },

  // Vault Configuration for SharePoint Credentials
  vault: {
    // Recommended vault providers
    providers: {
      hashicorp: {
        name: 'HashiCorp Vault', 
        recommended: true,
        features: ['enterprise-grade', 'api-friendly', 'rotation-support'],
        authMethods: ['approle', 'aws-iam', 'azure-ad']
      },
      'aws-secrets': {
        name: 'AWS Secrets Manager',
        recommended: true,
        features: ['aws-native', 'auto-rotation', 'iam-integration'],
        authMethods: ['iam-role', 'access-key']
      },
      '1password': {
        name: '1Password Connect',
        recommended: false,
        features: ['user-friendly', 'team-oriented'],
        authMethods: ['connect-token']
      },
      'azure-keyvault': {
        name: 'Azure Key Vault',
        recommended: true,
        features: ['azure-native', 'ad-integration', 'compliance'],
        authMethods: ['managed-identity', 'service-principal']
      }
    },
    
    // Default vault provider
    defaultProvider: 'hashicorp',
    
    // Vault settings
    settings: {
      secretPaths: {
        sharepoint: 'secret/sharepoint',
        sharepointConfig: 'secret/sharepoint-config'
      },
      rotationInterval: 86400000, // 24 hours in milliseconds
      cacheTTL: 3600000 // 1 hour cache for credentials
    }
  },

  // SharePoint Configuration
  sharepoint: {
    // Shared credentials approach (as specified by user)
    credentialMode: 'shared', // vs 'individual'
    
    // Default SharePoint settings
    defaultTenant: 'your-tenant.sharepoint.com',
    defaultLibrary: '/sites/documents/Shared Documents',
    
    // File handling (downloads enabled for SharePoint files)
    fileAccess: {
      allowDownload: true, // Enable downloads for SharePoint files
      allowPrint: false, // Prevent printing to maintain security
      viewOnly: false, // Allow downloads while maintaining security
      supportedTypes: ['pdf', 'docx', 'xlsx', 'pptx', 'txt']
    },
    
    // Auto-login settings
    autoLogin: {
      enabled: true,
      injectCredentials: true,
      retryAttempts: 2,
      timeoutMs: 5000
    }
  },

  // Browser Security Settings
  browser: {
    // Access level configurations (aligned with masterplan.md)
    accessLevels: {
      1: {
        name: 'Restricted',
        description: 'SharePoint-only access',
        allowedDomains: [
          'sharepoint.com',
          'office.com', 
          'microsoftonline.com',
          'microsoft.com'
        ],
        sharepointAccess: true,
        fullBrowsing: false
      },
      2: {
        name: 'Manager', 
        description: 'SharePoint + whitelisted domains',
        allowedDomains: [
          'sharepoint.com',
          'office.com',
          'microsoftonline.com', 
          'microsoft.com',
          'wikipedia.org',
          'github.com',
          'stackoverflow.com',
          'linkedin.com'
        ],
        sharepointAccess: true,
        fullBrowsing: false
      },
      3: {
        name: 'Full Access',
        description: 'Unrestricted browsing (VPN-routed)',
        allowedDomains: ['*'], // All domains
        sharepointAccess: true,
        fullBrowsing: true
      }
    },

    // Security settings
    security: {
      preventLocalDownloads: true,
      disableDevTools: true, // Production setting
      contextIsolation: true,
      webSecurity: true,
      allowPopups: false,
      sandbox: true
    },

    // User agent for SharePoint compatibility
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // Admin Panel Configuration (separate Next.js app)
  adminPanel: {
    // This will be a separate project
    framework: 'nextjs',
    backend: 'supabase',
    features: [
      'user-management',
      'role-assignment', 
      'access-level-control',
      'audit-logging',
      'system-monitoring'
    ],
    
    // Integration endpoints
    api: {
      baseUrl: process.env.ADMIN_API_URL || 'http://localhost:3001',
      authToken: process.env.ADMIN_API_TOKEN
    }
  },

  // Application Settings
  app: {
    name: 'Aussie Vault Browser',
    version: '1.0.0',
    
    // Environment settings
    environment: process.env.NODE_ENV || 'development',
    
    // Logging
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      auditEnabled: true,
      includeNavigation: true
    },

    // Session settings
    session: {
      timeout: 8 * 60 * 60 * 1000, // 8 hours
      extendOnActivity: true,
      requireReauth: false
    }
  }
};

// Utility functions for configuration access
export const getVPNConfig = () => APP_CONFIG.vpn;
export const getVaultConfig = () => APP_CONFIG.vault; 
export const getSharePointConfig = () => APP_CONFIG.sharepoint;
export const getBrowserConfig = () => APP_CONFIG.browser;
export const getAccessLevelConfig = (level: 1 | 2 | 3) => APP_CONFIG.browser.accessLevels[level];

// VPN Provider Recommendations
export const VPN_RECOMMENDATIONS = {
  enterprise: {
    primary: 'nordlayer',
    reason: 'Best enterprise features, Australian presence, API integration'
  },
  costEffective: {
    primary: 'wireguard',
    reason: 'Full control, custom setup, lower costs for high usage'
  },
  simplicity: {
    primary: 'expressvpn',
    reason: 'Reliable, good Australian servers, easy automation'
  }
};

// Vault Provider Recommendations  
export const VAULT_RECOMMENDATIONS = {
  enterprise: {
    primary: 'hashicorp',
    reason: 'Industry standard, excellent API, credential rotation'
  },
  awsNative: {
    primary: 'aws-secrets',
    reason: 'Native AWS integration, IAM-based security'
  },
  azureNative: {
    primary: 'azure-keyvault', 
    reason: 'Native Azure integration, AD-based security'
  }
}; 