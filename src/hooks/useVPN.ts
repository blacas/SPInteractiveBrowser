import { useState, useEffect } from "react";

type VPNStatus = "connected" | "connecting" | "disconnected" | "failed";

interface VPNConnection {
  endpoint: string;
  location: string;
  ipAddress?: string;
  latency?: number;
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
      const success = await (window as any).electronAPI?.vpn?.connect('wireguard');
      
      if (success) {
        setVpnStatus("connected");
        setRetryCount(0);
        console.log("✅ VPN Connected successfully via main process");
      } else {
        throw new Error("VPN connection failed via main process");
      }
    } catch (error) {
      console.error("❌ VPN connection failed:", error);
      setLastError("Failed to establish WireGuard VPN connection to Australia");
      setVpnStatus("failed");
      // Removed auto-retry logic - user must manually retry
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



  // Check VPN status on mount (but don't auto-connect)
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const status = await (window as any).electronAPI?.vpn?.getStatus();
        console.log(`🔍 Initial VPN status: ${status}`);
        if (status === 'connected') {
          setVpnStatus("connected");
        } else {
          setVpnStatus("disconnected");
        }
      } catch (error) {
        console.error("❌ Failed to check initial VPN status:", error);
        setVpnStatus("disconnected");
      }
    };

    checkInitialStatus();
  }, []);

  // Manual VPN status check function
  const checkVPNStatus = async (): Promise<void> => {
    setIsCheckingStatus(true);
    try {
      console.log("🔍 Manually checking VPN status...");
      const status = await (window as any).electronAPI?.vpn?.getStatus();
      console.log(`📊 VPN status check result: ${status}`);
      
      if (status === 'connected') {
        setVpnStatus("connected");
        setLastError(null);
        
        // Update connection info if available
        setConnection(prev => ({
          ...prev,
          ipAddress: "203.219.252.100", // Mock Australian IP
          latency: Math.floor(Math.random() * 50) + 20
        }));
        
        console.log("✅ VPN is connected to Australia");
      } else {
        setVpnStatus("disconnected");
        setLastError("WireGuard VPN is not connected to Australia");
        console.log("❌ VPN is not connected");
      }
    } catch (error) {
      console.error("❌ Failed to check VPN status:", error);
      setVpnStatus("failed");
      setLastError("Failed to check VPN connection status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

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
    // Prevent browser access if VPN fails (fail-closed for app traffic)
    allowBrowsing: vpnStatus === "connected",
  };
}; 