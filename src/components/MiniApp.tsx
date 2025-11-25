"use client";

import { useEffect, useRef } from "react";
import { useMiniApp } from "@neynar/react";
import sdk from "@farcaster/miniapp-sdk";
import { HomeTab } from "~/components/ui/tabs";

// --- Types ---
export enum Tab {
  Home = "home",
}

export interface AppProps {
  title?: string;
}

/**
 * MiniApp component serves as the main container for the Lapu mini app.
 *
 * This component orchestrates the overall mini app experience by:
 * - Managing tab navigation and state
 * - Handling Farcaster mini app initialization
 * - Providing error handling and loading states
 * - Rendering the home tab content
 *
 * The component integrates with the Neynar SDK for Farcaster functionality
 * and ensures proper initialization by calling sdk.actions.ready() after
 * the interface has fully loaded.
 *
 * Features:
 * - Tab-based navigation (currently Home tab only)
 * - Farcaster mini app integration with ready() call
 * - Safe area inset handling for different devices
 * - Loading states for SDK initialization
 *
 * @example
 * ```tsx
 * <MiniApp />
 * ```
 */
export default function MiniApp() {
  // --- Hooks ---
  const { isSDKLoaded, context, setInitialTab, currentTab } = useMiniApp();
  const readyCalledRef = useRef(false);

  // --- Effects ---
  /**
   * Sets the initial tab to "home" when the SDK is loaded.
   *
   * This effect ensures that users start on the home tab when they first
   * load the mini app. It only runs when the SDK is fully loaded to
   * prevent errors during initialization.
   */
  useEffect(() => {
    if (isSDKLoaded) {
      setInitialTab(Tab.Home);
    }
  }, [isSDKLoaded, setInitialTab]);

  /**
   * Call ready() after the interface has loaded to avoid jitter
   * Wait for SDK to load and component to render
   */
  useEffect(() => {
    if (isSDKLoaded && currentTab === Tab.Home && !readyCalledRef.current) {
      // Use requestAnimationFrame to ensure DOM has rendered
      const frameId = requestAnimationFrame(() => {
        try {
          sdk.actions.ready();
          readyCalledRef.current = true;
          if (process.env.NODE_ENV === "development") {
            console.log("SDK ready() called successfully");
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error calling sdk.actions.ready():", error);
          }
        }
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [isSDKLoaded, currentTab]);

  // --- Early Returns ---
  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading SDK...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {/* Main content - no header or footer */}
      <div className="container py-2">
        {/* Tab content rendering - only Home tab for Lapu */}
        {currentTab === Tab.Home && <HomeTab />}
      </div>
    </div>
  );
}
