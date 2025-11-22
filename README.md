
# mud

[Waitlist](https://getwaitlist.com/waitlist/11113)

[mud quick start](https://mud.dev/quick-start)

## Prerequisites

foundry (forge, anvil, cast)
node.js (v16+)
pnpm (after installing node: npm install --global pnpm)

## Dev

pnpm run dev
http://localhost:3000

## Notifications

This project includes a notification system for Farcaster/Base miniapp. See [NOTIFICATIONS.md](./NOTIFICATIONS.md) for complete setup instructions.

Quick setup:
1. Get a Neynar API key from https://dev.neynar.com/
2. Create `.env` file with `NEYNAR_API_KEY=your_key`
3. Deploy to Vercel for the webhook to work
