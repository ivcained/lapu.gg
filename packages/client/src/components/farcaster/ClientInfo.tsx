import { useFarcaster, useFarcasterClient, useFarcasterFeatures } from "@/farcaster";

/**
 * Example component showing how to use client and features context
 * Displays platform information and available features
 */
export const ClientInfo = () => {
  const { isInMiniApp, loading } = useFarcaster();
  const client = useFarcasterClient();
  const features = useFarcasterFeatures();

  if (loading || !isInMiniApp || !client) {
    return null;
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-green-900">
        Client Information
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Platform:</span>
          <span className="font-medium text-gray-900">
            {client.platformType || "Unknown"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Client FID:</span>
          <span className="font-medium text-gray-900">{client.clientFid}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">App Added:</span>
          <span className="font-medium text-gray-900">
            {client.added ? "Yes ✓" : "No"}
          </span>
        </div>

        {client.safeAreaInsets && (
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Safe Area Insets:
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-gray-600">
                Top: {client.safeAreaInsets.top}px
              </span>
              <span className="text-gray-600">
                Bottom: {client.safeAreaInsets.bottom}px
              </span>
              <span className="text-gray-600">
                Left: {client.safeAreaInsets.left}px
              </span>
              <span className="text-gray-600">
                Right: {client.safeAreaInsets.right}px
              </span>
            </div>
          </div>
        )}

        {features && (
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Available Features:
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Haptics:</span>
                <span className="font-medium text-gray-900">
                  {features.haptics ? "Supported ✓" : "Not supported"}
                </span>
              </div>
              {features.cameraAndMicrophoneAccess !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Camera/Mic:</span>
                  <span className="font-medium text-gray-900">
                    {features.cameraAndMicrophoneAccess ? "Granted ✓" : "Not granted"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {client.notificationDetails && (
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs font-semibold text-gray-700">
              Notifications: Enabled ✓
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
