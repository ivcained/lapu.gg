# Base Account Integration

This project has been configured to support [Base Account](https://docs.base.org/base-account/overview/what-is-base-account), providing:

- **Universal sign-on** – One passkey works across every Base-enabled app
- **Batch transactions** – Combine multiple operations into a single confirmation
- **Gasless transactions** – Sponsor user transaction fees with paymasters
- **Seamless UX** – Automatic connection when launched as a Mini App in the Base App

## Features

### 🔗 Automatic Connection

When your app is launched as a Mini App within the Base App, users are automatically connected to their Base Account - no wallet connection flow needed.

### 📦 Batch Transactions

Combine multiple contract calls into a single atomic transaction using EIP-5792:

```typescript
import { useMUD } from "./useMUD";

const { systemCalls } = useMUD();

// Batch multiple facility builds
await systemCalls.batchBuildFacilities([
  { entityTypeId: 10, x: 1, y: 1, z: 1, yaw: 0 },
  { entityTypeId: 11, x: 2, y: 1, z: 1, yaw: 90 },
  { entityTypeId: 12, x: 3, y: 1, z: 1, yaw: 180 },
]);
```

### ⛽ Gasless Transactions

Enable paymasters to sponsor gas fees for your users:

```typescript
// Build facilities with sponsored gas
await systemCalls.batchBuildFacilities(facilities, true); // usePaymaster = true
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Optional: Coinbase Developer Platform Paymaster URL
# Get your key from: https://docs.cdp.coinbase.com/paymaster/introduction/welcome
VITE_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY
```

### App Metadata

Update your app metadata in `src/lib/baseAccountConfig.ts`:

```typescript
export const APP_METADATA = {
  name: "Your App Name",
  description: "Your app description",
  iconImageUrl: "https://yourapp.com/icon.png",
  url: "https://yourapp.com",
};
```

## Usage

### Accessing Base Account Features

Base Account features are available through the MUD network setup:

```typescript
import { useMUD } from "./useMUD";

const {
  network: { baseAccount },
} = useMUD();

// Check if running in Mini App context
if (baseAccount.isMiniApp) {
  console.log("Running in Base App!");
}

// Check wallet capabilities
const chainId = 8453; // Base mainnet
const hasPaymaster = supportsPaymaster(baseAccount.capabilities, chainId);
const hasBatch = supportsAtomicBatch(baseAccount.capabilities, chainId);
```

### Sending Batch Transactions

#### Method 1: Using System Calls

The easiest way to batch transactions is through the enhanced system calls:

```typescript
const { systemCalls } = useMUD();

// Batch multiple increments
await systemCalls.batchIncrement(5, true); // Increment 5 times with paymaster

// Batch facility builds
await systemCalls.batchBuildFacilities([
  { entityTypeId: 10, x: 1, y: 1, z: 1, yaw: 0 },
  { entityTypeId: 11, x: 2, y: 1, z: 1, yaw: 90 },
]);
```

#### Method 2: Using Base Account Directly

For more control, use the Base Account utilities directly:

```typescript
import { useMUD } from "./useMUD";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";

const {
  network: { baseAccount, worldContract },
} = useMUD();

// Custom batch transaction
const batchId = await baseAccount.batchContractWrites([
  {
    address: worldContract.address,
    abi: IWorldAbi,
    functionName: "increment",
    args: [],
  },
  {
    address: worldContract.address,
    abi: IWorldAbi,
    functionName: "buildFacility",
    args: [10, 1, 1, 1, 0],
  },
], true); // usePaymaster

console.log("Batch transaction ID:", batchId);
```

#### Method 3: Low-Level API

For advanced use cases, use the low-level `sendBatchCalls`:

```typescript
import { parseEther } from "viem";
import { useMUD } from "./useMUD";

const {
  network: { baseAccount },
} = useMUD();

const batchId = await baseAccount.sendBatchCalls({
  account: baseAccount.accountAddress,
  chainId: 8453,
  calls: [
    {
      to: "0x...",
      value: parseEther("0.01"),
    },
    {
      to: "0x...",
      data: "0x...",
    },
  ],
  usePaymaster: true,
});
```

## Example Component

See `src/components/BaseAccountExample.tsx` for a complete example component demonstrating:

- Checking wallet capabilities
- Sending batch transactions
- Handling paymaster support
- Error handling

## Architecture

### Files Added

- `src/lib/baseAccountConfig.ts` - Configuration and app metadata
- `src/lib/baseAccountUtils.ts` - Utility functions for batch transactions and capabilities
- `src/components/BaseAccountExample.tsx` - Example component

### Files Modified

- `src/mud/setupNetwork.ts` - Added Base Account capabilities and utilities
- `src/mud/createSystemCalls.ts` - Added batch transaction functions
- `package.json` - Updated viem to 2.x for EIP-5792 support

## Important Notes

### Supported Chains

Base Account features work best on Base mainnet (chain ID 8453). The current setup may need adjustment for other chains.

### Compatibility

- **Viem 2.x Required**: This implementation uses viem 2.x for EIP-5792 support
- **MUD Compatibility Note**: MUD packages internally use viem 1.x, which may cause TypeScript type conflicts. These are suppressed with type assertions and do not affect runtime functionality, as viem 2.x is backwards compatible
- **Mini App Context**: Batch transactions and paymasters work best when launched as a Mini App in the Base App
- **Fallback**: When not in Mini App context, the app falls back to standard transaction flow

### Unsupported Features

The following Base Account features are not yet supported in Mini Apps:

- Sign in with Base (`wallet_connect`)
- Sub accounts (`wallet_getSubAccounts`, `wallet_addSubAccount`)
- Spend permissions (`coinbase_fetchPermissions`)
- Signing typed data (`signTypedData`)
- Signing messages (`wallet_sign`)

## Testing

### Local Testing

To test locally, you can use the Farcaster Frame Debugger or simulate Mini App context:

```typescript
// Add query parameter to URL: ?miniApp=true
// Or set user agent to include "Farcaster"
```

### Production Testing

Deploy your app and test it by:

1. Creating a Mini App in the Base App
2. Launching your app from within the Base App
3. Verifying automatic Base Account connection

## Resources

- [Base Account Documentation](https://docs.base.org/base-account/overview/what-is-base-account)
- [EIP-5792 Specification](https://eips.ethereum.org/EIPS/eip-5792)
- [Coinbase Paymaster API](https://docs.cdp.coinbase.com/paymaster/introduction/welcome)
- [MUD Documentation](https://mud.dev/)

## Support

For issues or questions:

- Base Account: [Discord - Build on Base](https://discord.com/invite/buildonbase)
- MUD Framework: [MUD Discord](https://discord.gg/lattice)
