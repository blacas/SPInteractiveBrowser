import { useState, useEffect } from "react";

type VPNStatus = "connected" | "connecting" | "disconnected";

export const useVPN = () => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>("disconnected");
  const [connectionLocation, setConnectionLocation] = useState("Australia");

  const connectVPN = async (): Promise<void> => {
    setVpnStatus("connecting");
    
    // Simulate VPN connection process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setVpnStatus("connected");
    setConnectionLocation("Australia");
  };

  const disconnectVPN = async (): Promise<void> => {
    setVpnStatus("disconnected");
    setConnectionLocation("");
  };

  // Auto-connect VPN when component mounts (simulate required VPN)
  useEffect(() => {
    const autoConnect = async () => {
      if (vpnStatus === "disconnected") {
        await connectVPN();
      }
    };

    autoConnect();
  }, []);

  return {
    vpnStatus,
    connectionLocation,
    connectVPN,
    disconnectVPN,
    isConnected: vpnStatus === "connected",
  };
}; 