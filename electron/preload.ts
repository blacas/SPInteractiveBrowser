import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// Secure API for VPN and Vault operations
contextBridge.exposeInMainWorld('secureBrowser', {
  // VPN Operations
  vpn: {
    getStatus: () => ipcRenderer.invoke('vpn-get-status'),
    connect: (provider: string) => ipcRenderer.invoke('vpn-connect', provider),
    disconnect: () => ipcRenderer.invoke('vpn-disconnect'),
    onStatusChange: (callback: (status: string) => void) => {
      ipcRenderer.on('vpn-status-changed', (_, status) => callback(status))
    },
    removeStatusListener: () => {
      ipcRenderer.removeAllListeners('vpn-status-changed')
    }
  },

  // Vault Operations  
  vault: {
    getSharePointCredentials: () => ipcRenderer.invoke('vault-get-sharepoint-credentials'),
    rotateCredentials: () => ipcRenderer.invoke('vault-rotate-credentials'),
    getVaultStatus: () => ipcRenderer.invoke('vault-get-status')
  },

  // Security Operations
  security: {
    checkUrlAllowed: (url: string, accessLevel: number) => 
      ipcRenderer.invoke('security-check-url', url, accessLevel),
    logNavigation: (url: string, allowed: boolean, accessLevel: number) =>
      ipcRenderer.invoke('security-log-navigation', url, allowed, accessLevel),
    preventDownload: (filename: string) =>
      ipcRenderer.invoke('security-prevent-download', filename)
  },

  // SharePoint Operations
  sharepoint: {
    injectCredentials: (webviewId: string) => 
      ipcRenderer.invoke('sharepoint-inject-credentials', webviewId),
    getLibraryConfig: () => ipcRenderer.invoke('sharepoint-get-config'),
    validateAccess: (url: string) => ipcRenderer.invoke('sharepoint-validate-access', url)
  },

  // System Information
  system: {
    getVersion: () => ipcRenderer.invoke('system-get-version'),
    getEnvironment: () => ipcRenderer.invoke('system-get-environment'),
    isProduction: () => false // Will be determined by main process
  }
})

// Remove node integration from window object for security
delete (window as unknown as { module?: unknown }).module
delete (window as unknown as { exports?: unknown }).exports
delete (window as unknown as { require?: unknown }).require

// Enhanced security - prevent access to node internals
try {
  // Note: process object is not available in renderer with context isolation
  Object.freeze(console)
} catch (error) {
  // Ignore freezing errors in some environments
}

// Log security initialization
console.log('🔒 Secure Browser Preload: Context isolation enabled')
console.log('🌐 VPN-routed traffic: Ready for Australian endpoint')
console.log('🔑 Vault integration: SharePoint credentials secure')

// Type definitions for renderer process
// Type definitions for renderer process
export interface SecureBrowserAPI {
  vpn: {
    getStatus: () => Promise<string>;
    connect: (provider: string) => Promise<boolean>;
    disconnect: () => Promise<boolean>;
    onStatusChange: (callback: (status: string) => void) => void;
    removeStatusListener: () => void;
  };
  vault: {
    getSharePointCredentials: () => Promise<{username: string, password: string}>;
    rotateCredentials: () => Promise<boolean>;
    getVaultStatus: () => Promise<string>;
  };
  security: {
    checkUrlAllowed: (url: string, accessLevel: number) => Promise<boolean>;
    logNavigation: (url: string, allowed: boolean, accessLevel: number) => Promise<void>;
    preventDownload: (filename: string) => Promise<void>;
  };
  sharepoint: {
    injectCredentials: (webviewId: string) => Promise<boolean>;
    getLibraryConfig: () => Promise<{tenantUrl: string, libraryPath: string}>;
    validateAccess: (url: string) => Promise<boolean>;
  };
  system: {
    getVersion: () => Promise<string>;
    getEnvironment: () => Promise<string>;
    isProduction: () => boolean;
  };
}

declare global {
  interface Window {
    secureBrowser: SecureBrowserAPI;
  }
}
