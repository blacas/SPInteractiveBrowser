import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { getPlatformInfo } from '../utils/platform';

export interface VPNStatus {
  connected: boolean;
  endpoint?: string;
  publicKey?: string;
  allowedIPs?: string[];
  lastHandshake?: Date;
  transferRx?: number;
  transferTx?: number;
  persistentKeepalive?: number;
}

export interface VPNConfig {
  provider: 'wireguard' | 'nordlayer' | 'expressvpn';
  endpoint: string;
  configPath?: string;
  autoConnect: boolean;
  failClosed: boolean;
}

export class VPNService {
  private config: VPNConfig | null = null;
  private wireguardProcess: ChildProcess | null = null;
  private statusCheckInterval: NodeJS.Timeout | null = null;
  private connectionCallbacks: ((status: VPNStatus) => void)[] = [];

  constructor() {
    this.loadConfiguration();
  }

  private async loadConfiguration(): Promise<void> {
    try {
      // Get configuration from Electron main process
      if (typeof window !== 'undefined' && window.secureBrowser) {
        const envConfig = await window.secureBrowser.system.getEnvironment();
        const env = JSON.parse(envConfig);
        
        this.config = {
          provider: env.VPN_PROVIDER || 'wireguard',
          endpoint: env.WIREGUARD_ENDPOINT || '',
          configPath: env.WIREGUARD_CONFIG_PATH || './config/wireguard-australia.conf',
          autoConnect: env.VPN_AUTO_CONNECT === 'true',
          failClosed: env.VPN_FAIL_CLOSED === 'true'
        };
      }
    } catch (error) {
      console.error('❌ Failed to load VPN configuration:', error);
      throw new Error('VPN configuration not available');
    }
  }

  async connect(): Promise<boolean> {
    if (!this.config) {
      throw new Error('VPN service not configured');
    }

    try {
      const platformInfo = getPlatformInfo();
      console.log(`🌐 Attempting VPN connection with ${this.config.provider} on ${platformInfo.displayName} ${platformInfo.emoji}...`);
      
      switch (this.config.provider) {
        case 'wireguard':
          return await this.connectWireGuard();
        case 'nordlayer':
          return await this.connectNordLayer();
        case 'expressvpn':
          return await this.connectExpressVPN();
        default:
          throw new Error(`Unsupported VPN provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('❌ VPN connection failed:', error);
      this.notifyStatusChange({ connected: false });
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      if (this.config?.provider === 'wireguard') {
        return await this.disconnectWireGuard();
      }
      
      // For other providers, implement specific disconnect logic
      console.log('🔌 VPN disconnected');
      this.notifyStatusChange({ connected: false });
      return true;
    } catch (error) {
      console.error('❌ VPN disconnect failed:', error);
      return false;
    }
  }

  async getStatus(): Promise<VPNStatus> {
    if (!this.config) {
      return { connected: false };
    }

    try {
      switch (this.config.provider) {
        case 'wireguard':
          return await this.getWireGuardStatus();
        default:
          return { connected: false };
      }
    } catch (error) {
      console.error('❌ Failed to get VPN status:', error);
      return { connected: false };
    }
  }

  onStatusChange(callback: (status: VPNStatus) => void): void {
    this.connectionCallbacks.push(callback);
  }

  removeStatusListener(callback: (status: VPNStatus) => void): void {
    const index = this.connectionCallbacks.indexOf(callback);
    if (index > -1) {
      this.connectionCallbacks.splice(index, 1);
    }
  }

  private notifyStatusChange(status: VPNStatus): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('❌ Error in VPN status callback:', error);
      }
    });
  }

  // WireGuard Implementation
  private async connectWireGuard(): Promise<boolean> {
    if (!this.config?.configPath) {
      throw new Error('WireGuard config path not specified');
    }

    try {
      // Use IPC to request VPN connection from main process (for security)
      if (typeof window !== 'undefined' && window.secureBrowser) {
        console.log('🔌 Requesting WireGuard connection from main process...');
        const success = await window.secureBrowser.vpn.connect('wireguard');
        
        if (success) {
          console.log('✅ WireGuard VPN connected successfully');
          this.startStatusMonitoring();
          this.notifyStatusChange({ 
            connected: true, 
            endpoint: this.config.endpoint 
          });
          return true;
        } else {
          console.warn('⚠️ WireGuard connection failed - check main process logs for platform-specific instructions');
          this.notifyStatusChange({ connected: false });
          return false;
        }
      }
      
      throw new Error('Secure browser IPC not available');
    } catch (error) {
      const errorMessage = `WireGuard connection failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error('❌', errorMessage);
      this.notifyStatusChange({ connected: false });
      throw new Error(errorMessage);
    }
  }

  private async disconnectWireGuard(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.secureBrowser) {
        const success = await window.secureBrowser.vpn.disconnect();
        
        if (success) {
          this.stopStatusMonitoring();
          console.log('🔌 WireGuard VPN disconnected');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ WireGuard disconnect error:', error);
      return false;
    }
  }

  private async getWireGuardStatus(): Promise<VPNStatus> {
    try {
      // Get status from main process
      if (typeof window !== 'undefined' && window.secureBrowser) {
        const statusString = await window.secureBrowser.vpn.getStatus();
        
        if (statusString === 'connected') {
          return {
            connected: true,
            endpoint: this.config?.endpoint,
            // Additional status info would be parsed from wg show output
          };
        }
      }
      
      return { connected: false };
    } catch (error) {
      console.error('❌ Failed to get WireGuard status:', error);
      return { connected: false };
    }
  }

  private startStatusMonitoring(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }

    this.statusCheckInterval = setInterval(async () => {
      const status = await this.getStatus();
      this.notifyStatusChange(status);
    }, 5000); // Check every 5 seconds
  }

  private stopStatusMonitoring(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  // Placeholder implementations for other VPN providers
  private async connectNordLayer(): Promise<boolean> {
    throw new Error('NordLayer integration not implemented. Please implement NordLayer API integration.');
  }

  private async connectExpressVPN(): Promise<boolean> {
    throw new Error('ExpressVPN integration not implemented. Please implement ExpressVPN API integration.');
  }

  // Cleanup
  destroy(): void {
    this.stopStatusMonitoring();
    this.connectionCallbacks = [];
  }
}

// Singleton instance
export const vpnService = new VPNService(); 