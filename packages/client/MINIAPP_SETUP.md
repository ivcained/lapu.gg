# Base Miniapp Setup Guide

This guide will help you complete the setup of Lapu as a Base/Farcaster miniapp.

## What's Already Configured

✅ **MiniKit SDK Installed**: `@coinbase/onchainkit` v1.1.2 is installed
✅ **Configuration Files Created**: `minikit.config.ts` and `farcaster.json`
✅ **Provider Integration**: MiniKitProvider is set up in `index.tsx`
✅ **Environment Variables**: Template created in `.env.example`

## Required Steps to Complete Setup

### 1. Get OnchainKit API Key

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create an account or sign in
3. Create a new project or select existing one
4. Copy your API key
5. Update `.env` file:
   ```bash
   VITE_ONCHAINKIT_API_KEY=your_actual_api_key_here
   ```

### 2. Generate Account Association Signature

The Farcaster manifest requires a cryptographically signed account association. Follow these steps:

#### Option A: Using Warpcast Developer Tools (Recommended)

1. Visit [Warpcast Mini App Developer Tools](https://warpcast.com/~/developers/mini-apps)
2. Sign in with your Farcaster account
3. Enter your domain: `lapu.gg`
4. Click "Generate Signature"
5. Copy the generated `header`, `payload`, and `signature` values

#### Option B: Using Base Build Preview Tool

1. Visit [base.dev/preview](https://base.dev/preview)
2. Follow the account association wizard
3. Enter your domain: `lapu.gg`
4. Complete the verification process
5. Copy the generated values

#### Update Configuration Files

Once you have the signature, update both:

**1. Update `public/.well-known/farcaster.json`:**
```json
{
  "accountAssociation": {
    "header": "YOUR_ACTUAL_HEADER",
    "payload": "YOUR_ACTUAL_PAYLOAD",
    "signature": "YOUR_ACTUAL_SIGNATURE"
  },
  ...
}
```

**2. Update `minikit.config.ts`:**
```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "YOUR_ACTUAL_HEADER",
    payload: "YOUR_ACTUAL_PAYLOAD",
    signature: "YOUR_ACTUAL_SIGNATURE"
  },
  ...
}
```

### 3. Deploy and Test

1. **Build the app:**
   ```bash
   pnpm run build
   ```

2. **Deploy to production** (e.g., Vercel, Netlify)
   - Ensure `.well-known/farcaster.json` is accessible at `https://lapu.gg/.well-known/farcaster.json`
   - Set environment variables in your deployment platform

3. **Validate your miniapp:**
   - Visit [base.dev/preview](https://base.dev/preview)
   - Enter your app URL: `https://lapu.gg`
   - View the embeds and click launch to verify

### 4. Optional: Set Up Webhook Handler

The manifest includes a webhook URL (`https://lapu.gg/api/webhook`). If you want to receive webhook events:

1. Create an API endpoint at `/api/webhook`
2. Handle Farcaster webhook events (user installs, launches, etc.)
3. See [Farcaster Webhooks Documentation](https://miniapps.farcaster.xyz/docs/guides/publishing#webhooks)

## Testing Locally

To test the miniapp locally:

```bash
# Start the development server
pnpm run dev

# Test with miniapp parameter
# Open: http://localhost:5173?miniApp=true
```

The app will:
- Detect it's running in miniapp mode
- Initialize the MiniKit SDK
- Send a "ready" signal to hide the splash screen

## Important Notes

⚠️ **Domain Verification**: The domain in your account association MUST exactly match where you deploy the manifest. If testing on a different domain, you'll need to generate a new signature.

⚠️ **HTTPS Required**: Farcaster miniapps require HTTPS in production. Local development can use HTTP.

⚠️ **Signature Security**: Keep your Farcaster custody wallet recovery phrase secure. You'll need it to sign the account association.

## Resources

- [Base MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [Farcaster Mini Apps Specification](https://miniapps.farcaster.xyz/docs/specification)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Base Mini Apps Quickstart](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)

## Troubleshooting

### "Invalid signature" error
- Ensure the signature was generated for the exact domain where the manifest is hosted
- Verify all three fields (header, payload, signature) are copied correctly

### Miniapp not appearing in Farcaster
- Check that `farcaster.json` is publicly accessible
- Validate the manifest structure at base.dev/preview
- Ensure HTTPS is enabled in production

### MiniKit provider errors
- Verify your OnchainKit API key is valid
- Check that all environment variables are set correctly
- Review browser console for specific error messages

## Next Steps

After completing the setup:

1. ✅ Test the miniapp in Warpcast mobile app
2. ✅ Submit your miniapp for discovery (if desired)
3. ✅ Monitor webhook events for user engagement
4. ✅ Iterate based on user feedback

For questions or issues, refer to the [Base Discord](https://discord.gg/buildonbase) community.
