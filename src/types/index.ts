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

export type VPNStatus = "connected" | "connecting" | "disconnected";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface NavigationAttempt {
  url: string;
  timestamp: Date;
  allowed: boolean;
  accessLevel: number;
}

export interface SecuritySettings {
  vpnRequired: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
  sessionTimeout: number;
}

export interface AccessLevelConfig {
  level: 1 | 2 | 3;
  label: string;
  description: string;
  color: string;
  allowedDomains: string[];
  restrictions: string[];
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
  canGoBack(): boolean;
  canGoForward(): boolean;
  goBack(): void;
  goForward(): void;
  reload(): void;
} 