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
        name: credentials.email.includes("admin") ? "Admin User" : "John Doe",
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

  const checkAuthStatus = () => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth);
        setAuthState({
          user,
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