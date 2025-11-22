import { UserProfile } from "./UserProfile";
import { LocationInfo } from "./LocationInfo";
import { ClientInfo } from "./ClientInfo";

/**
 * Demo component showcasing all Farcaster Mini App context features
 * This can be used as a reference for implementing Farcaster features
 */
export const FarcasterDemo = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Farcaster Mini App Context
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          This demo shows user profile data, launch location, client info, and
          available features.
        </p>
      </div>

      <UserProfile />
      <LocationInfo />
      <ClientInfo />

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Developer Notes
        </h3>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• User data is available via useFarcasterUser() hook</li>
          <li>• Location context via useFarcasterLocation() hook</li>
          <li>• Client info via useFarcasterClient() hook</li>
          <li>• Features via useFarcasterFeatures() hook</li>
          <li>
            • Full context available via useFarcaster() hook
          </li>
        </ul>
      </div>
    </div>
  );
};
