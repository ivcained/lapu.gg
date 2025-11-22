# Farcaster Mini App Navigation

This directory contains navigation utilities for the Lapu.gg Farcaster Mini App, ensuring cross-client compatibility using the official `@farcaster/miniapp-sdk`.

## Overview

✅ **Current Status**: Your app correctly uses the Farcaster SDK
✅ **No Issues Found**: No incorrect navigation patterns detected
✅ **SDK Installed**: `@farcaster/miniapp-sdk` v0.2.1

## Quick Start

### Import Navigation Utilities

```typescript
import {
  openExternalUrl,
  composeCast,
  viewCast,
  openGroupChat,
  openDirectMessage,
  isMiniApp,
} from "@/utils/navigation";
```

### Open External URLs

```typescript
// ✅ CORRECT - Use SDK action
openExternalUrl("https://base.org");

// ❌ INCORRECT - Don't use HTML links or window.open
// <a href="https://base.org">Visit</a>
// window.open('https://base.org')
```

### Compose Casts

```typescript
// ✅ CORRECT - Use SDK action
composeCast({
  text: "Check out this game!",
  embeds: [window.location.href],
});

// ❌ INCORRECT - Don't use composer URLs
// window.open('https://farcaster.com/~/compose?text=...')
```

### View Casts

```typescript
// ✅ CORRECT - Use SDK action
viewCast("https://base.app/post/0xffdec7c...");

// ❌ INCORRECT - Don't use direct URLs
// window.open('https://base.app/post/0xffdec7c...')
```

## Example Components

Pre-built components are available in `/components/social/`:

```tsx
import { ShareButton, ExternalLinkButton } from "@/components/social/ShareButton";

// Share button with custom text
<ShareButton
  text="Just played Lapu.gg!"
  embeds={[window.location.href]}
  label="Share Game"
/>

// External link button
<ExternalLinkButton
  url="https://base.org"
  label="Visit Base.org"
/>
```

## API Reference

### `openExternalUrl(url: string)`
Opens an external URL in the client's in-app browser. Falls back to `window.open()` in non-miniapp contexts.

### `composeCast(options)`
Opens the native composer with prefilled content.
- `options.text` (string): The text to prefill
- `options.embeds` (string[]): Optional URLs to embed

### `viewCast(castUrl: string)`
Opens a specific cast by its URL.

### `openGroupChat(conversationId: string)`
Opens a group conversation. Users must be members to access.

### `openDirectMessage(address: string)`
Opens a DM conversation with a user/agent by their 0x address.

### `isMiniApp(): boolean`
Returns true if running in a Farcaster Mini App context.

### `getFarcasterContext()`
Returns the current Farcaster SDK context or null.

## Deeplinks

### Mini App Launch
```html
<a href="cbwallet://miniapp?url=${MINI_APP_URL}">
  Launch Mini App
</a>
```

### Group Chats
```typescript
openGroupChat("conversation-id-here");
// Deep link: cbwallet://messaging/${conversationId}
```

### Direct Messages
```typescript
openDirectMessage("0xabc...1234");
// Deep link: cbwallet://messaging/${address}
```

## Migration Patterns

If you add navigation features in the future, follow these patterns:

| Don't Use | Use Instead |
|-----------|-------------|
| `<a href="...">` | `openExternalUrl(...)` |
| `window.open(...)` | `openExternalUrl(...)` |
| Composer URLs | `composeCast(...)` |
| Direct cast URLs | `viewCast(...)` |
| Static Farcaster URLs | SDK actions |

## Conditional Navigation

Handle cases where the app runs outside the miniapp context:

```typescript
import { isMiniApp, openExternalUrl } from "@/utils/navigation";

const handleAction = () => {
  if (isMiniApp()) {
    // Use SDK actions
    openExternalUrl("https://app-specific-url.com");
  } else {
    // Fallback for browser
    window.open("https://fallback-url.com", "_blank");
  }
};
```

## Resources

- [Farcaster Mini App Docs](https://docs.farcaster.xyz/developers/miniapps)
- [Base Navigation Guide](https://docs.base.org/guides/miniapps/navigation)
- [@farcaster/miniapp-sdk on npm](https://www.npmjs.com/package/@farcaster/miniapp-sdk)
