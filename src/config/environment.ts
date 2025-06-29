// Environment configuration loader with validation
export interface EnvironmentConfig {
  // Application settings
  nodeEnv: 'development' | 'production' | 'test';
  appName: string;
  appVersion: string;

  // Security settings
  securityBlockDownloads: boolean;
  securityHttpsOnly: boolean;
  securityFailClosedVpn: boolean;
  securityBlockDevtools: boolean;

  // VPN configuration
  vpnProvider: 'wireguard' | 'nordlayer' | 'expressvpn';
  vpnServerRegion: string;
  vpnAutoConnect: boolean;
  vpnFailClosed: boolean;
  wireguardConfigPath?: string;
  wireguardEndpoint?: string;

  // Vault configuration
  vaultProvider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault';
  vaultAddr?: string;
  vaultNamespace?: string;
  vaultRoleId?: string;
  vaultSecretId?: string;

  // SharePoint configuration
  sharepointTenantUrl: string;
  sharepointAutoLogin: boolean;
  sharepointDefaultAccessLevel: 1 | 2 | 3;
  sharepointDocumentLibraries: string[];

  // Access control
  level1Domains: string[];
  level2Domains: string[];
  level3Enabled: boolean;

  // Logging
  logLevel: string;
  logFilePath: string;
}

export class EnvironmentValidator {
  private static requiredVars = [
    'VPN_PROVIDER',
    'VPN_SERVER_REGION', 
    'VAULT_PROVIDER',
    'SHAREPOINT_TENANT_URL'
  ];

  private static vpnRequiredVars = {
    wireguard: ['WIREGUARD_CONFIG_PATH', 'WIREGUARD_ENDPOINT'],
    nordlayer: ['NORDLAYER_API_KEY', 'NORDLAYER_SERVER_ID'],
    expressvpn: ['EXPRESSVPN_API_KEY', 'EXPRESSVPN_LOCATION_ID']
  };

  private static vaultRequiredVars = {
    hashicorp: ['VAULT_ADDR', 'VAULT_ROLE_ID', 'VAULT_SECRET_ID'],
    'aws-secrets': ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
    '1password': ['OP_CONNECT_HOST', 'OP_CONNECT_TOKEN'],
    'azure-keyvault': ['AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_VAULT_URL']
  };

  static validateEnvironment(env: Record<string, string | undefined>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const isDevelopment = env.NODE_ENV !== 'production';

    console.log('🔍 Environment validation starting...', {
      NODE_ENV: env.NODE_ENV,
      VPN_PROVIDER: env.VPN_PROVIDER,
      WIREGUARD_ENDPOINT: env.WIREGUARD_ENDPOINT ? '✅ Set' : '❌ Missing'
    });

    // Essential VPN validation - this is critical for app functionality
    if (env.VPN_PROVIDER === 'wireguard') {
      if (!env.WIREGUARD_CONFIG_PATH) {
        errors.push('WIREGUARD_CONFIG_PATH is required when using WireGuard VPN');
      }
      if (!env.WIREGUARD_ENDPOINT) {
        errors.push('WIREGUARD_ENDPOINT is required when using WireGuard VPN');
      } else if (env.WIREGUARD_ENDPOINT === 'your-server-ip:51820') {
        errors.push('WIREGUARD_ENDPOINT must be set to your actual server IP:port (currently using placeholder)');
      } else {
        console.log('✅ WireGuard configuration looks valid');
      }
    }

    // Lenient validation for other services in development
    if (isDevelopment) {
      // In development, allow placeholder values for non-critical services
      console.log('🔧 Development mode - allowing placeholder values for Vault/SharePoint');
      
      if (env.VAULT_ADDR?.includes('abc123')) {
        warnings.push('Using placeholder Vault URL in development mode');
      }
      if (env.SHAREPOINT_TENANT_URL?.includes('yourcompany')) {
        warnings.push('Using placeholder SharePoint URL in development mode');
      }
      if (env.LEVEL1_DOMAINS?.includes('yourcompany')) {
        warnings.push('Using placeholder domain names in development mode');
      }
    } else {
      // Production validation - more strict
      if (env.VAULT_PROVIDER === 'hashicorp') {
        if (!env.VAULT_ADDR || env.VAULT_ADDR.includes('abc123')) {
          errors.push('VAULT_ADDR must be set to your actual HashiCorp Vault URL in production');
        }
        if (!env.VAULT_ROLE_ID || env.VAULT_ROLE_ID.includes('12345678')) {
          errors.push('VAULT_ROLE_ID must be set to your actual Vault Role ID in production');
        }
        if (!env.VAULT_SECRET_ID || env.VAULT_SECRET_ID.includes('87654321')) {
          errors.push('VAULT_SECRET_ID must be set to your actual Vault Secret ID in production');
        }
      }
      
      if (env.SHAREPOINT_TENANT_URL?.includes('yourcompany')) {
        errors.push('SHAREPOINT_TENANT_URL must be set to your actual SharePoint URL in production');
      }
    }

    console.log('🔍 Validation result:', {
      isValid: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static isValidNodeEnv(value: string | undefined): value is 'development' | 'production' | 'test' {
    return value === 'development' || value === 'production' || value === 'test';
  }

  private static isValidVpnProvider(value: string | undefined): value is 'wireguard' | 'nordlayer' | 'expressvpn' {
    return value === 'wireguard' || value === 'nordlayer' || value === 'expressvpn';
  }

  private static isValidVaultProvider(value: string | undefined): value is 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault' {
    return value === 'hashicorp' || value === 'aws-secrets' || value === '1password' || value === 'azure-keyvault';
  }

  private static isValidAccessLevel(value: string | undefined): value is '1' | '2' | '3' {
    return value === '1' || value === '2' || value === '3';
  }

  private static getDefaultEnvironment(): Record<string, string | undefined> {
    return {
      NODE_ENV: 'development',
      APP_NAME: 'Secure Remote Browser',
      APP_VERSION: '1.0.0',
      VPN_PROVIDER: 'wireguard',
      VPN_SERVER_REGION: 'australia',
      VPN_AUTO_CONNECT: 'true',
      VPN_FAIL_CLOSED: 'true',
      WIREGUARD_CONFIG_PATH: './config/wireguard-australia.conf',
      WIREGUARD_ENDPOINT: '134.199.169.102:59926',
      VAULT_PROVIDER: 'hashicorp',
      SHAREPOINT_TENANT_URL: 'https://yourcompany.sharepoint.com',
      SHAREPOINT_AUTO_LOGIN: 'true',
      SHAREPOINT_DEFAULT_ACCESS_LEVEL: '1',
      SECURITY_BLOCK_DOWNLOADS: 'false',
      SECURITY_HTTPS_ONLY: 'false',
      SECURITY_FAIL_CLOSED_VPN: 'true',
      SECURITY_BLOCK_DEVTOOLS: 'false',
      LOG_LEVEL: 'info',
      LOG_FILE_PATH: './logs/app.log',
      LEVEL1_DOMAINS: 'yourcompany.sharepoint.com',
      LEVEL2_DOMAINS: 'microsoft.com,office.com',
      LEVEL3_ENABLED: 'true'
    };
  }

  static loadEnvironment(): EnvironmentConfig {
    // In Electron renderer, environment variables come through the secure bridge
    let env: Record<string, string | undefined> = {};
    
    // Try to get environment from main process via IPC
    try {
      if (typeof window !== 'undefined' && window.secureBrowser?.system) {
        // Use default environment for now - async loading handled elsewhere
        env = this.getDefaultEnvironment();
        console.log('🚀 Loading environment configuration...');
        console.log('📊 Using secure browser environment defaults');
      } else {
        // Fallback to default environment when not in Electron
        env = this.getDefaultEnvironment();
        console.log('🚀 Loading fallback environment configuration...');
        console.log('📊 Using fallback defaults (not in Electron context)');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load environment via IPC, using defaults:', error);
      env = this.getDefaultEnvironment();
    }

    console.log('📊 Environment configuration:', {
      NODE_ENV: env.NODE_ENV,
      VPN_PROVIDER: env.VPN_PROVIDER,
      WIREGUARD_ENDPOINT: env.WIREGUARD_ENDPOINT ? 'Set ✅' : 'Missing ❌',
      WIREGUARD_CONFIG_PATH: env.WIREGUARD_CONFIG_PATH ? 'Set ✅' : 'Missing ❌'
    });

    const validation = this.validateEnvironment(env);
    
    if (!validation.isValid) {
      const errorMessage = [
        '❌ Environment configuration validation failed:',
        ...validation.errors.map(err => `  • ${err}`),
        '',
        '🔧 For development/testing, you may need to:',
        '  • Ensure WireGuard is properly configured',
        '  • Check that WIREGUARD_ENDPOINT matches your server',
        '  • Verify config file exists at WIREGUARD_CONFIG_PATH',
        '',
        'See the setup documentation for required variables for your chosen providers.'
      ].join('\n');
      
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Environment configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
    }

    console.log('✅ Environment configuration validated successfully');

    return {
      // Application settings
      nodeEnv: this.isValidNodeEnv(env.NODE_ENV) ? env.NODE_ENV : 'development',
      appName: env.APP_NAME || 'Secure Remote Browser',
      appVersion: env.APP_VERSION || '1.0.0',

      // Security settings
      securityBlockDownloads: env.SECURITY_BLOCK_DOWNLOADS === 'true',
      securityHttpsOnly: env.SECURITY_HTTPS_ONLY === 'true',
      securityFailClosedVpn: env.SECURITY_FAIL_CLOSED_VPN === 'true',
      securityBlockDevtools: env.SECURITY_BLOCK_DEVTOOLS === 'true',

      // VPN configuration
      vpnProvider: this.isValidVpnProvider(env.VPN_PROVIDER) ? env.VPN_PROVIDER : 'wireguard',
      vpnServerRegion: env.VPN_SERVER_REGION || 'australia',
      vpnAutoConnect: env.VPN_AUTO_CONNECT === 'true',
      vpnFailClosed: env.VPN_FAIL_CLOSED === 'true',
      wireguardConfigPath: env.WIREGUARD_CONFIG_PATH || './config/wireguard-australia.conf',
      wireguardEndpoint: env.WIREGUARD_ENDPOINT || '134.199.169.102:59926',

      // Vault configuration  
      vaultProvider: this.isValidVaultProvider(env.VAULT_PROVIDER) ? env.VAULT_PROVIDER : 'hashicorp',
      vaultAddr: env.VAULT_ADDR,
      vaultNamespace: env.VAULT_NAMESPACE,
      vaultRoleId: env.VAULT_ROLE_ID,
      vaultSecretId: env.VAULT_SECRET_ID,

      // SharePoint configuration
      sharepointTenantUrl: env.SHAREPOINT_TENANT_URL || '',
      sharepointAutoLogin: env.SHAREPOINT_AUTO_LOGIN === 'true',
      sharepointDefaultAccessLevel: this.isValidAccessLevel(env.SHAREPOINT_DEFAULT_ACCESS_LEVEL) 
        ? parseInt(env.SHAREPOINT_DEFAULT_ACCESS_LEVEL) as 1 | 2 | 3
        : 1,
      sharepointDocumentLibraries: env.SHAREPOINT_DOCUMENT_LIBRARIES?.split(',') || [],

      // Access control
      level1Domains: env.LEVEL1_DOMAINS?.split(',') || [],
      level2Domains: env.LEVEL2_DOMAINS?.split(',') || [],
      level3Enabled: env.LEVEL3_ENABLED === 'true',

      // Logging
      logLevel: env.LOG_LEVEL || 'info',
      logFilePath: env.LOG_FILE_PATH || './logs/app.log'
    };
  }
}

// Async method to load environment from main process
export const loadEnvironmentAsync = async (): Promise<EnvironmentConfig> => {
  try {
    if (typeof window !== 'undefined' && window.secureBrowser?.system?.getEnvironment) {
      console.log('🔄 Loading environment from main process...');
      const envString = await window.secureBrowser.system.getEnvironment();
      const env = JSON.parse(envString);
      
      console.log('✅ Environment loaded from main process');
      console.log('📊 Real environment variables:', {
        NODE_ENV: env.NODE_ENV,
        VPN_PROVIDER: env.VPN_PROVIDER,
        WIREGUARD_ENDPOINT: env.WIREGUARD_ENDPOINT ? 'Set ✅' : 'Missing ❌'
      });
      
      const validation = EnvironmentValidator.validateEnvironment(env);
      
      if (!validation.isValid) {
        console.error('❌ Environment validation failed:', validation.errors);
        throw new Error('Environment validation failed: ' + validation.errors.join(', '));
      }
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Environment warnings:', validation.warnings);
      }
      
      // Create config using the same logic as loadEnvironment but with the env from IPC
      return createConfigFromEnvironment(env);
    } else {
      console.log('📊 Using default environment (no IPC available)');
      return EnvironmentValidator.loadEnvironment();
    }
  } catch (error) {
    console.error('❌ Failed to load environment from main process:', error);
    return EnvironmentValidator.loadEnvironment();
  }
};

// Helper method to create config from environment object (with proper validation)
const createConfigFromEnvironment = (env: Record<string, string | undefined>): EnvironmentConfig => {
  const isValidNodeEnv = (value: string | undefined): value is 'development' | 'production' | 'test' => {
    return value === 'development' || value === 'production' || value === 'test';
  };

  const isValidVpnProvider = (value: string | undefined): value is 'wireguard' | 'nordlayer' | 'expressvpn' => {
    return value === 'wireguard' || value === 'nordlayer' || value === 'expressvpn';
  };

  const isValidVaultProvider = (value: string | undefined): value is 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault' => {
    return value === 'hashicorp' || value === 'aws-secrets' || value === '1password' || value === 'azure-keyvault';
  };

  const isValidAccessLevel = (value: string | undefined): value is '1' | '2' | '3' => {
    return value === '1' || value === '2' || value === '3';
  };

  return {
    // Application settings
    nodeEnv: isValidNodeEnv(env.NODE_ENV) ? env.NODE_ENV : 'development',
    appName: env.APP_NAME || 'Secure Remote Browser',
    appVersion: env.APP_VERSION || '1.0.0',

    // Security settings
    securityBlockDownloads: env.SECURITY_BLOCK_DOWNLOADS === 'true',
    securityHttpsOnly: env.SECURITY_HTTPS_ONLY === 'true',
    securityFailClosedVpn: env.SECURITY_FAIL_CLOSED_VPN === 'true',
    securityBlockDevtools: env.SECURITY_BLOCK_DEVTOOLS === 'true',

    // VPN configuration
    vpnProvider: isValidVpnProvider(env.VPN_PROVIDER) ? env.VPN_PROVIDER : 'wireguard',
    vpnServerRegion: env.VPN_SERVER_REGION || 'australia',
    vpnAutoConnect: env.VPN_AUTO_CONNECT === 'true',
    vpnFailClosed: env.VPN_FAIL_CLOSED === 'true',
    wireguardConfigPath: env.WIREGUARD_CONFIG_PATH || './config/wireguard-australia.conf',
    wireguardEndpoint: env.WIREGUARD_ENDPOINT || '134.199.169.102:59926',

    // Vault configuration  
    vaultProvider: isValidVaultProvider(env.VAULT_PROVIDER) ? env.VAULT_PROVIDER : 'hashicorp',
    vaultAddr: env.VAULT_ADDR,
    vaultNamespace: env.VAULT_NAMESPACE,
    vaultRoleId: env.VAULT_ROLE_ID,
    vaultSecretId: env.VAULT_SECRET_ID,

    // SharePoint configuration
    sharepointTenantUrl: env.SHAREPOINT_TENANT_URL || '',
    sharepointAutoLogin: env.SHAREPOINT_AUTO_LOGIN === 'true',
    sharepointDefaultAccessLevel: isValidAccessLevel(env.SHAREPOINT_DEFAULT_ACCESS_LEVEL) 
      ? parseInt(env.SHAREPOINT_DEFAULT_ACCESS_LEVEL) as 1 | 2 | 3
      : 1,
    sharepointDocumentLibraries: env.SHAREPOINT_DOCUMENT_LIBRARIES?.split(',') || [],

    // Access control
    level1Domains: env.LEVEL1_DOMAINS?.split(',') || [],
    level2Domains: env.LEVEL2_DOMAINS?.split(',') || [],
    level3Enabled: env.LEVEL3_ENABLED === 'true',

    // Logging
    logLevel: env.LOG_LEVEL || 'info',
    logFilePath: env.LOG_FILE_PATH || './logs/app.log'
  };
};

// Export singleton instance (using defaults for now)
export const environment = EnvironmentValidator.loadEnvironment(); 