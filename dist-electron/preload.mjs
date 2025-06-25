"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("secureBrowser", {
  // VPN Operations
  vpn: {
    getStatus: () => electron.ipcRenderer.invoke("vpn-get-status"),
    connect: (provider) => electron.ipcRenderer.invoke("vpn-connect", provider),
    disconnect: () => electron.ipcRenderer.invoke("vpn-disconnect"),
    onStatusChange: (callback) => {
      electron.ipcRenderer.on("vpn-status-changed", (_, status) => callback(status));
    },
    removeStatusListener: () => {
      electron.ipcRenderer.removeAllListeners("vpn-status-changed");
    }
  },
  // Vault Operations  
  vault: {
    getSharePointCredentials: () => electron.ipcRenderer.invoke("vault-get-sharepoint-credentials"),
    rotateCredentials: () => electron.ipcRenderer.invoke("vault-rotate-credentials"),
    getVaultStatus: () => electron.ipcRenderer.invoke("vault-get-status")
  },
  // Security Operations
  security: {
    checkUrlAllowed: (url, accessLevel) => electron.ipcRenderer.invoke("security-check-url", url, accessLevel),
    logNavigation: (url, allowed, accessLevel) => electron.ipcRenderer.invoke("security-log-navigation", url, allowed, accessLevel),
    preventDownload: (filename) => electron.ipcRenderer.invoke("security-prevent-download", filename)
  },
  // SharePoint Operations
  sharepoint: {
    injectCredentials: (webviewId) => electron.ipcRenderer.invoke("sharepoint-inject-credentials", webviewId),
    getLibraryConfig: () => electron.ipcRenderer.invoke("sharepoint-get-config"),
    validateAccess: (url) => electron.ipcRenderer.invoke("sharepoint-validate-access", url)
  },
  // System Information
  system: {
    getVersion: () => electron.ipcRenderer.invoke("system-get-version"),
    getEnvironment: () => electron.ipcRenderer.invoke("system-get-environment"),
    isProduction: () => false
  }
});
delete window.module;
delete window.exports;
delete window.require;
console.log("🔒 Secure Browser Preload: Context isolation enabled");
console.log("🌐 VPN-routed traffic: Ready for Australian endpoint");
console.log("🔑 Vault integration: SharePoint credentials secure");
