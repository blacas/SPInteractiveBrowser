import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/layout/Dashboard";
import BrowserWindow from "@/components/browser/BrowserWindow";
import { useAuth } from "@/hooks/useAuth";
import { useVPN } from "@/hooks/useVPN";
import "./App.css";

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { vpnStatus } = useVPN();



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

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-white">Initializing Secure Browser...</p>
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
