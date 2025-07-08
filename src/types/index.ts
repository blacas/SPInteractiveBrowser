export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: 1 | 2 | 3;
  avatar?: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  isLoading: boolean;
}

export type VPNStatus = "connected" | "connecting" | "disconnected" | "failed";

export interface AuthCredentials {
  email: string;
  password: string;
}

// Vault-managed SharePoint credentials (shared)
export interface VaultCredentials {
  sharepointUsername: string;
  sharepointPassword: string;
  lastUpdated: Date;
  vaultProvider: 'hashicorp' | 'aws-secrets' | '1password' | 'azure-keyvault' | '1password-cli';
}

export interface SharePointConfig {
  tenantUrl: string;
  libraryPath: string;
  allowedFileTypes: string[];
  credentials: VaultCredentials;
}

export interface VPNConfig {
  provider: 'nordlayer' | 'expressvpn' | 'wireguard';
  australianEndpoint: string;
  failClosed: boolean; // Block access if VPN fails
  retryAttempts: number;
}

export interface NavigationAttempt {
  url: string;
  timestamp: Date;
  allowed: boolean;
  accessLevel: number;
  vpnActive: boolean;
}

export interface SecuritySettings {
  vpnRequired: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
  sessionTimeout: number;
  preventLocalDownloads: boolean;
  sharepointOnly: boolean;
}

export interface AccessLevelConfig {
  level: 1 | 2 | 3;
  label: string;
  description: string;
  color: string;
  allowedDomains: string[];
  restrictions: string[];
  sharepointAccess: boolean;
}

// Electron webview type definitions
declare global {
  interface HTMLElementTagNameMap {
    'webview': HTMLWebViewElement;
  }
}

interface HTMLWebViewElement extends HTMLElement {
  src: string;
  allowpopups?: string;
  useragent?: string;
  partition?: string;
  webpreferences?: string;
  canGoBack(): boolean;
  canGoForward(): boolean;
  goBack(): void;
  goForward(): void;
  reload(): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
} 