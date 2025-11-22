import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface UserData {
  fid: number;
  authenticated: boolean;
}

interface AuthContextType {
  token: string | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get the backend origin from environment or default to current origin
const getBackendOrigin = () => {
  if (typeof window === 'undefined') return '';

  // In production, use the same origin
  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  // In development, allow override via env var
  return import.meta.env.VITE_API_URL || window.location.origin;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get JWT token from Farcaster Quick Auth
      const { token: authToken } = await sdk.quickAuth.getToken();
      setToken(authToken);

      // Verify the token with backend and get user data
      const backendOrigin = getBackendOrigin();
      const response = await fetch(`${backendOrigin}/api/auth`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Authentication verification failed');
      }

      const data = await response.json();
      setUserData(data);

      console.log('[Auth]: Successfully authenticated user', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('[Auth]: Authentication error:', err);

      // Clear auth state on error
      setToken(null);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUserData(null);
    setError(null);
    console.log('[Auth]: User signed out');
  }, []);

  const value: AuthContextType = {
    token,
    userData,
    isAuthenticated: !!token && !!userData,
    isLoading,
    signIn,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
