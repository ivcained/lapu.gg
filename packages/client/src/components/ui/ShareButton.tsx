import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export const ShareButton = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      setError(null);

      // Get user context from Farcaster SDK
      const context = await sdk.context;

      // Use the user's display name or FID, fallback to 'Player'
      const username = context?.user?.displayName ||
                       context?.user?.username ||
                       context?.user?.fid?.toString() ||
                       'Player';

      // Generate share URL with username
      const shareUrl = `${window.location.origin}/api/share/${encodeURIComponent(username)}`;

      // Compose the cast with the share URL
      // The Farcaster client will fetch the metadata from this URL
      // and display the dynamic embed image
      const result = await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(
          `Check out Lapu! 🏝️ Building a floating city in the sky!`
        )}&embeds[]=${encodeURIComponent(shareUrl)}`
      );

      console.log("[Share]: Cast composed successfully", result);
    } catch (err) {
      console.error("[Share]: Error composing cast", err);
      setError(err instanceof Error ? err.message : "Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        className="px-4 py-2 rounded-md border border-gray-300 bg-gradient-to-br from-[#76ADAB] to-[#5A8A88] text-white font-medium shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? "Sharing..." : "🏝️ Share Lapu"}
      </button>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
