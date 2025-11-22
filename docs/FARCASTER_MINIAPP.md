# Farcaster Mini App Integration

This document describes the Farcaster Mini App SDK integration in the Lapu.gg project.

## Overview

The project is fully integrated with the Farcaster Mini App SDK (`@farcaster/miniapp-sdk` v0.2.1), enabling rich social features and seamless integration with the Farcaster ecosystem.

## Quick Start

### Prerequisites

- The SDK is already installed in `packages/client/package.json`
- The app is wrapped with `FarcasterProvider` in `packages/client/src/index.tsx`

### Basic Usage

```typescript
import { useFarcaster, useFarcasterUser } from "@/farcaster";

function MyComponent() {
  const { isInMiniApp, context, loading } = useFarcaster();
  const user = useFarcasterUser();

  if (!isInMiniApp) {
    return <div>Not in Mini App context</div>;
  }

  return (
    <div>
      <h1>Hello, {user?.displayName}!</h1>
      <p>FID: {user?.fid}</p>
    </div>
  );
}
```

## Architecture

### Provider Setup

The app is wrapped with `FarcasterProvider` at the root level:

```typescript
// packages/client/src/index.tsx
<FarcasterProvider>
  <MUDProvider value={result}>
    <App />
  </MUDProvider>
</FarcasterProvider>
```

### Available Hooks

#### `useFarcaster()`
Returns the complete Farcaster context.

```typescript
const { isInMiniApp, context, loading, error } = useFarcaster();
```

**Returns:**
- `isInMiniApp`: boolean - Whether the app is running in a Mini App context
- `context`: MiniAppContext | null - Full Mini App context
- `loading`: boolean - Loading state
- `error`: Error | null - Any error that occurred

#### `useFarcasterUser()`
Returns the current user's profile data.

```typescript
const user = useFarcasterUser();
// user: { fid, username, displayName, pfpUrl, bio, location }
```

#### `useFarcasterLocation()`
Returns the location context (where the Mini App was opened from).

```typescript
const location = useFarcasterLocation();
// location.type: "cast_embed" | "cast_share" | "notification" | "launcher" | "channel" | "open_miniapp"
```

#### `useFarcasterClient()`
Returns client information.

```typescript
const client = useFarcasterClient();
// client: { platformType, clientFid, added, safeAreaInsets, notificationDetails }
```

#### `useFarcasterFeatures()`
Returns available features in the current client.

```typescript
const features = useFarcasterFeatures();
// features: { haptics, cameraAndMicrophoneAccess }
```

### Utility Functions

```typescript
import { isMiniApp, isMiniAppSync, signalReady } from "@/farcaster";

// Check if running in Mini App (async)
const isInMiniApp = await isMiniApp();

// Check if running in Mini App (sync heuristic)
const isInMiniApp = isMiniAppSync();

// Signal that the app is ready (hides splash screen)
await signalReady();
```

## SDK Actions

The SDK provides various actions for interacting with the Farcaster client:

### Navigation Actions

```typescript
import { sdk } from "@farcaster/miniapp-sdk";

// Open external URL
await sdk.actions.openUrl("https://example.com");

// View specific cast
await sdk.actions.viewCast("https://warpcast.com/user/hash");

// Open channel
await sdk.actions.openChannel("farcaster");

// View user profile
await sdk.actions.viewProfile(12345); // FID
```

### Composition Actions

```typescript
// Compose a new cast
await sdk.actions.composeCast({
  text: "Check out my game!",
  embeds: ["https://lapu.gg"],
});
```

### App Management

```typescript
// Add Mini App to user's favorites
const result = await sdk.actions.addMiniApp();
console.log(result.added); // true if added, false if already in favorites

// Close the Mini App
await sdk.actions.close();

// Signal that the app is ready to display
await sdk.actions.ready();
```

### Feedback Actions

```typescript
// Trigger haptic feedback
await sdk.actions.haptic("impact");
// Available types: "impact", "selection", "notification"
```

## Components

### Demo Components

Located in `packages/client/src/components/farcaster/`:

- **`MiniAppActions`**: Interactive demo of all SDK actions
- **`FarcasterDemo`**: Displays context information
- **`UserProfile`**: Shows user profile data
- **`LocationInfo`**: Displays launch location context
- **`ClientInfo`**: Shows client information

### Usage in App

A demo toggle button appears in the top-right corner when running in a Mini App:

```typescript
import { MiniAppActions, FarcasterDemo } from "./components/farcaster";
import { useFarcaster } from "./farcaster";

const { isInMiniApp } = useFarcaster();

{isInMiniApp && (
  <button onClick={() => setShowDemo(true)}>
    Show Farcaster Demo
  </button>
)}
```

## Share Functionality

The app includes a share button that generates dynamic Open Graph images:

```typescript
// packages/client/src/components/ui/ShareButton.tsx
const shareUrl = `${window.location.origin}/api/share/${username}`;

await sdk.actions.openUrl(
  `https://warpcast.com/~/compose?text=${text}&embeds[]=${shareUrl}`
);
```

The share URL returns a dynamic image generated on the server with user-specific data.

## API Integration

### Share API

**Endpoint:** `/api/share/[username]`

Generates a dynamic Open Graph image for sharing with personalized user data.

### Webhook

**Endpoint:** `/api/webhook`

Handles Farcaster webhook events (notifications, etc.).

### Auth

**Endpoint:** `/api/auth`

Handles authentication flow integration with Farcaster.

## Type Definitions

All Farcaster types are defined in `packages/client/src/farcaster/types.ts`:

```typescript
import type {
  MiniAppContext,
  MiniAppUser,
  MiniAppLocationContext,
  ClientContext,
  FeaturesContext,
} from "@/farcaster/types";
```

## Best Practices

### 1. Always Check Mini App Status

```typescript
const { isInMiniApp } = useFarcaster();

if (!isInMiniApp) {
  // Show fallback UI or redirect
  return <NotInMiniAppView />;
}
```

### 2. Handle Errors Gracefully

```typescript
try {
  await sdk.actions.composeCast({ text: "Hello!" });
} catch (error) {
  console.error("Failed to compose cast:", error);
  // Show user-friendly error message
}
```

### 3. Use Loading States

```typescript
const { loading } = useFarcaster();

if (loading) {
  return <LoadingSpinner />;
}
```

### 4. Signal Ready After Loading

```typescript
// Already done in index.tsx
await signalReady();
```

This hides the Farcaster splash screen and shows your app.

### 5. Leverage User Context

```typescript
const user = useFarcasterUser();

// Personalize the experience
<h1>Welcome back, {user?.displayName || "friend"}!</h1>
```

## Testing

### Local Testing

The SDK will return `isInMiniApp = false` when testing locally. To test Mini App features:

1. Deploy your app to a public URL
2. Share the URL in a Farcaster cast
3. Click the embed in Warpcast mobile app
4. The app will open as a Mini App with full context

### Development Mode

When not in a Mini App context, the demo components show a warning message:

```
⚠️ Not in Mini App Context
This component requires running inside a Farcaster Mini App.
```

## Examples

### Example: Personalized Welcome

```typescript
import { useFarcasterUser } from "@/farcaster";

export function Welcome() {
  const user = useFarcasterUser();

  return (
    <div>
      <img src={user?.pfpUrl} alt={user?.displayName} />
      <h1>Welcome, {user?.displayName}!</h1>
      <p>@{user?.username} • FID: {user?.fid}</p>
    </div>
  );
}
```

### Example: Context-Aware Features

```typescript
import { useFarcasterLocation } from "@/farcaster";

export function ContextAwareUI() {
  const location = useFarcasterLocation();

  if (location?.type === "cast_embed") {
    return <div>Opened from cast by {location.cast.author.username}</div>;
  }

  if (location?.type === "channel") {
    return <div>Opened from /{location.channel.key} channel</div>;
  }

  return <div>Opened from launcher</div>;
}
```

### Example: Haptic Feedback

```typescript
import { sdk } from "@farcaster/miniapp-sdk";
import { useFarcasterFeatures } from "@/farcaster";

export function HapticButton() {
  const features = useFarcasterFeatures();

  const handleClick = async () => {
    if (features?.haptics) {
      await sdk.actions.haptic("impact");
    }
    // Perform action...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Resources

- [Farcaster Mini App SDK Documentation](https://github.com/farcasterxyz/miniapp-sdk)
- [Warpcast Developer Portal](https://warpcast.com/~/developers)
- [Farcaster Protocol Docs](https://docs.farcaster.xyz)

## Troubleshooting

### Issue: `isInMiniApp` is always false

**Solution:** The app must be opened from within the Farcaster client (Warpcast). Deploy to a public URL and share in a cast.

### Issue: Actions fail with errors

**Solution:** Ensure the app is running in a Mini App context. Some actions may not be available in all contexts.

### Issue: User data is null

**Solution:** User data is only available when running in a Mini App. Check `isInMiniApp` before accessing user data.

### Issue: Splash screen doesn't hide

**Solution:** Ensure `signalReady()` is called after your app finishes loading. This is done automatically in `index.tsx`.

## Future Enhancements

Potential features to add:

1. **Notifications**: Use `sdk.context.client.notificationDetails` to send push notifications
2. **Deep Linking**: Handle `open_miniapp` location context for deep links
3. **Channel Integration**: Customize UI based on the channel the user is in
4. **Camera Access**: Use `features.cameraAndMicrophoneAccess` for multimedia features
5. **Analytics**: Track how users discover and use the Mini App

## Support

For issues or questions:
- Check the console for detailed error logs
- Review the demo components for implementation examples
- Consult the Farcaster developer documentation
