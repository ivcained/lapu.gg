import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Synchronous helper to check if we're running in a Farcaster miniapp context
 * This is a quick heuristic check and should be confirmed with sdk.isInMiniApp() for accuracy
 * @returns boolean indicating if likely running in a miniapp
 */
export const isMiniAppSync = (): boolean => {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  // Check for miniapp query param or if loaded in Farcaster client
  return (
    url.searchParams.get("miniApp") === "true" ||
    window.parent !== window || // Loaded in iframe
    navigator.userAgent.includes("Farcaster")
  );
};

/**
 * Async helper to check if we're running in a Farcaster miniapp context
 * Uses the official SDK method for accurate detection
 * @returns Promise<boolean> indicating if running in a miniapp
 */
export const isMiniApp = async (): Promise<boolean> => {
  try {
    return await sdk.isInMiniApp();
  } catch (error) {
    console.warn("[Farcaster]: Error checking miniapp status", error);
    // Fall back to synchronous check
    return isMiniAppSync();
  }
};

/**
 * Signal to Farcaster that the app is ready to display
 * This hides the splash screen in the Farcaster client
 */
export const signalReady = async (): Promise<void> => {
  try {
    const inMiniApp = await isMiniApp();
    if (inMiniApp) {
      await sdk.actions.ready();
      console.log("[Farcaster]: Mini app ready signal sent");
    }
  } catch (error) {
    console.warn("[Farcaster]: Failed to send ready signal", error);
  }
};
