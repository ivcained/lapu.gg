import React, { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import type { MiniAppContext } from "./types";

type FarcasterContextType = {
  isInMiniApp: boolean;
  context: MiniAppContext | null;
  loading: boolean;
  error: Error | null;
};

const FarcasterContext = createContext<FarcasterContextType | undefined>(
  undefined
);

type FarcasterProviderProps = {
  children: React.ReactNode;
};

export const FarcasterProvider: React.FC<FarcasterProviderProps> = ({
  children,
}) => {
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFarcasterContext = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp();
        setIsInMiniApp(miniAppStatus);

        if (miniAppStatus) {
          // Get context and extract user info
          const miniAppContext = await sdk.context;
          setContext(miniAppContext as MiniAppContext);

          console.log("[Farcaster Context]: Loaded successfully", {
            user: miniAppContext.user,
            location: miniAppContext.location?.type,
            client: miniAppContext.client,
            features: miniAppContext.features,
          });
        } else {
          console.log("[Farcaster Context]: Not running in Mini App");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error("[Farcaster Context]: Error loading context", error);
      } finally {
        setLoading(false);
      }
    };

    loadFarcasterContext();
  }, []);

  return (
    <FarcasterContext.Provider
      value={{ isInMiniApp, context, loading, error }}
    >
      {children}
    </FarcasterContext.Provider>
  );
};

/**
 * Hook to access Farcaster Mini App context
 * @returns Farcaster context including user, location, client, and features
 */
export const useFarcaster = (): FarcasterContextType => {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error("useFarcaster must be used within a FarcasterProvider");
  }
  return context;
};

/**
 * Hook to get the current user from Farcaster context
 * @returns User profile data or null if not in a Mini App
 */
export const useFarcasterUser = () => {
  const { context } = useFarcaster();
  return context?.user ?? null;
};

/**
 * Hook to get the location context (where the Mini App was opened)
 * @returns Location context or null
 */
export const useFarcasterLocation = () => {
  const { context } = useFarcaster();
  return context?.location ?? null;
};

/**
 * Hook to get client information
 * @returns Client context including platform type, safe area insets, etc.
 */
export const useFarcasterClient = () => {
  const { context } = useFarcaster();
  return context?.client ?? null;
};

/**
 * Hook to get available features in the current client
 * @returns Features context (haptics, camera access, etc.)
 */
export const useFarcasterFeatures = () => {
  const { context } = useFarcaster();
  return context?.features ?? null;
};
