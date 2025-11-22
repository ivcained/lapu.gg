# Farcaster Mini App Context

This module provides a complete implementation of the Farcaster Mini App Context, allowing your app to access user profile data, location context, client information, and available features when running as a Farcaster mini app.

## Features

- **User Profile Data**: Access FID, username, display name, profile picture, bio, and location
- **Location Context**: Understand where your mini app was launched from (cast, notification, launcher, etc.)
- **Client Information**: Get platform type, safe area insets, and notification details
- **Features Detection**: Check availability of haptics, camera, and microphone access
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Installation

The `@farcaster/miniapp-sdk` is already installed as a dependency.

## Usage

### 1. Provider Setup

The `FarcasterProvider` is already integrated in `src/index.tsx`, wrapping your entire application:

```tsx
<FarcasterProvider>
  <MUDProvider value={result}>
    <App />
  </MUDProvider>
</FarcasterProvider>
```

### 2. Using the Hooks

#### Get Full Context

```tsx
import { useFarcaster } from "@/farcaster";

function MyComponent() {
  const { isInMiniApp, context, loading, error } = useFarcaster();

  if (loading) return <div>Loading...</div>;
  if (!isInMiniApp) return <div>Not in a mini app</div>;

  return <div>FID: {context?.user.fid}</div>;
}
```

#### Get User Profile

```tsx
import { useFarcasterUser } from "@/farcaster";

function UserDisplay() {
  const user = useFarcasterUser();

  if (!user) return null;

  return (
    <div>
      <h2>{user.displayName || user.username}</h2>
      <p>@{user.username}</p>
      <p>FID: {user.fid}</p>
      {user.pfpUrl && <img src={user.pfpUrl} alt="Profile" />}
    </div>
  );
}
```

#### Get Location Context

```tsx
import { useFarcasterLocation } from "@/farcaster";

function LocationDisplay() {
  const location = useFarcasterLocation();

  if (!location) return null;

  switch (location.type) {
    case "cast_embed":
      return <div>Opened from cast by @{location.cast.author.username}</div>;
    case "notification":
      return <div>Opened from: {location.notification.title}</div>;
    case "launcher":
      return <div>Opened from app launcher</div>;
    // ... handle other types
  }
}
```

#### Get Client Information

```tsx
import { useFarcasterClient } from "@/farcaster";

function ClientDisplay() {
  const client = useFarcasterClient();

  if (!client) return null;

  return (
    <div>
      <p>Platform: {client.platformType}</p>
      <p>App Added: {client.added ? "Yes" : "No"}</p>
      {client.safeAreaInsets && (
        <div>Safe area top: {client.safeAreaInsets.top}px</div>
      )}
    </div>
  );
}
```

#### Get Features

```tsx
import { useFarcasterFeatures } from "@/farcaster";

function FeaturesDisplay() {
  const features = useFarcasterFeatures();

  if (!features) return null;

  return (
    <div>
      <p>Haptics: {features.haptics ? "Supported" : "Not supported"}</p>
      <p>Camera: {features.cameraAndMicrophoneAccess ? "Granted" : "Not granted"}</p>
    </div>
  );
}
```

### 3. Using Utilities

#### Check if in Mini App

```tsx
import { isMiniApp, isMiniAppSync } from "@/farcaster";

// Async (recommended for accuracy)
const inMiniApp = await isMiniApp();

// Sync (for immediate checks, less accurate)
const probablyInMiniApp = isMiniAppSync();
```

#### Signal App Ready

```tsx
import { signalReady } from "@/farcaster";

// This is already called in src/index.tsx after app setup
await signalReady();
```

## Example Components

Check out the example components in `src/components/farcaster/`:

- `UserProfile.tsx` - Displays user profile information
- `LocationInfo.tsx` - Shows launch location context
- `ClientInfo.tsx` - Displays client and features information
- `FarcasterDemo.tsx` - Complete demo of all features

To use the demo:

```tsx
import { FarcasterDemo } from "@/components/farcaster";

function App() {
  return <FarcasterDemo />;
}
```

## Types

All TypeScript types are available for import:

```tsx
import type {
  MiniAppContext,
  MiniAppUser,
  MiniAppLocationContext,
  ClientContext,
  FeaturesContext,
  // ... and more
} from "@/farcaster";
```

## Location Types

The mini app can be launched from different contexts:

- `cast_embed` - Launched from a cast where your app is embedded
- `cast_share` - Launched when a user shared a cast to your app
- `notification` - Launched from a notification
- `launcher` - Launched directly from the app catalog
- `channel` - Launched from within a Farcaster channel
- `open_miniapp` - Launched from another Mini App

Each location type provides different contextual data that you can use to customize the user experience.

## Notes

- User data from the context should not be used for authentication or sensitive actions as it's passed by the client
- The context is loaded asynchronously when the app starts
- All hooks must be used within the `FarcasterProvider`
- Safe area insets should be used to avoid navigation elements that obscure the view

## References

- [Farcaster Mini App Documentation](https://docs.farcaster.xyz/developers/guides/apps/miniapps)
- [@farcaster/miniapp-sdk](https://www.npmjs.com/package/@farcaster/miniapp-sdk)
