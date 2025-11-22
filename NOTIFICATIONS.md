# Notifications Setup Guide

This guide explains how to set up and use the in-app notification system for the Lapu miniapp on Farcaster/Base.

## Overview

The notification system allows you to re-engage users by sending in-app notifications through the Base app. When users enable notifications, your server receives a webhook with a unique token that grants permission to send notifications to that specific user.

## Architecture

### Backend (API)
- **Location**: `/api` directory (Vercel serverless functions)
- **Webhook Handler**: `/api/webhook.ts` - Receives events when users enable/disable notifications
- **Database**: `/api/lib/db.ts` - Simple JSON-based storage for notification tokens
- **Notification Service**: `/api/lib/notifications.ts` - Functions to send notifications

### Frontend
- **Component**: `/packages/client/src/components/ui/notifications.tsx`
- **Integration**: Added to GameUI to display "Enable Notifications" button

## Setup Instructions

### 1. Install Dependencies

The required packages are already installed:
- `@farcaster/miniapp-node` (backend SDK)
- `@farcaster/miniapp-sdk` (frontend SDK)
- `@vercel/node` (serverless function types)

### 2. Get Neynar API Key

1. Visit [https://dev.neynar.com/](https://dev.neynar.com/)
2. Sign up for a free account
3. Create a new API key
4. Copy the API key

### 3. Set Environment Variables

Create a `.env` file in the project root:

```bash
NEYNAR_API_KEY=your_actual_api_key_here
```

For Vercel deployment, add this as an environment variable in your Vercel project settings.

### 4. Deploy

The webhook endpoint needs to be publicly accessible. When deploying to Vercel:

1. The `/api` directory is automatically deployed as serverless functions
2. The webhook will be available at `https://lapu.gg/api/webhook`
3. This URL is already configured in the manifest at:
   `/packages/client/public/.well-known/farcaster.json`

## How It Works

### 1. User Flow

1. User clicks "Enable Notifications" button in the game UI
2. SDK prompts user to add the miniapp (if not already added)
3. User can choose to enable or disable notifications
4. SDK calls the webhook with notification details

### 2. Webhook Events

The webhook (`/api/webhook.ts`) handles four event types:

#### `miniapp_added`
Triggered when a user adds your miniapp to their Farcaster client.
- Saves notification token if provided
- Sends welcome notification

#### `notifications_enabled`
Triggered when a user enables notifications.
- Saves new notification token
- Sends confirmation notification

#### `notifications_disabled`
Triggered when a user disables notifications.
- Deletes notification token from database

#### `miniapp_removed`
Triggered when a user removes the miniapp.
- Deletes notification token from database

### 3. Sending Notifications

Use the `sendMiniAppNotification` function from `/api/lib/notifications.ts`:

```typescript
import { sendMiniAppNotification } from './api/lib/notifications';

const result = await sendMiniAppNotification({
  fid: 12345,              // User's FID
  appFid: 309857,          // Client app FID (Base app)
  title: 'Hello!',         // Max 32 characters
  body: 'Welcome back!',   // Max 128 characters
  targetUrl: 'https://lapu.gg/game' // Optional, defaults to home URL
});

// Result states:
// - { state: 'success' } - Notification sent successfully
// - { state: 'no_token' } - User has not enabled notifications
// - { state: 'rate_limit' } - Rate limit exceeded, try again later
// - { state: 'error', error: ... } - An error occurred
```

### 4. Notification Constraints

- **Title**: Maximum 32 characters
- **Body**: Maximum 128 characters
- **Target URL**: Maximum 1024 characters (must be on same domain)
- **Tokens per request**: Maximum 100
- **Notification ID**: Maximum 128 characters

## Database Structure

The notification tokens are stored in `/data/notifications.json` with the following structure:

```json
{
  "12345-309857": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6",
    "updatedAt": "2025-11-22T12:00:00.000Z"
  }
}
```

Key format: `{fid}-{appFid}` (e.g., "12345-309857")

### Upgrading to a Production Database

For production, consider upgrading from the JSON file to a proper database:

1. **PostgreSQL** (Recommended for Vercel)
   - Use Vercel Postgres
   - Create a table: `notification_tokens(fid, app_fid, url, token, updated_at)`

2. **MongoDB**
   - Use MongoDB Atlas
   - Collection: `notificationTokens`

3. **Redis**
   - Fast key-value storage
   - Good for high-traffic apps

## Important Notes

### Webhook Response Timing

⚠️ **Critical**: Webhooks must respond within 10 seconds to avoid timeouts.

The current implementation:
- Returns 200 OK immediately after saving tokens
- Sends welcome/confirmation notifications asynchronously
- Does not wait for notification sending to complete

### Client App Behavior

- **Farcaster app**: Activates tokens immediately
- **Base app**: Waits for successful webhook response before activating

### Token Management

- Each user can have different notification preferences per client app
- Tokens are unique per (User FID, Client App FID, Mini App) combination
- Always use both `fid` and `appFid` together to identify users

## Testing

### Local Development

1. Use a tool like [ngrok](https://ngrok.com/) to expose your local server:
   ```bash
   ngrok http 3000
   ```

2. Update the `webhookUrl` in the manifest to your ngrok URL:
   ```json
   "webhookUrl": "https://your-ngrok-url.ngrok.io/api/webhook"
   ```

3. Test in the Farcaster/Base app

### Production Testing

1. Deploy to Vercel
2. Test the "Enable Notifications" button in the live app
3. Check the `/data/notifications.json` file (or your database) for saved tokens
4. Send a test notification using the API

## Troubleshooting

### "Failed to add mini app" error
- Check if webhook responds within 10 seconds
- Verify NEYNAR_API_KEY is set correctly
- Check webhook logs for errors

### Notifications not sending
- Verify user has enabled notifications
- Check if token exists in database
- Verify notification content is within character limits
- Check for rate limiting

### Webhook verification failing
- Ensure NEYNAR_API_KEY is correct
- Check request body is being passed correctly
- Verify webhook signature

## File Structure

```
/api
├── webhook.ts              # Webhook handler (main entry point)
├── lib/
│   ├── db.ts              # Database operations
│   └── notifications.ts   # Notification sending logic
└── tsconfig.json          # TypeScript config

/packages/client/src/components/ui
├── notifications.tsx      # Frontend notification component
└── notifications.css      # Component styles

/data
└── notifications.json     # Token storage (gitignored)
```

## Next Steps

1. Set up your NEYNAR_API_KEY
2. Deploy to Vercel
3. Test the notification flow
4. Implement game-specific notifications (e.g., when a facility is built, when resources are ready)
5. Consider upgrading to a production database

## Resources

- [Farcaster Miniapp Notifications Docs](https://docs.farcaster.xyz/miniapps/notifications)
- [Neynar API Documentation](https://docs.neynar.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
