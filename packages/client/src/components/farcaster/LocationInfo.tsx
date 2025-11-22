import { useFarcaster, useFarcasterLocation } from "@/farcaster";

/**
 * Example component showing how to use location context
 * Displays information about where the mini app was opened from
 */
export const LocationInfo = () => {
  const { isInMiniApp, loading } = useFarcaster();
  const location = useFarcasterLocation();

  if (loading || !isInMiniApp || !location) {
    return null;
  }

  const renderLocationDetails = () => {
    switch (location.type) {
      case "cast_embed":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Opened from a cast by{" "}
              <span className="font-semibold">
                @{location.cast.author.username}
              </span>
            </p>
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">{location.cast.text}</p>
            </div>
            {location.cast.channelKey && (
              <p className="text-xs text-gray-500">
                Channel: {location.cast.channelKey}
              </p>
            )}
          </div>
        );

      case "cast_share":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Shared cast from{" "}
              <span className="font-semibold">
                @{location.cast.author.username}
              </span>
            </p>
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xs text-gray-600">{location.cast.text}</p>
            </div>
          </div>
        );

      case "notification":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Opened from notification
            </p>
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xs font-semibold text-gray-800">
                {location.notification.title}
              </p>
              <p className="text-xs text-gray-600">
                {location.notification.body}
              </p>
            </div>
          </div>
        );

      case "launcher":
        return (
          <p className="text-sm text-gray-700">
            Opened directly from the app launcher
          </p>
        );

      case "channel":
        return (
          <div className="flex items-center gap-2">
            {location.channel.imageUrl && (
              <img
                src={location.channel.imageUrl}
                alt={location.channel.name}
                className="h-8 w-8 rounded"
              />
            )}
            <div>
              <p className="text-sm text-gray-700">
                Opened from channel
              </p>
              <p className="text-xs font-semibold text-gray-800">
                {location.channel.name}
              </p>
            </div>
          </div>
        );

      case "open_miniapp":
        return (
          <p className="text-sm text-gray-700">
            Opened from another mini app:{" "}
            <span className="font-semibold">{location.referrerDomain}</span>
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-purple-900">
        Launch Context
      </h3>
      {renderLocationDetails()}
    </div>
  );
};
