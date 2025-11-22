# Authentication Setup

This document describes the Farcaster Quick Auth implementation in the Lapu.gg miniapp.

## Overview

The authentication system uses **Farcaster Quick Auth** to provide instant, secure authentication without passwords or complex OAuth flows. When a user authenticates:

1. The user signs with their Farcaster identity
2. The SDK returns a JWT token
3. The backend verifies the JWT and returns trusted user data (FID)
4. The frontend stores the token and user data for authenticated operations

## Architecture

### Frontend (`packages/client/src/`)

#### Authentication Context (`contexts/AuthContext.tsx`)

Manages authentication state across the application:

- **State**: `token`, `userData`, `isAuthenticated`, `isLoading`, `error`
- **Methods**: `signIn()`, `signOut()`

The context is provided at the root level in `index.tsx` and wraps the entire app.

#### Authentication UI (`components/auth/AuthButton.tsx`)

A reusable button component that:
- Shows "Sign In with Farcaster" when unauthenticated
- Displays the user's FID and "Sign Out" button when authenticated
- Shows loading state during authentication
- Displays error messages if authentication fails

#### Integration

The `AuthButton` is positioned in the top-right corner of the app (`App.tsx:20-22`).

### Backend (`api/`)

#### Authentication Endpoint (`api/auth.ts`)

A Vercel serverless function that:
- Accepts GET requests with `Authorization: Bearer <token>` header
- Verifies the JWT using `@farcaster/quick-auth`
- Returns the user's FID on success
- Returns 401 on invalid tokens

**Environment Variables:**
- `FARCASTER_DOMAIN`: Your deployment domain (e.g., "lapu.gg")

## Usage

### Frontend Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, userData, signIn, signOut } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={signIn}>Sign In</button>;
  }

  return (
    <div>
      <p>Authenticated as FID: {userData?.fid}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Making Authenticated Requests

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { token } = useAuth();

  async function makeAuthenticatedRequest() {
    const response = await fetch('/api/some-endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  }

  // ...
}
```

## Configuration

### Environment Variables

**Client (`packages/client/.env`):**
```env
VITE_API_URL=http://localhost:5173  # Development only
FARCASTER_DOMAIN=lapu.gg            # Your production domain
```

**Vercel (`vercel.json`):**
```json
{
  "env": {
    "FARCASTER_DOMAIN": "lapu.gg"
  }
}
```

### Deployment

When deploying to Vercel:

1. The `api/` directory is automatically detected as serverless functions
2. The `FARCASTER_DOMAIN` environment variable must match your deployed domain
3. The frontend build is output to `packages/client/dist`

## JWT Token Schema

The JWT payload contains:

```json
{
  "iat": 1747764819,         // Issued at timestamp
  "iss": "https://auth.farcaster.xyz",  // Issuer (Quick Auth Server)
  "exp": 1747768419,         // Expiration (1 hour from issuance)
  "sub": 6841,               // User's Farcaster ID (FID)
  "aud": "lapu.gg"          // Your mini app's domain
}
```

## Security Considerations

1. **Token Expiration**: Tokens expire after 1 hour. Implement token refresh if needed.
2. **Domain Verification**: The JWT's `aud` field must match your `FARCASTER_DOMAIN`.
3. **HTTPS Required**: In production, always use HTTPS for token transmission.
4. **Client-Side Storage**: Tokens are stored in memory (React state), not localStorage, for security.

## Testing

### Local Development

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. The app will run on `http://localhost:5173`

3. Open in a browser or Farcaster miniapp preview

4. Click "Sign In with Farcaster" to test the flow

### Testing in Farcaster

1. Deploy to Vercel or your hosting platform
2. Configure the Farcaster miniapp manifest at `packages/client/public/.well-known/farcaster.json`
3. Open the app in the Farcaster client
4. Test the authentication flow

## Troubleshooting

### "Invalid token" error

- Ensure `FARCASTER_DOMAIN` matches your deployed domain
- Check that the token hasn't expired
- Verify the Quick Auth SDK is properly initialized

### Authentication fails in development

- Check that `VITE_API_URL` is set correctly
- Ensure the backend API is running
- Check browser console for detailed error messages

### CORS errors

- The Vercel deployment handles CORS automatically
- In local development, ensure the API and client are on the same origin

## Files Reference

- `/api/auth.ts` - Backend JWT verification endpoint
- `/packages/client/src/contexts/AuthContext.tsx` - Frontend auth context
- `/packages/client/src/components/auth/AuthButton.tsx` - Auth UI component
- `/packages/client/src/index.tsx:35-37` - AuthProvider integration
- `/packages/client/src/App.tsx:20-22` - AuthButton usage
- `/vercel.json` - Vercel deployment configuration

## Additional Resources

- [Farcaster Quick Auth Documentation](https://docs.farcaster.xyz/mini-apps/core-concepts/authentication)
- [Quick Auth Client Package](https://www.npmjs.com/package/@farcaster/quick-auth)
- [Miniapp SDK](https://www.npmjs.com/package/@farcaster/miniapp-sdk)
