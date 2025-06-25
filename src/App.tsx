import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/layout/Dashboard";
import BrowserWindow from "@/components/browser/BrowserWindow";
import { useAuth } from "@/hooks/useAuth";
import { useVPN } from "@/hooks/useVPN";
import { vaultService } from "@/services/vaultService";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { vpnStatus } = useVPN();
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  // Initialize vault service on app start
  useEffect(() => {
    const initializeVault = async () => {
      try {
        await vaultService.initialize();
        setVaultInitialized(true);
        console.log('✅ Vault service initialized successfully');
      } catch (error) {
        setVaultError(error instanceof Error ? error.message : 'Vault initialization failed');
        console.error('❌ Vault initialization failed:', error);
      }
    };

    initializeVault();
  }, []);



  const handleAccessLevelChange = (newLevel: 1 | 2 | 3) => {
    if (user) {
      // Update user access level for MVP testing
      const updatedUser = { ...user, accessLevel: newLevel };
      // In a real app, this would make an API call
      // For MVP, we'll update localStorage
      localStorage.setItem("auth", JSON.stringify(updatedUser));
      // Force a page refresh to update the auth state
      window.location.reload();
    }
  };

  // Show loading screen while checking auth status or initializing vault
  if (isLoading || !vaultInitialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-white">
            {isLoading ? 'Initializing Secure Browser...' : 'Connecting to Vault Service...'}
          </p>
          {vaultError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">⚠️ Vault Service Error:</p>
              <p className="text-red-200 text-xs mt-1">{vaultError}</p>
              <p className="text-red-400 text-xs mt-2">
                SharePoint credentials may not be available. Please check vault configuration.
              </p>
            </div>
          )}
        </div>
      </div>
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
