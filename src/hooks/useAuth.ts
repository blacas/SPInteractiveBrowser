import { useState, useEffect } from "react";
import { SecureBrowserDatabaseService } from '@/services/databaseService';
import { supabase } from '@/lib/supabase';

interface User {
  id: number; // Changed from string to number
  name: string;
  email: string;
  accessLevel: 1 | 2 | 3;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic credential validation
      if (!credentials.email || !credentials.password) {
        // Log failed login attempt
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Login attempt failed: Missing email or password`,
          'medium',
          supabase
        );
        
        throw new Error("Email and password are required");
      }

      // Additional validation - email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Login attempt failed: Invalid email format for ${credentials.email}`,
          'medium',
          supabase
        );
        
        throw new Error("Invalid email format");
      }

      // Additional validation - password length
      if (credentials.password.length < 3) { // Simple validation for MVP
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Login attempt failed: Password too short for ${credentials.email}`,
          'medium',
          supabase
        );
        
        throw new Error("Password is too short");
      }

      // Extract name from email for user creation
      const userName = credentials.email.includes("admin") ? "Admin User" : extractNameFromEmail(credentials.email);
      
      // Log login attempt
      await SecureBrowserDatabaseService.logSecurityEvent(
        'unauthorized_access',
        `Login attempt for user: ${credentials.email}`,
        'low',
        supabase
      );
      
      // Initialize database session
      const success = await SecureBrowserDatabaseService.initializeUserSession(credentials.email, userName);
      
      if (!success) {
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Login failed: Database session initialization failed for ${credentials.email}`,
          'high',
          supabase
        );
        
        throw new Error("Failed to initialize user session");
      }

      // Get the current user from database service
      const dbUser = SecureBrowserDatabaseService.getCurrentUser();
      
      if (!dbUser) {
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Login failed: Could not retrieve user data for ${credentials.email}`,
          'high',
          supabase
        );
        
        throw new Error("Failed to retrieve user data");
      }

      // Update last login time
      await SecureBrowserDatabaseService.updateLastLogin();

      // Create the user object for the frontend
      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        accessLevel: dbUser.access_level as 1 | 2 | 3,
        avatar: undefined
      };
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      // Store auth state in localStorage for persistence
      localStorage.setItem("auth", JSON.stringify(user));
      
      // Start session monitoring
      SecureBrowserDatabaseService.startSessionMonitoring(supabase);
      
      // Log successful login
      await SecureBrowserDatabaseService.logSecurityEvent(
        'unauthorized_access',
        `User successfully logged in: ${credentials.email} with access level ${dbUser.access_level}`,
        'low',
        supabase
      );
      
      // console.log('✅ Login successful for:', credentials.email, 'with access level:', dbUser.access_level);
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      // Log login failure with details
      await SecureBrowserDatabaseService.logSecurityEvent(
        'unauthorized_access',
        `Login failed for ${credentials.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'medium',
        supabase
      );

      // console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const currentUser = authState.user;
      
      // Log logout attempt
      if (currentUser) {
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `User initiated logout: ${currentUser.email}`,
          'low',
          supabase
        );
      }
      
      // End database session before clearing state
      await SecureBrowserDatabaseService.endSession();
      
      // Clear authentication state
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      localStorage.removeItem("auth");
      
      // Log successful logout
      if (currentUser) {
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `User successfully logged out: ${currentUser.email}`,
          'low',
          supabase
        );
      }
      
      // console.log('✅ User logged out successfully');
      
    } catch (error) {
      // console.error('❌ Error during logout:', error);

      // Log logout error but still clear local state
      await SecureBrowserDatabaseService.logSecurityEvent(
        'unauthorized_access',
        `Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'medium',
        supabase
      );
      
      // Still clear the state even if database cleanup fails
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      localStorage.removeItem("auth");
    }
  };

  // Extract name from email (shared function)
  const extractNameFromEmail = (email: string): string => {
    const username = email.split('@')[0];
    
    // Handle common separators in email usernames
    const nameParts = username.split(/[._-]/).filter(part => part.length > 0);
    
    // Capitalize each part and join with space
    const formattedName = nameParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
    
    // If it's a single part or short, add "User" suffix
    if (formattedName.length < 4 || !formattedName.includes(' ')) {
      return formattedName + ' User';
    }
    
    return formattedName;
  };

  const checkAuthStatus = async () => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth);
        
        // Migration: Update old hardcoded names with email-based names
        let updatedUser = { ...user };
        if (user.name === "John Doe" || user.name === "Admin User") {
          updatedUser.name = user.email.includes("admin") ? "Admin User" : extractNameFromEmail(user.email);
          
          // Update localStorage with new name
          localStorage.setItem("auth", JSON.stringify(updatedUser));
          // console.log(`🔄 Updated cached user name from "${user.name}" to "${updatedUser.name}"`);
        }
        
        // Log session restoration
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Session restored for user: ${updatedUser.email}`,
          'low',
          supabase
        );
        
        setAuthState({
          user: updatedUser,
          isLoading: false,
          isAuthenticated: true,
        });
        
        // Restart session monitoring if user was restored from localStorage
        SecureBrowserDatabaseService.startSessionMonitoring(supabase);
        
      } catch (error) {
        // console.error('❌ Failed to restore auth session:', error);

        // Log session restoration failure
        await SecureBrowserDatabaseService.logSecurityEvent(
          'unauthorized_access',
          `Failed to restore user session from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'medium',
          supabase
        );
        
        localStorage.removeItem("auth");
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Session timeout functionality
  useEffect(() => {
    let sessionTimeout: NodeJS.Timeout;
    
    if (authState.isAuthenticated && authState.user) {
      // Set session timeout (30 minutes of inactivity)
      const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
      
      const resetTimeout = () => {
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
        
        sessionTimeout = setTimeout(async () => {
          // console.warn('⚠️ Session timeout reached');
          
          // Log session timeout
          await SecureBrowserDatabaseService.logSecurityEvent(
            'session_timeout',
            `User session timed out due to inactivity: ${authState.user?.email}`,
            'medium',
            supabase
          );
          
          // Auto-logout due to timeout
          await logout();
          
          alert('Your session has expired due to inactivity. Please log in again.');
        }, TIMEOUT_DURATION);
      };
      
      // Reset timeout on user activity
      const handleActivity = () => {
        resetTimeout();
      };
      
      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });
      
      // Initial timeout setup
      resetTimeout();
      
      // Cleanup
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
      };
    }
  }, [authState.isAuthenticated, authState.user]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}; 