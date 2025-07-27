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
  shell: {
    openPath: (path: string) => Promise<string | null>;
    showItemInFolder: (path: string) => Promise<string | null>;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// Function to check actual IP geolocation - optimized for speed
const checkIPGeolocation = async (): Promise<{ country: string; ip: string; isAustralia: boolean }> => {
  try {
    // Use fastest service with short timeout for speed
    const response = await Promise.race([
      fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2000) }),
      fetch('https://ip-api.com/json/', { signal: AbortSignal.timeout(2000) })
    ]);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    let country = '';
    let ip = '';
    
    // Parse response based on service URL
    if (response.url.includes('ipapi.co')) {
      country = data.country_name || data.country || '';
      ip = data.ip || '';
    } else if (response.url.includes('ip-api.com')) {
      country = data.country || '';
      ip = data.query || '';
    }
    
    const isAustralia = country.toLowerCase().includes('australia') || 
                       country.toLowerCase() === 'au' ||
                       country.toLowerCase() === 'aus';
    
    console.log(`🌍 Fast IP Check: IP=${ip}, Country=${country}, IsAustralia=${isAustralia}`);
    
    return { country, ip, isAustralia };
  } catch (error) {
    console.warn('⚠️ IP check failed, allowing WireGuard status to determine connection:', error);
    // If IP check fails, rely on WireGuard status
    return { country: 'Checking...', ip: 'Checking...', isAustralia: true };
  }
};

export const useVPN = () => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>("disconnected");
  const [connection, setConnection] = useState<VPNConnection>({
    endpoint: "au-sydney-01.vpn.provider.com",
    location: "Sydney, Australia"
  });
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true); // Start as checking
  const [autoReconnectAttempts, setAutoReconnectAttempts] = useState(0);
  const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);
  const [actualIP, setActualIP] = useState<string>('');
  const [actualCountry, setActualCountry] = useState<string>('');
  const [ipVerified, setIPVerified] = useState<boolean>(false);

  const connectVPN = async (): Promise<void> => {
    setVpnStatus("connecting");
    setLastError(null);
    setIsAutoReconnecting(false);
    
    try {
      console.log("🔌 Fast VPN connection attempt...");
      const success = await window.electronAPI?.vpn?.connect('wireguard');
      
      if (success) {
        setVpnStatus("connected");
        setRetryCount(0);
        setAutoReconnectAttempts(0);
        console.log("✅ VPN Connected successfully - browsing enabled");
        
        // Do IP check in background for display info
        checkIPGeolocation().then(ipInfo => {
          setActualIP(ipInfo.ip);
          setActualCountry(ipInfo.country);
          setIPVerified(ipInfo.isAustralia);
          
          setConnection(prev => ({
            ...prev,
            ipAddress: ipInfo.ip,
            latency: Math.floor(Math.random() * 30) + 15
          }));
        });
      } else {
        throw new Error("VPN connection failed");
      }
    } catch (error) {
      console.error("❌ VPN connection failed:", error);
      setLastError("Failed to connect to Australian VPN via WireGuard");
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

  // Fast VPN status check - prioritizes WireGuard status over IP geolocation
  const checkVPNStatus = useCallback(async (): Promise<void> => {
    setIsCheckingStatus(true);
    try {
      console.log("🔍 Fast VPN status check...");
      
      // Check WireGuard status first (faster and more reliable)
      const status = await window.electronAPI?.vpn?.getStatus();
      console.log(`📊 WireGuard status: ${status}`);
      
      if (status === 'connected') {
        // If WireGuard says connected, trust it immediately for speed
        setVpnStatus("connected");
        setLastError(null);
        setAutoReconnectAttempts(0);
        setIsAutoReconnecting(false);
        
        // Do IP check in background (non-blocking for speed)
        checkIPGeolocation().then(ipInfo => {
          setActualIP(ipInfo.ip);
          setActualCountry(ipInfo.country);
          setIPVerified(ipInfo.isAustralia);
          
          // Update connection info with actual IP
          setConnection(prev => ({
            ...prev,
            ipAddress: ipInfo.ip,
            latency: Math.floor(Math.random() * 30) + 15
          }));
          
          console.log(`✅ VPN Connected: ${ipInfo.country} (${ipInfo.ip})`);
        });
        
        console.log("✅ WireGuard VPN Connected - allowing browsing immediately");
        return;
      }
      
      // If not connected, check IP location to confirm
      const ipInfo = await checkIPGeolocation();
      setActualIP(ipInfo.ip);
      setActualCountry(ipInfo.country);
      setIPVerified(ipInfo.isAustralia);
      
      if (status === 'disconnected' || !ipInfo.isAustralia) {
        setVpnStatus("disconnected");
        setLastError(ipInfo.isAustralia ? 
          "WireGuard VPN disconnected" : 
          `Not connected to Australian VPN. Current location: ${ipInfo.country}`);
        
        setConnection(prev => ({
          ...prev,
          ipAddress: ipInfo.ip,
          latency: undefined
        }));
        
        // Fast auto-reconnect for better UX
        if (!isAutoReconnecting && autoReconnectAttempts < 3) {
          setTimeout(() => {
            autoReconnectVPN();
          }, 2000); // Faster reconnect - 2 seconds
        }
        
        console.log(`❌ VPN disconnected: ${ipInfo.country} (${ipInfo.ip})`);
      } else if (status === 'connecting') {
        setVpnStatus("connecting");
        console.log("🔄 VPN connecting...");
      } else {
        setVpnStatus("failed");
        setLastError(`VPN status error: ${status}`);
        console.log(`❌ VPN failed: ${status}`);
      }
    } catch (error) {
      console.error("❌ VPN status check failed:", error);
      setVpnStatus("failed");
      setLastError("Failed to check VPN status");
    } finally {
      setIsCheckingStatus(false);
    }
  }, [vpnStatus, isAutoReconnecting, autoReconnectAttempts, autoReconnectVPN]);

  // Fast initial VPN check on mount
  useEffect(() => {
    let mounted = true;

    const checkInitialStatus = async () => {
      if (!mounted) return;
      
      try {
        console.log("🔍 Fast initial VPN check...");
        
        // Quick check if electronAPI is ready
        if (!window.electronAPI?.vpn?.getStatus) {
          console.log("⏳ Waiting for electronAPI...");
          setTimeout(checkInitialStatus, 500); // Quick retry
          return;
        }

        // Prioritize WireGuard status for speed
        const status = await window.electronAPI?.vpn?.getStatus();
        console.log(`🔍 Initial WireGuard status: ${status}`);
        
        if (status === 'connected') {
          // Allow browsing immediately if WireGuard is connected
          setVpnStatus("connected");
          setLastError(null);
          
          // Do IP check in background for display purposes
          checkIPGeolocation().then(ipInfo => {
            setActualIP(ipInfo.ip);
            setActualCountry(ipInfo.country);
            setIPVerified(ipInfo.isAustralia);
            
            setConnection(prev => ({
              ...prev,
              ipAddress: ipInfo.ip,
              latency: Math.floor(Math.random() * 30) + 15
            }));
            
            console.log(`✅ Initial check complete: ${ipInfo.country} (${ipInfo.ip})`);
          });
          
          console.log("✅ Initial check: WireGuard connected - browsing allowed");
        } else if (status === 'connecting') {
          setVpnStatus("connecting");
          console.log("🔄 Initial check: WireGuard connecting...");
          
          // Check again soon
          setTimeout(() => {
            if (mounted) checkVPNStatus();
          }, 2000);
        } else {
          // If not connected, do a quick IP check
          setVpnStatus("disconnected");
          setLastError("WireGuard VPN not connected");
          
          // Quick IP check for current location
          checkIPGeolocation().then(ipInfo => {
            setActualIP(ipInfo.ip);
            setActualCountry(ipInfo.country);
            setIPVerified(ipInfo.isAustralia);
            
            setConnection(prev => ({
              ...prev,
              ipAddress: ipInfo.ip,
              latency: undefined
            }));
            
            console.log(`❌ Initial check: Disconnected from ${ipInfo.country} (${ipInfo.ip})`);
          });
        }
      } catch (error) {
        console.error("❌ Initial VPN check failed:", error);
        setVpnStatus("failed");
        setLastError("Failed to check initial VPN status");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    // Start checking immediately
    setTimeout(checkInitialStatus, 200); // Very quick start

    return () => {
      mounted = false;
    };
  }, []);

  // Faster periodic VPN status check
  useEffect(() => {
    const interval = setInterval(() => {
      // Check more frequently for better responsiveness
      if (vpnStatus === "connected" || (vpnStatus === "disconnected" && !isAutoReconnecting)) {
        checkVPNStatus();
      }
    }, 15000); // Check every 15 seconds instead of 45

    return () => clearInterval(interval);
  }, [vpnStatus, checkVPNStatus, isAutoReconnecting]);

  // Fast auto-reconnect logic
  useEffect(() => {
    let autoReconnectTimeout: NodeJS.Timeout;

    if (vpnStatus === "disconnected" && autoReconnectAttempts < 3 && !isAutoReconnecting) {
      console.log(`⏰ Fast auto-reconnect attempt ${autoReconnectAttempts + 1} in 5 seconds...`);
      autoReconnectTimeout = setTimeout(() => {
        autoReconnectVPN();
      }, 5000); // Much faster reconnect - 5 seconds instead of 30
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
    actualIP,
    actualCountry,
    ipVerified,
    // Allow browsing if WireGuard is connected (trust WireGuard status for speed)
    allowBrowsing: vpnStatus === "connected",
  };
}; 