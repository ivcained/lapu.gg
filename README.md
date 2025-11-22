
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

## Authentication

This project uses **Farcaster Quick Auth** for secure, passwordless authentication. Users can sign in with their Farcaster identity and receive a verified JWT token.

### Features

- 🔐 Secure JWT-based authentication
- 🎯 Instant sign-in with Farcaster
- 👤 User FID (Farcaster ID) verification
- 🚀 No passwords or email verification required

### Quick Start

1. Click "Sign In with Farcaster" in the top-right corner
2. Authenticate with your Farcaster identity
3. The app receives your verified FID

For detailed documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md).
