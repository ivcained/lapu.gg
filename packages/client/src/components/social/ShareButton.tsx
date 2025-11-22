/**
 * Example Social Sharing Component
 * Demonstrates proper navigation patterns using Farcaster SDK
 */

import { composeCast, openExternalUrl, isMiniApp } from "@/utils/navigation";

interface ShareButtonProps {
  /** Custom text to share */
  text?: string;
  /** URLs to embed in the cast */
  embeds?: string[];
  /** Button label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Share button component that uses Farcaster SDK for composing casts
 * @example
 * ```tsx
 * <ShareButton
 *   text="Check out my base in Lapu.gg!"
 *   embeds={[window.location.href]}
 *   label="Share Game"
 * />
 * ```
 */
export function ShareButton({
  text = "Check out Lapu.gg on Base!",
  embeds = [],
  label = "Share",
  className = "",
}: ShareButtonProps) {
  const handleShare = () => {
    // Include current URL in embeds if not already present
    const embedsToUse = embeds.length > 0 ? embeds : [window.location.href];

    composeCast({
      text,
      embeds: embedsToUse,
    });
  };

  // Only show share button in miniapp context
  if (!isMiniApp()) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
    >
      {label}
    </button>
  );
}

/**
 * External link button component that uses Farcaster SDK for opening URLs
 * @example
 * ```tsx
 * <ExternalLinkButton
 *   url="https://base.org"
 *   label="Visit Base.org"
 * />
 * ```
 */
export function ExternalLinkButton({
  url,
  label,
  className = "",
}: {
  url: string;
  label: string;
  className?: string;
}) {
  const handleClick = () => {
    openExternalUrl(url);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors ${className}`}
    >
      {label}
    </button>
  );
}

/**
 * Social links component demonstrating multiple external navigation patterns
 * @example
 * ```tsx
 * <SocialLinks />
 * ```
 */
export function SocialLinks() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <ShareButton
        text="Just played Lapu.gg - a gravity-defying city builder on Base! 🏗️"
        label="Share on Farcaster"
      />

      <ExternalLinkButton
        url="https://twitter.com/base"
        label="Follow on Twitter"
      />

      <ExternalLinkButton
        url="https://discord.gg/basechain"
        label="Join Discord"
      />

      <ExternalLinkButton
        url="https://base.org"
        label="Learn about Base"
      />
    </div>
  );
}
