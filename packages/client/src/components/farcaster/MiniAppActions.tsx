import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useFarcaster, useFarcasterUser } from "@/farcaster";

/**
 * Comprehensive demo of all Farcaster Mini App SDK actions
 * This component showcases all available SDK features and actions
 */
export const MiniAppActions = () => {
  const { isInMiniApp, loading } = useFarcaster();
  const user = useFarcasterUser();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const showStatus = (message: string) => {
    setStatus(message);
    setError(null);
    setTimeout(() => setStatus(""), 3000);
  };

  const showError = (err: unknown) => {
    const errorMsg = err instanceof Error ? err.message : String(err);
    setError(errorMsg);
    console.error("[MiniApp Action Error]:", err);
  };

  // Action: Open URL
  const handleOpenUrl = async () => {
    try {
      const result = await sdk.actions.openUrl("https://lapu.gg");
      showStatus("URL opened successfully");
      console.log("Open URL result:", result);
    } catch (err) {
      showError(err);
    }
  };

  // Action: Compose Cast
  const handleComposeCast = async () => {
    try {
      const result = await sdk.actions.composeCast({
        text: `Just played Lapu! 🏝️ Building a floating city in the sky! Come join me!`,
        embeds: [`${window.location.origin}`],
      });
      showStatus("Cast composer opened");
      console.log("Compose cast result:", result);
    } catch (err) {
      showError(err);
    }
  };

  // Action: Add Mini App to favorites
  const handleAddMiniApp = async () => {
    try {
      const result = await sdk.actions.addMiniApp();
      showStatus(
        result.added ? "Added to favorites!" : "Already in favorites"
      );
      console.log("Add mini app result:", result);
    } catch (err) {
      showError(err);
    }
  };

  // Action: Trigger haptic feedback
  const handleHaptic = async () => {
    try {
      await sdk.actions.haptic("impact");
      showStatus("Haptic feedback triggered");
    } catch (err) {
      showError(err);
    }
  };

  // Action: Close Mini App
  const handleClose = async () => {
    try {
      await sdk.actions.close();
      showStatus("Mini app closing...");
    } catch (err) {
      showError(err);
    }
  };

  // Action: View specific cast
  const handleViewCast = async () => {
    try {
      // Example cast URL - replace with actual cast hash
      const castUrl = "https://warpcast.com/farcaster/0x1234";
      await sdk.actions.viewCast(castUrl);
      showStatus("Opening cast...");
    } catch (err) {
      showError(err);
    }
  };

  // Action: Open channel
  const handleOpenChannel = async () => {
    try {
      await sdk.actions.openChannel("farcaster");
      showStatus("Opening channel...");
    } catch (err) {
      showError(err);
    }
  };

  // Action: View user profile
  const handleViewProfile = async () => {
    try {
      if (user?.fid) {
        await sdk.actions.viewProfile(user.fid);
        showStatus("Opening your profile...");
      } else {
        showError(new Error("User FID not available"));
      }
    } catch (err) {
      showError(err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!isInMiniApp) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-yellow-900">
            ⚠️ Not in Mini App Context
          </h3>
          <p className="text-sm text-yellow-700">
            This component requires running inside a Farcaster Mini App. Open
            this app from Warpcast to see the full functionality.
          </p>
          <p className="mt-2 text-xs text-yellow-600">
            Tip: Share your app URL in a cast and click the embed to open it as
            a Mini App.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Farcaster Mini App Actions
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Try out all available SDK actions and features
        </p>
      </div>

      {/* Status/Error Messages */}
      {status && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-800">✓ {status}</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">✗ {error}</p>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Navigation Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenUrl}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open URL
          </button>
          <button
            onClick={handleViewCast}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Cast
          </button>
          <button
            onClick={handleOpenChannel}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open Channel
          </button>
          <button
            onClick={handleViewProfile}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Composition Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Composition Actions
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={handleComposeCast}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Compose Cast
          </button>
        </div>
      </div>

      {/* App Management */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          App Management
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddMiniApp}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Add to Favorites
          </button>
          <button
            onClick={handleClose}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Close Mini App
          </button>
        </div>
      </div>

      {/* Feedback Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Haptic Feedback
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={handleHaptic}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Trigger Haptic
          </button>
        </div>
      </div>

      {/* SDK Information */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          SDK Information
        </h3>
        <div className="space-y-1 text-xs text-gray-600">
          <p>
            • <strong>sdk.actions.openUrl(url)</strong> - Open external URLs
          </p>
          <p>
            • <strong>sdk.actions.composeCast(options)</strong> - Open cast
            composer
          </p>
          <p>
            • <strong>sdk.actions.addMiniApp()</strong> - Add app to favorites
          </p>
          <p>
            • <strong>sdk.actions.haptic(type)</strong> - Trigger haptic
            feedback
          </p>
          <p>
            • <strong>sdk.actions.close()</strong> - Close the mini app
          </p>
          <p>
            • <strong>sdk.actions.viewCast(url)</strong> - View specific cast
          </p>
          <p>
            • <strong>sdk.actions.openChannel(id)</strong> - Open channel
          </p>
          <p>
            • <strong>sdk.actions.viewProfile(fid)</strong> - View user profile
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-900">
          💡 Developer Tip
        </h3>
        <p className="text-xs text-blue-700">
          All actions return promises and should be wrapped in try-catch blocks.
          Check the console for detailed logs of each action.
        </p>
      </div>
    </div>
  );
};
