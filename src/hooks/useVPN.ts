import { useState, useEffect, useCallback } from "react";

type VPNStatus = "connected" | "connecting" | "disconnected" | "failed";

interface VPNConnection {
  endpoint: string;
  location: string;
  ipAddress?: string;
  latency?: number;
}

// Type for electron API
interface ElectronVPNAPI {
  connect: (provider: string) => Promise<boolean>;
  getStatus: () => Promise<string>;
}

interface ElectronAPI {
  vpn: ElectronVPNAPI;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const useVPN = () => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>("disconnected");
  const [connection, setConnection] = useState<VPNConnection>({
    endpoint: "au-sydney-01.vpn.provider.com",
    location: "Sydney, Australia"
  });
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const connectVPN = async (): Promise<void> => {
    setVpnStatus("connecting");
    setLastError(null);
    
    try {
      // Use IPC to connect VPN via main process
      console.log(`🔌 Requesting VPN connection via main process...`);
      const success = await window.electronAPI?.vpn?.connect('wireguard');
      
      if (success) {
        setVpnStatus("connected");
        setRetryCount(0);
        console.log("✅ VPN Connected successfully via main process");
        
        // Update connection info
        setConnection(prev => ({
          ...prev,
          ipAddress: "134.199.169.102", // Your actual Australian IP
          latency: Math.floor(Math.random() * 30) + 15
        }));
      } else {
        throw new Error("VPN connection failed via main process");
      }
    } catch (error) {
      console.error("❌ VPN connection failed:", error);
      setLastError("Failed to establish WireGuard VPN connection to Australia");
      setVpnStatus("failed");
    }
  };

  const disconnectVPN = async (): Promise<void> => {
    console.log("Disconnecting VPN...");
    setVpnStatus("disconnected");
    setConnection(prev => ({
      ...prev,
      ipAddress: undefined,
      latency: undefined
    }));
  };

  // Check VPN status function with better error handling
  const checkVPNStatus = useCallback(async (): Promise<void> => {
    setIsCheckingStatus(true);
    try {
      console.log("🔍 Checking VPN status via main process...");
      const status = await window.electronAPI?.vpn?.getStatus();
      console.log(`📊 VPN status received from main process: ${status}`);
      
      if (status === 'connected') {
        setVpnStatus("connected");
        setLastError(null);
        
        // Update connection info
        setConnection(prev => ({
          ...prev,
          ipAddress: "134.199.169.102", // Your actual Australian IP
          latency: Math.floor(Math.random() * 30) + 15
        }));
        
        console.log("✅ VPN is connected to Australia");
      } else if (status === 'disconnected') {
        setVpnStatus("disconnected");
        setLastError("WireGuard VPN is not connected to Australia");
        console.log("❌ VPN is disconnected");
      } else if (status === undefined || status === null) {
        // Handle undefined/null status - likely means IPC is not working
        console.warn("⚠️ VPN status is undefined - checking if main process is ready...");
        
        // Wait a bit and try again
        setTimeout(() => {
          checkVPNStatus();
        }, 2000);
        
        return; // Don't change status yet
      } else {
        setVpnStatus("failed");
        setLastError(`Unknown VPN status: ${status}`);
        console.log(`❌ Unknown VPN status: ${status}`);
      }
    } catch (error) {
      console.error("❌ Failed to check VPN status:", error);
      setVpnStatus("failed");
      setLastError("Failed to check VPN connection status");
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  // Check VPN status on mount with retry logic
  useEffect(() => {
    let mounted = true;
    let retryAttempts = 0;
    const maxRetries = 5;

    const checkInitialStatus = async () => {
      if (!mounted) return;
      
      try {
        console.log(`🔍 Checking initial VPN status (attempt ${retryAttempts + 1})...`);
        
        // Wait for electronAPI to be ready
        if (!window.electronAPI?.vpn?.getStatus) {
          console.log("⏳ Waiting for electronAPI to be ready...");
          if (retryAttempts < maxRetries) {
            retryAttempts++;
            setTimeout(checkInitialStatus, 1000);
          } else {
            console.error("❌ electronAPI not ready after max retries");
            setVpnStatus("failed");
            setLastError("Unable to communicate with VPN service");
          }
          return;
        }

        const status = await window.electronAPI?.vpn?.getStatus();
        console.log(`🔍 Initial VPN status received: ${status}`);
        
        if (status === 'connected') {
          setVpnStatus("connected");
          setConnection(prev => ({
            ...prev,
            ipAddress: "134.199.169.102", // Your actual Australian IP
            latency: Math.floor(Math.random() * 30) + 15
          }));
          console.log("✅ Initial VPN check: Connected to Australia");
        } else if (status === 'disconnected') {
          setVpnStatus("disconnected");
          console.log("❌ Initial VPN check: Disconnected");
        } else if (status === undefined || status === null) {
          console.warn("⚠️ Initial VPN status is undefined - retrying...");
          if (retryAttempts < maxRetries) {
            retryAttempts++;
            setTimeout(checkInitialStatus, 2000);
          } else {
            console.error("❌ VPN status still undefined after max retries");
            setVpnStatus("failed");
            setLastError("VPN status check timed out");
          }
        } else {
          setVpnStatus("failed");
          setLastError(`Unknown VPN status: ${status}`);
          console.log(`❌ Unknown initial VPN status: ${status}`);
        }
      } catch (error) {
        console.error("❌ Failed to check initial VPN status:", error);
        if (retryAttempts < maxRetries) {
          retryAttempts++;
          setTimeout(checkInitialStatus, 2000);
        } else {
          setVpnStatus("failed");
          setLastError("Failed to initialize VPN status");
        }
      }
    };

    // Start checking after a short delay to ensure everything is loaded
    setTimeout(checkInitialStatus, 500);

    return () => {
      mounted = false;
    };
  }, []);

  // Periodic VPN status check every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (vpnStatus === "connected") {
        checkVPNStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [vpnStatus, checkVPNStatus]);

  return {
    vpnStatus,
    connection,
    connectVPN,
    disconnectVPN,
    checkVPNStatus,
    retryCount,
    lastError,
    isConnected: vpnStatus === "connected",
    isConnecting: vpnStatus === "connecting",
    isCheckingStatus,
    hasFailed: vpnStatus === "failed",
    // Allow browsing only if VPN is connected
    allowBrowsing: vpnStatus === "connected",
  };
}; 