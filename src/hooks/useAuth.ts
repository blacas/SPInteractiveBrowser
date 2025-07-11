import { useState, useEffect } from "react";

interface User {
  id: string;
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock authentication logic - replace with real API call
    if (credentials.email && credentials.password) {
      // Mock user data based on email for demo purposes
      const mockUser: User = {
        id: "user-123",
        name: credentials.email.includes("admin") ? "Admin User" : extractNameFromEmail(credentials.email),
        email: credentials.email,
        accessLevel: credentials.email.includes("admin") ? 3 : 
                    credentials.email.includes("manager") ? 2 : 1,
        avatar: undefined
      };
      
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });
      
      // Store auth state in localStorage for persistence
      localStorage.setItem("auth", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    localStorage.removeItem("auth");
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

  const checkAuthStatus = () => {
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
          console.log(`🔄 Updated cached user name from "${user.name}" to "${updatedUser.name}"`);
        }
        
        setAuthState({
          user: updatedUser,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}; 