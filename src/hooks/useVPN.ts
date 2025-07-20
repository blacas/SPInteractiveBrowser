import { useState, useEffect, useCallback } from 'react';

type VPNStatus = "connected" | "connecting" | "disconnected" | "failed";

interface VPNConnection {
  endpoint: string;
  location: string;
  ipAddress?: string;
  latency?: number;
}

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
  const [autoReconnectAttempts, setAutoReconnectAttempts] = useState(0);
  const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);

  const connectVPN = async (): Promise<void> => {
    setVpnStatus("connecting");
    setLastError(null);
    setIsAutoReconnecting(false);
    
    try {
      // Use IPC to connect VPN via main process
      console.log(`🔌 Requesting VPN connection via main process...`);
      const success = await window.electronAPI?.vpn?.connect('wireguard');
      
      if (success) {
        setVpnStatus("connected");
        setRetryCount(0);
        setAutoReconnectAttempts(0);
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
    setAutoReconnectAttempts(0);
    setIsAutoReconnecting(false);
    setConnection(prev => ({
      ...prev,
      ipAddress: undefined,
      latency: undefined
    }));
  };

  // Auto-reconnect function
  const autoReconnectVPN = useCallback(async (): Promise<void> => {
    if (isAutoReconnecting || vpnStatus === "connecting") {
      return; // Prevent multiple concurrent reconnection attempts
    }

    setIsAutoReconnecting(true);
    setAutoReconnectAttempts(prev => prev + 1);
    console.log(`🔄 Auto-reconnect attempt ${autoReconnectAttempts + 1}...`);

    try {
      // Use IPC to connect VPN via main process
      const success = await window.electronAPI?.vpn?.connect('wireguard');
      
      if (success) {
        setVpnStatus("connected");
        setRetryCount(0);
        setAutoReconnectAttempts(0);
        setIsAutoReconnecting(false);
        console.log("✅ VPN Auto-reconnected successfully");
        
        // Update connection info
        setConnection(prev => ({
          ...prev,
          ipAddress: "134.199.169.102",
          latency: Math.floor(Math.random() * 30) + 15
        }));
      } else {
        throw new Error("Auto-reconnection failed");
      }
    } catch (error) {
      console.error("❌ VPN auto-reconnection failed:", error);
      setIsAutoReconnecting(false);
      
      // If we've tried too many times, give up auto-reconnect
      if (autoReconnectAttempts >= 5) {
        console.log("❌ Auto-reconnect failed after 5 attempts, stopping");
        setVpnStatus("failed");
        setLastError("Auto-reconnection failed after multiple attempts");
      }
    }
  }, [isAutoReconnecting, vpnStatus, autoReconnectAttempts]);

  // Check VPN status function with better error handling and more reliable status detection
  const checkVPNStatus = useCallback(async (): Promise<void> => {
    setIsCheckingStatus(true);
    try {
      console.log("🔍 Checking VPN status via main process...");
      const status = await window.electronAPI?.vpn?.getStatus();
      console.log(`📊 VPN status received from main process: ${status}`);
      
      if (status === 'connected') {
        // Only update if currently not connected to prevent unnecessary re-renders
        if (vpnStatus !== "connected") {
          setVpnStatus("connected");
          setLastError(null);
          setAutoReconnectAttempts(0);
          setIsAutoReconnecting(false);
          
          // Update connection info
          setConnection(prev => ({
            ...prev,
            ipAddress: "134.199.169.102", // Your actual Australian IP
            latency: Math.floor(Math.random() * 30) + 15
          }));
          
          console.log("✅ VPN is connected to Australia");
        }
      } else if (status === 'disconnected') {
        // Only update if currently connected and trigger auto-reconnect
        if (vpnStatus === "connected") {
          console.warn("⚠️ VPN disconnection detected, triggering auto-reconnect...");
          setVpnStatus("disconnected");
          setLastError("WireGuard VPN disconnected unexpectedly");
          
          // Trigger auto-reconnect if not already reconnecting
          if (!isAutoReconnecting && autoReconnectAttempts < 5) {
            setTimeout(() => {
              autoReconnectVPN();
            }, 5000); // Wait 5 seconds before auto-reconnect
          }
        } else if (vpnStatus !== "disconnected" && vpnStatus !== "connecting") {
          setVpnStatus("disconnected");
          setLastError("WireGuard VPN is not connected to Australia");
        }
        console.log("❌ VPN is disconnected");
      } else if (status === undefined || status === null) {
        // Handle undefined/null status - likely means IPC is not working
        console.warn("⚠️ VPN status is undefined - checking if main process is ready...");
        
        // Don't immediately fail, give it more time
        if (vpnStatus !== "failed") {
          // Wait a bit and try again
          setTimeout(() => {
            checkVPNStatus();
          }, 5000); // Increased timeout
        }
        
        return; // Don't change status yet
      } else {
        console.log(`❌ Unknown VPN status: ${status}`);
        // Don't immediately set to failed, could be a temporary issue
        if (vpnStatus === "connected") {
          console.warn("⚠️ Unknown status but was connected, will retry status check");
          setTimeout(() => {
            checkVPNStatus();
          }, 10000); // Retry in 10 seconds
        } else {
          setVpnStatus("failed");
          setLastError(`Unknown VPN status: ${status}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to check VPN status:", error);
      
      // Don't immediately fail if we were connected, could be a temporary IPC issue
      if (vpnStatus === "connected") {
        console.warn("⚠️ Status check failed but was connected, will retry");
        setTimeout(() => {
          checkVPNStatus();
        }, 15000); // Retry in 15 seconds
      } else {
        setVpnStatus("failed");
        setLastError("Failed to check VPN connection status");
      }
    } finally {
      setIsCheckingStatus(false);
    }
  }, [vpnStatus, isAutoReconnecting, autoReconnectAttempts, autoReconnectVPN]);

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
            setTimeout(checkInitialStatus, 2000); // Increased from 1000ms
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
            setTimeout(checkInitialStatus, 3000); // Increased timeout
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
          setTimeout(checkInitialStatus, 3000); // Increased timeout
        } else {
          setVpnStatus("failed");
          setLastError("Failed to initialize VPN status");
        }
      }
    };

    // Start checking after a longer delay to ensure everything is loaded
    setTimeout(checkInitialStatus, 1000); // Increased from 500ms

    return () => {
      mounted = false;
    };
  }, []);

  // Periodic VPN status check with more conservative timing
  useEffect(() => {
    const interval = setInterval(() => {
      // Only check status if we think we're connected or if we're not auto-reconnecting
      if (vpnStatus === "connected" || (vpnStatus === "disconnected" && !isAutoReconnecting)) {
        checkVPNStatus();
      }
    }, 45000); // Increased from 30 seconds to 45 seconds to reduce frequent checks

    return () => clearInterval(interval);
  }, [vpnStatus, checkVPNStatus, isAutoReconnecting]);

  // Auto-reconnect logic for when VPN unexpectedly disconnects
  useEffect(() => {
    let autoReconnectTimeout: NodeJS.Timeout;

    if (vpnStatus === "disconnected" && autoReconnectAttempts < 5 && !isAutoReconnecting) {
      console.log(`⏰ Scheduling auto-reconnect attempt ${autoReconnectAttempts + 1} in 30 seconds...`);
      autoReconnectTimeout = setTimeout(() => {
        autoReconnectVPN();
      }, 30000); // Auto-reconnect every 30 seconds
    }

    return () => {
      if (autoReconnectTimeout) {
        clearTimeout(autoReconnectTimeout);
      }
    };
  }, [vpnStatus, autoReconnectAttempts, isAutoReconnecting, autoReconnectVPN]);

  return {
    vpnStatus,
    connection,
    connectVPN,
    disconnectVPN,
    checkVPNStatus,
    retryCount,
    lastError,
    isConnected: vpnStatus === "connected",
    isConnecting: vpnStatus === "connecting" || isAutoReconnecting,
    isCheckingStatus,
    hasFailed: vpnStatus === "failed",
    autoReconnectAttempts,
    isAutoReconnecting,
    // Allow browsing only if VPN is connected
    allowBrowsing: vpnStatus === "connected",
  };
}; 