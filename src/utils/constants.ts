import { AccessLevelConfig } from "../types";

export const SHAREPOINT_DOMAINS = [
  "sharepoint.com",
  "office.com",
  "microsoft.com",
  "office365.com",
  "microsoftonline.com"
];

export const WHITELISTED_DOMAINS = [
  "adobe.com",
  "google.com",
  "github.com",
  "stackoverflow.com",
  "mozilla.org"
];

export const ACCESS_LEVEL_CONFIGS: Record<1 | 2 | 3, AccessLevelConfig> = {
  1: {
    level: 1,
    label: "SharePoint Only",
    description: "Restricted to SharePoint domains only",
    color: "bg-red-500",
    allowedDomains: SHAREPOINT_DOMAINS,
    restrictions: [
      "Access limited to company SharePoint sites",
      "No external browsing allowed",
      "PDF viewing within SharePoint only"
    ]
  },
  2: {
    level: 2,
    label: "Controlled Access",
    description: "SharePoint + Whitelisted external domains",
    color: "bg-yellow-500",
    allowedDomains: [...SHAREPOINT_DOMAINS, ...WHITELISTED_DOMAINS],
    restrictions: [
      "SharePoint access enabled",
      "Limited external site access",
      "Pre-approved domains only"
    ]
  },
  3: {
    level: 3,
    label: "Full Access",
    description: "Unrestricted browsing (VPN-secured)",
    color: "bg-green-500",
    allowedDomains: ["*"],
    restrictions: [
      "Full internet access",
      "All traffic VPN-protected",
      "Enhanced monitoring active"
    ]
  }
};

export const VPN_CONFIG = {
  defaultLocation: "Australia",
  connectionTimeout: 30000,
  autoReconnect: true,
  requiredForBrowsing: true
};

export const SECURITY_SETTINGS = {
  sessionTimeout: 480, // 8 hours in minutes
  maxIdleTime: 30, // 30 minutes
  requireVPN: true,
  enableLogging: true,
  blockDevTools: true
};

export const DEFAULT_URLS = {
  sharepoint: "https://yourcompany.sharepoint.com",
  home: "https://yourcompany.sharepoint.com/sites/documents",
  help: "https://yourcompany.sharepoint.com/sites/help"
}; 