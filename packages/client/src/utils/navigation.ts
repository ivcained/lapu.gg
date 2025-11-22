/**
 * Navigation utilities for Farcaster Mini App
 * Uses official @farcaster/miniapp-sdk for cross-client compatibility
 */

import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Check if running in a Farcaster Mini App context
 */
export function isMiniApp(): boolean {
  try {
    return sdk.context.client.clientFid !== null;
  } catch {
    return false;
  }
}

/**
 * Open an external URL in the client's in-app browser
 * Use this instead of HTML <a> tags or window.open()
 *
 * @param url - The external URL to open
 * @example
 * ```typescript
 * openExternalUrl('https://base.org')
 * ```
 */
export function openExternalUrl(url: string): void {
  if (isMiniApp()) {
    try {
      sdk.actions.openUrl(url);
    } catch (error) {
      console.error("[Navigation] Failed to open URL:", error);
      // Fallback for non-miniapp context
      window.open(url, "_blank");
    }
  } else {
    // Fallback for browser context
    window.open(url, "_blank");
  }
}

/**
 * Open the native composer with prefilled content
 * Use this instead of composer intent URLs like 'https://farcaster.com/~/compose?text=...'
 *
 * @param options - Composer options
 * @param options.text - The text to prefill in the composer
 * @param options.embeds - Optional array of URLs to embed (images, links, etc.)
 * @example
 * ```typescript
 * composeCast({
 *   text: 'Check out this game!',
 *   embeds: [window.location.href]
 * })
 * ```
 */
export function composeCast(options: {
  text: string;
  embeds?: string[];
}): void {
  if (isMiniApp()) {
    try {
      sdk.actions.composeCast({
        text: options.text,
        embeds: options.embeds || [],
      });
    } catch (error) {
      console.error("[Navigation] Failed to compose cast:", error);
      // Could show a fallback UI or error message
    }
  } else {
    console.warn("[Navigation] composeCast only works in Farcaster Mini App context");
  }
}

/**
 * View a specific cast by its URL
 * Use this instead of direct cast URLs
 *
 * @param castUrl - The full URL of the cast to view
 * @example
 * ```typescript
 * viewCast('https://base.app/post/0xffdec7c879aad726b5400d22ec8a89aaff6e0737')
 * ```
 */
export function viewCast(castUrl: string): void {
  if (isMiniApp()) {
    try {
      sdk.actions.viewCast(castUrl);
    } catch (error) {
      console.error("[Navigation] Failed to view cast:", error);
    }
  } else {
    console.warn("[Navigation] viewCast only works in Farcaster Mini App context");
  }
}

/**
 * Open a group conversation by ID
 * Users can only access groups they are members of
 *
 * @param conversationId - The unique identifier for the XMTP group conversation
 * @example
 * ```typescript
 * openGroupChat('0x1234...5678')
 * ```
 */
export function openGroupChat(conversationId: string): void {
  const deeplink = `cbwallet://messaging/${conversationId}`;
  openExternalUrl(deeplink);
}

/**
 * Open a direct message conversation with a user or agent
 *
 * @param address - The 0x address of the user or agent
 * @example
 * ```typescript
 * openDirectMessage('0xabc...1234')
 * ```
 */
export function openDirectMessage(address: string): void {
  const deeplink = `cbwallet://messaging/${address}`;
  openExternalUrl(deeplink);
}

/**
 * Get the current Farcaster context
 * Useful for conditional navigation based on client capabilities
 *
 * @returns The Farcaster SDK context or null if not in miniapp
 */
export function getFarcasterContext() {
  if (isMiniApp()) {
    try {
      return sdk.context;
    } catch (error) {
      console.error("[Navigation] Failed to get context:", error);
      return null;
    }
  }
  return null;
}
