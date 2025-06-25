import { VaultCredentials, SharePointConfig } from '@/types';

// Use native fetch (available in Node.js 18+)
const fetchImpl = globalThis.fetch;

// Vault service for managing shared SharePoint credentials
export class VaultService {
  private vaultProvider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault';
  private vaultEndpoint: string;
  private accessToken: string | null = null;
  private initialized: boolean = false;

  constructor(provider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault' = 'hashicorp') {
    this.vaultProvider = provider;
    this.vaultEndpoint = this.getVaultEndpoint();
  }

  private getVaultEndpoint(): string {
    switch (this.vaultProvider) {
      case 'hashicorp':
        return process.env.VAULT_ADDR || 'http://localhost:8200';
      case 'aws-secrets':
        return process.env.AWS_SECRETS_REGION || 'us-east-1';
      case '1password':
        return process.env.OP_CONNECT_HOST || '';
      case 'azure-keyvault':
        return process.env.AZURE_KEYVAULT_URL || '';
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
      throw new Error(`Vault initialization failed: ${error instanceof Error ? error.message : String(error)}`);
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
      const config = await this.retrieveSecrets('sharepoint-config');
      
      const tenantUrl = config.tenantUrl as string;
      const libraryPath = config.libraryPath as string;
      const allowedFileTypes = config.allowedFileTypes as string[];
      
      return {
        tenantUrl: tenantUrl || process.env.SHAREPOINT_TENANT || 'https://your-tenant.sharepoint.com',
        libraryPath: libraryPath || process.env.SHAREPOINT_LIBRARY || '/sites/documents/Shared Documents',
        allowedFileTypes: allowedFileTypes || ['pdf', 'docx', 'xlsx', 'pptx'],
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
    const roleId = process.env.VAULT_ROLE_ID;
    const secretId = process.env.VAULT_SECRET_ID;
    
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
    // Basic AWS Secrets Manager initialization
    const region = process.env.AWS_REGION || process.env.AWS_SECRETS_REGION || 'us-east-1';
    
    if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_PROFILE) {
      console.warn('⚠️ AWS credentials not configured. Ensure AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or AWS_PROFILE is set.');
    }

    this.vaultEndpoint = region;
    console.log(`✅ AWS Secrets Manager initialized for region: ${region}`);
    
    // Note: Full AWS SDK integration would be implemented here
    // For now, we'll throw an error to indicate it needs implementation
    throw new Error('AWS Secrets Manager integration not fully implemented. Please implement AWS SDK integration.');
  }

  private async initialize1Password(): Promise<void> {
    this.accessToken = process.env.OP_CONNECT_TOKEN || '';
    
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
    const vaultUrl = process.env.AZURE_KEYVAULT_URL;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    const tenantId = process.env.AZURE_TENANT_ID;

    if (!vaultUrl || !clientId || !clientSecret || !tenantId) {
      throw new Error('Azure Key Vault credentials not configured. Set AZURE_KEYVAULT_URL, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID environment variables.');
    }

    console.log('✅ Azure Key Vault initialized');
    
    // Note: Full Azure Key Vault SDK integration would be implemented here
    throw new Error('Azure Key Vault integration not fully implemented. Please implement Azure SDK integration.');
  }

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

      const responseData = response.data as { data?: Record<string, unknown> } | undefined;
      if (!responseData?.data) {
        throw new Error(`Secret not found at path: ${path}`);
      }

      return responseData.data;
    } catch (error) {
      throw new Error(`Failed to retrieve HashiCorp Vault secret: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getAWSSecret(secretName: string): Promise<Record<string, unknown>> {
    // AWS Secrets Manager implementation placeholder
    // This would use AWS SDK
    throw new Error(`AWS Secrets Manager not implemented for secret: ${secretName}`);
  }

  private async get1PasswordSecret(itemId: string): Promise<Record<string, unknown>> {
    // 1Password Connect API implementation placeholder
    throw new Error(`1Password Connect not implemented for item: ${itemId}`);
  }

  private async getAzureSecret(secretName: string): Promise<Record<string, unknown>> {
    // Azure Key Vault implementation placeholder
    throw new Error(`Azure Key Vault not implemented for secret: ${secretName}`);
  }

  private async makeVaultRequest(path: string, options: RequestInit): Promise<Record<string, unknown>> {
    const url = `${this.vaultEndpoint}${path}`;
    
    if (!fetchImpl) {
      throw new Error('Fetch API not available. Node.js 18+ required.');
    }
    
    try {
      const response = await fetchImpl(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json() as Record<string, unknown>;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new Error(`Vault request timeout for ${url}`);
        }
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
          throw new Error(`Cannot connect to vault at ${url}. Check if vault service is running and accessible.`);
        }
        throw error;
      }
      throw new Error(`Vault request failed: ${String(error)}`);
    }
  }

  // Rotate credentials (for scheduled updates)
  async rotateCredentials(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Vault service not initialized');
    }

    console.log('🔄 Rotating SharePoint credentials...');
    
    try {
      // Implementation would depend on your credential rotation strategy
      // This is a placeholder for the rotation logic
      console.log('⚠️ Credential rotation not implemented yet');
    } catch (error) {
      console.error('❌ Failed to rotate credentials:', error);
      throw new Error(`Credential rotation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Singleton instance
export const vaultService = new VaultService();

// Helper function to inject SharePoint credentials into webview
export const injectSharePointCredentials = async (webview: HTMLElement): Promise<void> => {
  try {
    if (!vaultService.isInitialized()) {
      console.warn('⚠️ Vault service not initialized - cannot inject SharePoint credentials');
      return;
    }

    const credentials = await vaultService.getSharePointCredentials();
    
    // Check if webview supports executeJavaScript
    const webviewElement = webview as HTMLElement & { executeJavaScript?: (script: string) => Promise<unknown> };
    if (typeof webviewElement.executeJavaScript !== 'function') {
      console.error('❌ Webview does not support executeJavaScript method');
      return;
    }
    
    // Execute JavaScript in the webview to auto-fill SharePoint login
    const script = `
      (function() {
        try {
          // Common SharePoint/Office365 login field selectors
          const usernameSelectors = [
            'input[type="email"]',
            'input[name="loginfmt"]',
            'input[name="username"]',
            'input[id="i0116"]',
            'input[placeholder*="email"]'
          ];
          
          const passwordSelectors = [
            'input[type="password"]',
            'input[name="passwd"]',
            'input[name="password"]',
            'input[id="i0118"]'
          ];
          
          let usernameField = null;
          let passwordField = null;
          
          // Find username field
          for (const selector of usernameSelectors) {
            usernameField = document.querySelector(selector);
            if (usernameField) break;
          }
          
          // Find password field
          for (const selector of passwordSelectors) {
            passwordField = document.querySelector(selector);
            if (passwordField) break;
          }
          
          if (usernameField) {
            usernameField.value = '${credentials.sharepointUsername}';
            usernameField.dispatchEvent(new Event('input', { bubbles: true }));
            usernameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ SharePoint username injected');
          }
          
          if (passwordField) {
            passwordField.value = '${credentials.sharepointPassword}';
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
            passwordField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ SharePoint password injected');
          }
          
          // Auto-submit if both fields are found
          if (usernameField && passwordField) {
            const form = usernameField.closest('form') || passwordField.closest('form');
            if (form) {
              // Small delay to ensure fields are properly filled
              setTimeout(() => {
                form.submit();
                console.log('✅ SharePoint login form submitted');
              }, 500);
            }
          }
          
          return {
            success: true,
            usernameFound: !!usernameField,
            passwordFound: !!passwordField
          };
        } catch (error) {
          console.error('❌ SharePoint credential injection error:', error);
          return {
            success: false,
            error: error.message
          };
        }
      })();
    `;

    // Execute script in webview context
    const result = await webviewElement.executeJavaScript(script) as {
      success?: boolean;
      usernameFound?: boolean;
      passwordFound?: boolean;
      error?: string;
    } | undefined;
    
    if (result?.success) {
      console.log('✅ SharePoint credentials injected successfully', {
        usernameFound: result.usernameFound,
        passwordFound: result.passwordFound
      });
    } else {
      console.warn('⚠️ SharePoint credential injection completed with issues:', result);
    }
    
  } catch (error) {
    console.error('❌ Failed to inject SharePoint credentials:', error);
    throw new Error(`SharePoint credential injection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 