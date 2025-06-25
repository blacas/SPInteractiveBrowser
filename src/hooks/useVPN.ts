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

  const connectVPN = async (): Promise<void> => {
    setVpnStatus("connecting");
    setLastError(null);
    
    try {
      // Simulate VPN connection to Australian endpoint
      // In production, this would integrate with actual VPN provider API
      console.log(`Connecting to Australian VPN: ${connection.endpoint}`);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate IP verification to ensure Australian origin
      const mockAustralianIP = "203.219.252.100"; // Example AU IP
      
      setConnection(prev => ({
        ...prev,
        ipAddress: mockAustralianIP,
        latency: Math.floor(Math.random() * 50) + 20 // 20-70ms
      }));
      
      setVpnStatus("connected");
      setRetryCount(0);
      
      console.log("VPN Connected - Australian IP confirmed:", mockAustralianIP);
    } catch (error) {
      console.error("VPN connection failed:", error);
      setLastError("Failed to establish VPN connection to Australia");
      setVpnStatus("failed");
      
      // Auto-retry logic (fail-closed behavior)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connectVPN();
        }, 5000);
      }
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

  // Verify Australian IP origin
  const verifyAustralianOrigin = async (): Promise<boolean> => {
    try {
      // In production, this would call a geolocation API
      // to verify the exit IP is in Australia
      return connection.ipAddress?.startsWith("203.") || false;
    } catch {
      return false;
    }
  };

  // Auto-connect VPN when component mounts (required for app traffic)
  useEffect(() => {
    const autoConnect = async () => {
      if (vpnStatus === "disconnected") {
        console.log("Auto-connecting VPN for secure browser access...");
        await connectVPN();
      }
    };

    autoConnect();
  }, []);

  // Monitor VPN connection health
  useEffect(() => {
    if (vpnStatus === "connected") {
      const healthCheck = setInterval(async () => {
        const isValidAustralian = await verifyAustralianOrigin();
        if (!isValidAustralian) {
          console.warn("VPN connection lost Australian origin - reconnecting...");
          connectVPN();
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(healthCheck);
    }
  }, [vpnStatus]);

  return {
    vpnStatus,
    connection,
    connectVPN,
    disconnectVPN,
    retryCount,
    lastError,
    isConnected: vpnStatus === "connected",
    isConnecting: vpnStatus === "connecting",
    hasFailed: vpnStatus === "failed",
    // Prevent browser access if VPN fails (fail-closed for app traffic)
    allowBrowsing: vpnStatus === "connected",
  };
}; 