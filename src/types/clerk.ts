// Define types based on actual Clerk instance structure
export interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  publicMetadata?: {
    accessLevel?: number;
  };
  createdAt: number;
  lastSignInAt: number | null;
  [key: string]: any; // Allow for additional Clerk properties
}

export interface ClerkSession {
  id: string;
  status: string;
  lastActiveAt: number;
  expireAt: number;
  [key: string]: any; // Allow for additional Clerk properties
}

export interface AuthState {
  user: ClerkUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
} 