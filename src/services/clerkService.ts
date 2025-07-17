import { Clerk } from '@clerk/clerk-js';
import type { ClerkUser, AuthState } from '../types/clerk';

class ClerkAuthService {
  private clerk: Clerk | null = null;
  private isInitialized = false;
  private authStateCallbacks: ((state: AuthState) => void)[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Get publishable key from environment (support multiple naming conventions)
      const publishableKey = import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        throw new Error('Clerk publishable key is required. Set VITE_CLERK_PUBLISHABLE_KEY, CLERK_PUBLISHABLE_KEY, or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file');
      }

      // Initialize Clerk using the constructor with OAuth popup configuration
      this.clerk = new Clerk(publishableKey);
      await this.clerk.load({
        // Configure OAuth to use popups in Electron
        allowedRedirectOrigins: [window.location.origin],
        // Enable popup mode for OAuth
        signInFallbackRedirectUrl: window.location.origin,
        signUpFallbackRedirectUrl: window.location.origin
      });

      // Set up auth state listener using proper Clerk listener pattern
      this.clerk.addListener((resources) => {
        this.notifyAuthStateChange({
          user: resources.user as ClerkUser | null,
          isLoaded: true,
          isSignedIn: !!resources.session
        });
      });

      this.isInitialized = true;
      console.log('✅ Clerk authentication initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Clerk:', error);
      throw error;
    }
  }

  async signIn(): Promise<void> {
    if (!this.clerk) throw new Error('Clerk not initialized');

    try {
      await this.clerk.openSignIn({        
        redirectUrl: window.location.origin,
        // Force popup mode for OAuth providers in Electron
        appearance: {
          elements: {
            socialButtonsBlockButton: {
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }
          }
        },
        // Configure OAuth to work better in Electron
        routing: 'hash'
      });
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  }

  async signUp(): Promise<void> {
    if (!this.clerk) throw new Error('Clerk not initialized');

    try {
      await this.clerk.openSignUp({
        redirectUrl: window.location.origin
      });
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (!this.clerk) throw new Error('Clerk not initialized');

    try {
      await this.clerk.signOut();
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  }

  getCurrentUser(): ClerkUser | null {
    if (!this.clerk || !this.clerk.user) return null;
    
    // Convert Clerk's UserResource to our ClerkUser interface
    const clerkUser = this.clerk.user;
    return {
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses || [],
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl || '',
      publicMetadata: clerkUser.publicMetadata,
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).getTime() : Date.now(),
      lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).getTime() : null,
    };
  }

  isSignedIn(): boolean {
    return !!this.clerk?.session;
  }

  isLoaded(): boolean {
    return !!this.clerk?.loaded;
  }

  getUserAccessLevel(): number {
    const user = this.getCurrentUser();
    return (user?.publicMetadata as { accessLevel?: number })?.accessLevel || 1;
  }

  onAuthStateChange(callback: (state: AuthState) => void): void {
    this.authStateCallbacks.push(callback);
  }

  removeAuthStateListener(callback: (state: AuthState) => void): void {
    const index = this.authStateCallbacks.indexOf(callback);
    if (index > -1) {
      this.authStateCallbacks.splice(index, 1);
    }
  }

  private notifyAuthStateChange(state: AuthState): void {
    this.authStateCallbacks.forEach(callback => callback(state));
  }

  // Get user email for SharePoint integration
  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user?.emailAddresses?.[0]?.emailAddress || null;
  }

  // Get user display name
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return 'User';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    if (fullName) return fullName;
    
    // Fallback to email username
    const email = this.getUserEmail();
    if (email) {
      return email.split('@')[0];
    }
    
    return 'User';
  }
}

// Export singleton instance
export const clerkAuth = new ClerkAuthService();
export default clerkAuth; 