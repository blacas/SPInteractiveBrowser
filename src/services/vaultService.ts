import { VaultCredentials, SharePointConfig } from '@/types';

// Use native fetch (available in Node.js 18+)
const fetchImpl = globalThis.fetch;

// Environment configuration interface
interface VaultConfig {
  provider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault';
  endpoint: string;
  credentials: Record<string, string>;
}

// Vault service for managing shared SharePoint credentials
export class VaultService {
  private vaultProvider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault';
  private vaultEndpoint: string;
  private accessToken: string | null = null;
  private initialized: boolean = false;
  private config: VaultConfig | null = null;

  constructor(provider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault' = 'hashicorp') {
    this.vaultProvider = provider;
    this.vaultEndpoint = '';
  }

  // Get environment configuration from Electron main process
  private async getEnvironmentConfig(): Promise<VaultConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // In Electron, we use the secure API bridge instead of direct process.env access
      if (typeof window !== 'undefined' && window.secureBrowser) {
        const envConfig = await window.secureBrowser.system.getEnvironment();
        
        // Parse the environment configuration returned from main process
        const config = JSON.parse(envConfig) as {
          VAULT_PROVIDER?: string;
          VAULT_ADDR?: string;
          VAULT_ROLE_ID?: string;
          VAULT_SECRET_ID?: string;
          AWS_REGION?: string;
          AWS_ACCESS_KEY_ID?: string;
          AWS_SECRET_ACCESS_KEY?: string;
          AZURE_TENANT_ID?: string;
          AZURE_CLIENT_ID?: string;
          AZURE_CLIENT_SECRET?: string;
          AZURE_VAULT_URL?: string;
          OP_CONNECT_HOST?: string;
          OP_CONNECT_TOKEN?: string;
        };

        this.config = {
          provider: (config.VAULT_PROVIDER as 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault') || this.vaultProvider,
          endpoint: this.getVaultEndpoint(config),
          credentials: {
            roleId: config.VAULT_ROLE_ID || '',
            secretId: config.VAULT_SECRET_ID || '',
            awsAccessKey: config.AWS_ACCESS_KEY_ID || '',
            awsSecretKey: config.AWS_SECRET_ACCESS_KEY || '',
            awsRegion: config.AWS_REGION || 'us-east-1',
            azureTenantId: config.AZURE_TENANT_ID || '',
            azureClientId: config.AZURE_CLIENT_ID || '',
            azureClientSecret: config.AZURE_CLIENT_SECRET || '',
            azureVaultUrl: config.AZURE_VAULT_URL || '',
            opConnectHost: config.OP_CONNECT_HOST || '',
            opConnectToken: config.OP_CONNECT_TOKEN || ''
          }
        };

        return this.config;
      } else {
        // Fallback for non-Electron environments (testing, etc.)
        throw new Error('Environment configuration not available. This service requires Electron context.');
      }
    } catch (error) {
      throw new Error(`Failed to load environment configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getVaultEndpoint(config: Record<string, string | undefined>): string {
    switch (this.vaultProvider) {
      case 'hashicorp':
        return config.VAULT_ADDR || 'http://localhost:8200';
      case 'aws-secrets':
        return config.AWS_REGION || 'us-east-1';
      case '1password':
        return config.OP_CONNECT_HOST || '';
      case 'azure-keyvault':
        return config.AZURE_VAULT_URL || '';
      default:
        return 'http://localhost:8200';
    }
  }

  // Initialize vault connection
  async initialize(): Promise<void> {
    if (this.initialized) {
      return; // Already initialized
    }

    try {
      // Load environment configuration first
      const config = await this.getEnvironmentConfig();
      this.vaultProvider = config.provider;
      this.vaultEndpoint = config.endpoint;

      switch (this.vaultProvider) {
        case 'hashicorp':
          await this.initializeHashiCorpVault();
          break;
        case 'aws-secrets':
          await this.initializeAWSSecrets();
          break;
        case '1password':
          await this.initialize1Password();
          break;
        case 'azure-keyvault':
          await this.initializeAzureKeyVault();
          break;
        default:
          throw new Error(`Unsupported vault provider: ${this.vaultProvider}`);
      }
      this.initialized = true;
      console.log(`✅ Vault initialized: ${this.vaultProvider}`);
    } catch (error) {
      console.error('❌ Failed to initialize vault:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Vault initialization failed';
      if (error instanceof Error) {
        if (error.message.includes('Environment configuration not available')) {
          errorMessage = 'Vault configuration missing. Please ensure your .env file is properly configured.';
        } else if (error.message.includes('not configured')) {
          errorMessage = 'Vault credentials not configured. Please check your environment variables.';
        } else {
          errorMessage = `Vault error: ${error.message}`;
        }
      }
      
      throw new Error(errorMessage);
    }
  }

  // Get shared SharePoint credentials from vault
  async getSharePointCredentials(): Promise<VaultCredentials> {
    if (!this.initialized) {
      throw new Error('Vault service not initialized. Call initialize() first.');
    }

    try {
      const credentials = await this.retrieveSecrets('sharepoint');
      
      const username = credentials.username as string;
      const password = credentials.password as string;
      const lastUpdated = credentials.lastUpdated as string | number | undefined;
      
      if (!username || !password) {
        throw new Error('SharePoint credentials are incomplete in vault');
      }
      
      return {
        sharepointUsername: username,
        sharepointPassword: password,
        lastUpdated: new Date(lastUpdated || Date.now()),
        vaultProvider: this.vaultProvider
      };
    } catch (error) {
      console.error('❌ Failed to retrieve SharePoint credentials:', error);
      throw new Error(`Unable to access SharePoint credentials from vault: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Get complete SharePoint configuration
  async getSharePointConfig(): Promise<SharePointConfig> {
    if (!this.initialized) {
      throw new Error('Vault service not initialized. Call initialize() first.');
    }

    try {
      const credentials = await this.getSharePointCredentials();
      
      // For MVP, we'll use environment defaults with vault credentials
      // In production, these would also come from vault
      
      return {
        tenantUrl: 'https://your-tenant.sharepoint.com', // This should come from vault in production
        libraryPath: '/sites/documents/Shared Documents',
        allowedFileTypes: ['pdf', 'docx', 'xlsx', 'pptx'],
        credentials
      };
    } catch (error) {
      console.error('❌ Failed to retrieve SharePoint configuration:', error);
      throw new Error(`Unable to access SharePoint configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Check if vault service is initialized
  isInitialized(): boolean {
    return this.initialized;
  }

  // Get vault status
  getStatus(): { provider: string; initialized: boolean; endpoint: string } {
    return {
      provider: this.vaultProvider,
      initialized: this.initialized,
      endpoint: this.vaultEndpoint
    };
  }

  // Vault-specific implementations
  private async initializeHashiCorpVault(): Promise<void> {
    if (!this.config) {
      throw new Error('Vault configuration not loaded');
    }

    const roleId = this.config.credentials.roleId;
    const secretId = this.config.credentials.secretId;
    
    if (!roleId || !secretId) {
      throw new Error('HashiCorp Vault credentials not configured. Set VAULT_ROLE_ID and VAULT_SECRET_ID environment variables.');
    }

    if (!this.vaultEndpoint || this.vaultEndpoint === 'http://localhost:8200') {
      console.warn('⚠️ Using default HashiCorp Vault endpoint. Set VAULT_ADDR environment variable for production.');
    }

    try {
      // Authenticate with HashiCorp Vault
      const authResponse = await this.makeVaultRequest('/v1/auth/approle/login', {
        method: 'POST',
        body: JSON.stringify({
          role_id: roleId,
          secret_id: secretId
        })
      });

      const auth = authResponse.auth as { client_token?: string } | undefined;
      if (!auth?.client_token) {
        throw new Error('Invalid authentication response from HashiCorp Vault');
      }

      this.accessToken = auth.client_token;
      console.log('✅ HashiCorp Vault authentication successful');
    } catch (error) {
      throw new Error(`HashiCorp Vault authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async initializeAWSSecrets(): Promise<void> {
    if (!this.config) {
      throw new Error('Vault configuration not loaded');
    }

    const region = this.config.credentials.awsRegion;
    
    if (!this.config.credentials.awsAccessKey) {
      console.warn('⚠️ AWS credentials not configured. Ensure AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY are set.');
    }

    this.vaultEndpoint = region;
    console.log(`✅ AWS Secrets Manager initialized for region: ${region}`);
    
    // Note: Full AWS SDK integration would be implemented here
    // For now, we'll throw an error to indicate it needs implementation
    throw new Error('AWS Secrets Manager integration not fully implemented. Please implement AWS SDK integration.');
  }

  private async initialize1Password(): Promise<void> {
    if (!this.config) {
      throw new Error('Vault configuration not loaded');
    }

    this.accessToken = this.config.credentials.opConnectToken;
    
    if (!this.accessToken) {
      throw new Error('1Password Connect token not configured. Set OP_CONNECT_TOKEN environment variable.');
    }

    if (!this.vaultEndpoint) {
      throw new Error('1Password Connect host not configured. Set OP_CONNECT_HOST environment variable.');
    }

    console.log('✅ 1Password Connect initialized');
    
    // Note: Full 1Password Connect API integration would be implemented here
    throw new Error('1Password Connect integration not fully implemented. Please implement 1Password Connect API.');
  }

  private async initializeAzureKeyVault(): Promise<void> {
    if (!this.config) {
      throw new Error('Vault configuration not loaded');
    }

    const { azureTenantId, azureClientId, azureClientSecret } = this.config.credentials;
    
    if (!azureTenantId || !azureClientId || !azureClientSecret) {
      throw new Error('Azure Key Vault credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET environment variables.');
    }

    if (!this.vaultEndpoint) {
      throw new Error('Azure Key Vault URL not configured. Set AZURE_VAULT_URL environment variable.');
    }

    console.log('✅ Azure Key Vault initialized');
    
    // Note: Full Azure Key Vault SDK integration would be implemented here
    throw new Error('Azure Key Vault integration not fully implemented. Please implement Azure SDK integration.');
  }

  // Retrieve secrets from vault (implementation depends on provider)
  private async retrieveSecrets(secretPath: string): Promise<Record<string, unknown>> {
    switch (this.vaultProvider) {
      case 'hashicorp':
        return await this.getHashiCorpSecret(secretPath);
      case 'aws-secrets':
        return await this.getAWSSecret(secretPath);
      case '1password':
        return await this.get1PasswordSecret(secretPath);
      case 'azure-keyvault':
        return await this.getAzureSecret(secretPath);
      default:
        throw new Error(`Unsupported vault provider: ${this.vaultProvider}`);
    }
  }

  private async getHashiCorpSecret(path: string): Promise<Record<string, unknown>> {
    if (!this.accessToken) {
      throw new Error('HashiCorp Vault not authenticated');
    }

    try {
      const response = await this.makeVaultRequest(`/v1/secret/data/${path}`, {
        method: 'GET',
        headers: {
          'X-Vault-Token': this.accessToken
        }
      });

      const data = response.data as { data?: Record<string, unknown> } | undefined;
      if (!data?.data) {
        throw new Error(`Secret not found at path: ${path}`);
      }

      return data.data;
    } catch (error) {
      throw new Error(`Failed to retrieve HashiCorp secret: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getAWSSecret(_secretName: string): Promise<Record<string, unknown>> {
    // AWS Secrets Manager implementation would go here
    throw new Error('AWS Secrets Manager integration not implemented');
  }

  private async get1PasswordSecret(_itemId: string): Promise<Record<string, unknown>> {
    // 1Password Connect API implementation would go here  
    throw new Error('1Password Connect integration not implemented');
  }

  private async getAzureSecret(_secretName: string): Promise<Record<string, unknown>> {
    // Azure Key Vault implementation would go here
    throw new Error('Azure Key Vault integration not implemented');
  }

  private async makeVaultRequest(path: string, options: RequestInit): Promise<Record<string, unknown>> {
    if (!this.vaultEndpoint) {
      throw new Error('Vault endpoint not configured');
    }

    const url = `${this.vaultEndpoint}${path}`;
    
    try {
      const response = await fetchImpl(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vault request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data as Record<string, unknown>;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to vault server. Check your internet connection and vault URL.');
      }
      throw error;
    }
  }

  // Rotate credentials (for production use)
  async rotateCredentials(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Vault service not initialized');
    }

    // Implementation would depend on vault provider and organizational policies
    console.log('⚠️ Credential rotation not implemented for MVP');
    throw new Error('Credential rotation not implemented in MVP version');
  }
}

// Create singleton instance for application use
export const vaultService = new VaultService();

// SharePoint credential injection helper (to be called from webview)
export const injectSharePointCredentials = async (webview: HTMLElement): Promise<void> => {
  try {
    if (!vaultService.isInitialized()) {
      await vaultService.initialize();
    }

    const credentials = await vaultService.getSharePointCredentials();
    
    // Use Electron's secure API to inject credentials
    if (typeof window !== 'undefined' && window.secureBrowser) {
      const webviewId = webview.getAttribute('id') || 'default';
      await window.secureBrowser.sharepoint.injectCredentials(webviewId);
      console.log('✅ SharePoint credentials injected successfully');
    } else {
      throw new Error('Secure browser API not available');
    }
  } catch (error) {
    console.error('❌ Failed to inject SharePoint credentials:', error);
    throw new Error(`SharePoint login failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 