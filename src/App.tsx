import { useVPN } from "@/hooks/useVPN";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { vaultService } from "@/services/vaultService";
import { vpnService } from "@/services/vpnService";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/layout/Dashboard";
import LoadingScreen from "@/components/ui/loading-screen";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/sonner";

import ErrorDisplay, { ErrorInfo, VPNStatus, EnvironmentStatus } from "@/components/ui/error-display";
import { EnvironmentValidator } from "@/config/environment";
import BrowserWindow from "@/components/browser/BrowserWindow";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <Toaster />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { vpnStatus } = useVPN();
  const [initStage, setInitStage] = useState<'auth' | 'vault' | 'vpn' | 'ready'>('auth');
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [vpnStatusInfo, setVpnStatusInfo] = useState<VPNStatus | null>(null);
  const [envStatusInfo, setEnvStatusInfo] = useState<EnvironmentStatus | null>(null);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [initProgress, setInitProgress] = useState(0);

  // Initialize services in sequence
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Stage 1: Environment validation
        setInitStage('auth');
        setInitProgress(10);
        
        // Validate environment configuration first
        let envConfig: Record<string, string | undefined> = {};
        
        try {
          const envConfigStr = await window.secureBrowser?.system.getEnvironment();
          if (envConfigStr) {
            envConfig = JSON.parse(envConfigStr);
            console.log('🔍 Environment config loaded:', {
              NODE_ENV: envConfig.NODE_ENV,
              VPN_PROVIDER: envConfig.VPN_PROVIDER,
              WIREGUARD_ENDPOINT: envConfig.WIREGUARD_ENDPOINT ? 'Set ✅' : 'Missing ❌'
            });
            
            const validation = EnvironmentValidator.validateEnvironment(envConfig);
            
            setEnvStatusInfo({
              loaded: true,
              valid: validation.isValid,
              errors: validation.errors,
              warnings: validation.warnings,
              config: {
                nodeEnv: envConfig.NODE_ENV,
                vpnProvider: envConfig.VPN_PROVIDER,
                wireguardEndpoint: envConfig.WIREGUARD_ENDPOINT,
                wireguardConfigPath: envConfig.WIREGUARD_CONFIG_PATH
              }
            });
            
            if (!validation.isValid) {
              setErrors([{
                type: 'environment',
                title: 'Environment Configuration Invalid',
                message: 'Configuration contains placeholder values or missing required settings',
                details: validation.errors,
                critical: true,
                action: 'Update your .env file with correct values'
              }]);
              return;
            }
            
            if (validation.warnings.length > 0) {
              console.warn('⚠️ Environment warnings:', validation.warnings);
            }
          } else {
            throw new Error('No environment configuration received');
          }
        } catch (error) {
          setEnvStatusInfo({
            loaded: false,
            valid: false,
            errors: ['Unable to load environment configuration'],
            warnings: [],
            config: undefined
          });
          
          setErrors([{
            type: 'config',
            title: 'Configuration Loading Failed',
            message: 'Unable to load environment configuration',
            details: [
              'Check if .env file exists in project root',
              'Ensure NODE_ENV=development (not production)',
              'Verify all required environment variables are set',
              error instanceof Error ? error.message : 'Unknown error'
            ],
            critical: true,
            action: 'Check .env file and restart application'
          }]);
          return;
        }
        
        // Wait for auth to be ready
        if (isLoading) return;
        
        setInitProgress(25);
        
        // Stage 2: Vault initialization  
        setInitStage('vault');
        setInitProgress(50);
        
        try {
          await vaultService.initialize();
          console.log('✅ Vault service initialized successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Vault initialization failed';
          setVaultError(errorMessage);
          console.error('❌ Vault initialization failed:', error);
          
          // Only set as critical error if vault is required
          // For now, allow continuation without vault
        }
        
        // Stage 3: VPN initialization
        setInitStage('vpn');
        setInitProgress(75);
        
        // Real VPN connection with retry logic and proper error handling
        try {
          // First check if VPN is already connected (to avoid unnecessary reconnection attempts)
          console.log('🔍 Checking existing VPN connection status...');
          let vpnConnected = await vpnService.isConnected();
          
          const maxRetries = 3;
          
          if (vpnConnected) {
            console.log('✅ VPN is already connected, skipping connection attempt');
          } else {
            let retryCount = 0;
            
            // Try connecting with retries - don't show error immediately
            while (!vpnConnected && retryCount < maxRetries) {
              console.log(`🔄 VPN connection attempt ${retryCount + 1}/${maxRetries}...`);
              vpnConnected = await vpnService.connect();
              
              if (!vpnConnected && retryCount < maxRetries - 1) {
                console.log(`⏳ VPN connection attempt ${retryCount + 1} failed, retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
              retryCount++;
            }
          }
          
          setVpnStatusInfo({
            connected: vpnConnected,
            provider: envConfig?.VPN_PROVIDER || 'wireguard',
            endpoint: envConfig?.WIREGUARD_ENDPOINT,
            location: 'Australia',
            lastCheck: new Date()
          });
          
          if (!vpnConnected) {
            // Only show error after all retries failed
            console.log(`❌ VPN connection failed after ${maxRetries} attempts`);
            setErrors([{
              type: 'vpn',
              title: 'VPN Connection Failed',
              message: 'Failed to establish VPN connection to Australian servers after multiple attempts',
              details: [
                'VPN connection is required for security compliance',
                'All browsing must be routed through Australian servers',
                'Check your WireGuard configuration and server status',
                'Ensure WireGuard GUI is running and tunnel is active'
              ],
              critical: true,
              action: 'Connect WireGuard and retry'
            }]);
            return;
          }
          console.log('✅ VPN connected successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'VPN connection failed';
          
          setVpnStatusInfo({
            connected: false,
            provider: envConfig?.VPN_PROVIDER || 'wireguard',
            endpoint: envConfig?.WIREGUARD_ENDPOINT,
            location: 'Australia',
            lastCheck: new Date()
          });
          
          setErrors([{
            type: 'vpn',
            title: 'VPN Connection Error',
            message: errorMessage,
            details: [
              'VPN connection failed during startup',
              'Check your network connection',
              'Verify WireGuard configuration file',
              'Ensure your Australian VPS server is running',
              'Make sure WireGuard GUI is installed and running'
            ],
            critical: true,
            action: 'Fix VPN configuration and retry'
          }]);
          return;
        }
        
        // Stage 4: Ready
        setInitStage('ready');
        setInitProgress(100);
        
      } catch (error) {
        console.error('❌ Service initialization failed:', error);
        setErrors([{
          type: 'config',
          title: 'Application Initialization Failed',
          message: 'Application initialization failed',
          details: [error instanceof Error ? error.message : 'Unknown error occurred'],
          critical: true,
          action: 'Check configuration and restart application'
        }]);
      }
    };

    initializeServices();
  }, [isLoading]);

  const handleAccessLevelChange = async (newLevel: 1 | 2 | 3) => {
    if (user) {
      try {
        // Show loading state while changing access level
        setInitStage('vpn');
        setInitProgress(50);
        
        // Update user access level for MVP testing
        const updatedUser = { ...user, accessLevel: newLevel };
        // In a real app, this would make an API call
        // For MVP, we'll update localStorage
        localStorage.setItem("auth", JSON.stringify(updatedUser));
        
        console.log(`🔄 Changing access level to ${newLevel}...`);
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update state directly instead of forcing reload
        setInitStage('ready');
        setInitProgress(100);
        
        // Clear any existing errors
        setErrors([]);
        
        console.log(`✅ Access level changed to ${newLevel} successfully`);
        
        // Force re-render by triggering auth state update
        window.location.reload();
      } catch (error) {
        console.error('❌ Failed to change access level:', error);
        setInitStage('ready');
        setInitProgress(100);
      }
    }
  };

  // Show error screen if initialization failed
  if (errors.length > 0) {
    return (
      <ErrorDisplay
        errors={errors}
        vpnStatus={vpnStatusInfo || undefined}
        environmentStatus={envStatusInfo || undefined}
        onRetry={() => {
          setErrors([]);
          setInitStage('auth');
          setInitProgress(0);
          // Trigger re-initialization
          window.location.reload();
        }}
        onOpenSettings={() => {
          console.log('Opening settings...');
          // TODO: Implement settings modal
        }}
      />
    );
  }

  // Show loading screen during initialization
  if (isLoading || initStage !== 'ready') {
    const currentMessage = (() => {
      switch (initStage) {
        case 'auth':
          return 'Validating configuration and starting secure browser environment...';
        case 'vault':
          return vaultError ? 'Vault connection failed - continuing with reduced functionality' : 'Connecting to secure credential vault...';
        case 'vpn':
          return 'Establishing secure VPN tunnel to Australia...';
        case 'ready':
          return 'All systems ready! Launching secure browser...';
        default:
          return 'Initializing...';
      }
    })();

    return (
      <LoadingScreen
        stage={initStage}
        message={currentMessage}
        error={vaultError}
        progress={initProgress}
      />
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} />;
  }

  // Show main dashboard with browser
  return (
    <Dashboard
      user={user}
      vpnStatus={vpnStatus}
      onLogout={logout}
      onAccessLevelChange={handleAccessLevelChange}
    >
      <BrowserWindow />
    </Dashboard>
  );
}

export default App;
