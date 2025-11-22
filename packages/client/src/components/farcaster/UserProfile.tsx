import { useFarcaster, useFarcasterUser } from "@/farcaster";

/**
 * Example component showing how to use Farcaster Mini App context
 * Displays user profile information when running as a mini app
 */
export const UserProfile = () => {
  const { isInMiniApp, loading, error } = useFarcaster();
  const user = useFarcasterUser();

  // Show loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Error loading profile: {error.message}
        </p>
      </div>
    );
  }

  // Show message if not in Mini App
  if (!isInMiniApp) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          Please open this app in a Farcaster or Base client to see your
          profile.
        </p>
      </div>
    );
  }

  // Show user information
  if (user) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {user.pfpUrl && (
            <img
              src={user.pfpUrl}
              alt={user.displayName || user.username || "Profile"}
              className="h-16 w-16 rounded-full border-2 border-gray-200"
            />
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.displayName || user.username || "Anonymous"}
            </h2>
            {user.username && (
              <p className="text-sm text-gray-600">@{user.username}</p>
            )}
            <p className="text-xs text-gray-500">FID: {user.fid}</p>
          </div>
        </div>
        {user.bio && (
          <p className="mt-3 text-sm text-gray-700 border-t pt-3">
            {user.bio}
          </p>
        )}
        {user.location && (
          <p className="mt-2 text-xs text-gray-500">
            📍 {user.location.description}
          </p>
        )}
      </div>
    );
  }

  return null;
};
