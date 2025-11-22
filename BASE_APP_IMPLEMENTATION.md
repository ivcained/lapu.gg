# Base App Implementation Progress

This document tracks the implementation of lapu.gg as a featured Base App mini app.

## ✅ Completed Features

### 1. Resource Economy System

**Smart Contracts** (`packages/contracts/`)

- **New Tables** (`mud.config.ts`):
  - `PlayerResources`: Tracks player coins and last claim time
  - `FacilityCost`: Defines coin cost for each facility type
  - `FacilityIncome`: Defines passive income rate for each facility type (coins per hour)
  - `BuiltAt`: Tracks when facilities were built for income calculations

- **ResourceSystem.sol**: New system contract for managing player resources
  - `initializePlayer()`: Give new players 1000 starting coins
  - `claimIncome()`: Claim accumulated income from facilities + base hourly rate
  - `getPendingIncome()`: View pending income without claiming
  - `calculateFacilityIncome()`: Calculate total income from owned facilities
  - Base income: 10 coins/hour for all players

- **FacilitySystem.sol**: Updated to integrate resources
  - Building now costs coins (checks PlayerResources before building)
  - Destroying facilities refunds 50% of build cost
  - Tracks build timestamp for income calculation

- **PostDeploy.s.sol**: Initializes facility economics
  - Gravity Hill (typeId: 1): Cost 500, Income 25/hr
  - Whirly Dynamo (typeId: 2): Cost 200, Income 25/hr
  - Residence (typeId: 3): Cost 100, Income 15/hr

**Client** (`packages/client/`)

- **Entity Type Mappings** (`src/game/data/entityTypes.ts`):
  - Maps facility names to numeric IDs for on-chain contracts
  - `gravityhill: 1`, `dynamo: 2`, `residence: 3`

- **System Calls** (`src/mud/createSystemCalls.ts`):
  - `initializePlayer()`: Initialize new player with starting resources
  - `claimIncome()`: Claim accumulated income
  - `getPendingIncome(address)`: Check pending income for a player

- **ResourcePanel UI** (`src/components/ui/resourcePanel.tsx`):
  - Displays player's Lapu coin balance
  - Shows pending income with auto-refresh every 10 seconds
  - "Claim Income" button when income is available
  - "Start Playing" button for new players
  - Integrated into GameUI

### Key Features of Resource System

1. **Earning Mechanics**:
   - Base passive income: 10 coins/hour
   - Facility income: 15-25 coins/hour per building
   - Income accumulates over time and can be claimed anytime

2. **Spending Mechanics**:
   - Building facilities costs coins (100-500 depending on type)
   - Destroying buildings refunds 50% of cost

3. **Low Friction Onboarding**:
   - New players get 1000 starting coins
   - Enough to build 2 Residences or 5 Dynamos immediately
   - No wallet setup required (uses Farcaster wallet or burner wallet)

## 🚧 Next Steps to Complete

### 2. Mobile Optimization (High Priority)

The Base App runs on mobile, so touch controls and responsive UI are critical:

- [ ] Add touch controls for building placement
- [ ] Optimize 3D rendering performance on mobile devices
- [ ] Make UI panels responsive for different screen sizes
- [ ] Test camera controls on mobile (pinch to zoom, swipe to rotate)
- [ ] Add haptic feedback for building placement
- [ ] Reduce asset sizes for faster mobile loading

### 3. Integrate On-Chain Building

Currently the construction system (`src/game/systems/constructionSystem.tsx`) only adds buildings to local state. It needs to:

- [ ] Call `mudBuildFacility()` with correct entityTypeId
- [ ] Check player resources before allowing construction
- [ ] Wait for transaction confirmation before showing building
- [ ] Show loading state during transaction
- [ ] Handle transaction errors gracefully
- [ ] Sync on-chain entities with 3D rendering

### 4. Social Features (Leaderboard)

Add competitive elements to encourage daily engagement:

- [ ] Create leaderboard showing:
  - Most buildings constructed
  - Highest income per hour
  - Total coins earned
- [ ] Add "Share City" feature for Farcaster
- [ ] Display player rank and stats
- [ ] Weekly/monthly leaderboard resets

### 5. Notification System

Implement webhook handler for push notifications:

- [ ] Create API endpoint `/api/webhook` (configured in Farcaster manifest)
- [ ] Send notifications when:
  - Income is ready to claim (e.g., every 4 hours)
  - Player reaches new milestones
  - New building types are unlocked
- [ ] Follow [Notification Guidelines](https://docs.base.org/mini-apps/featured-guidelines/notification-guidelines)

### 6. Enhanced Building Feedback

Make building more satisfying and fun:

- [ ] Add sound effects for:
  - Building placement
  - Income collection
  - Button clicks
- [ ] Add particle effects when buildings are placed
- [ ] Animate coins when claimed
- [ ] Add building construction animation
- [ ] Visual feedback for insufficient funds

### 7. Tutorial/Onboarding

First-time user experience:

- [ ] Show tutorial on first launch
- [ ] Guide user through placing first building
- [ ] Explain resource economy
- [ ] Show how to claim income
- [ ] Add tooltips for UI elements

### 8. Account Association

Update Farcaster manifest:

- [ ] Generate proper signature for account association
- [ ] Update `.well-known/farcaster.json` with valid signature
- [ ] Test manifest validation

### 9. Progressive Unlocks

Add progression system to keep players engaged:

- [ ] Unlock new building types as player progresses
- [ ] Add achievements/badges
- [ ] Increase income rates at certain milestones
- [ ] Add daily login bonuses

## 🏗️ Build & Deploy Instructions

### Prerequisites

1. Node.js 22.11.0+
2. pnpm installed
3. Foundry installed (for smart contracts)

### Building Contracts

```bash
cd packages/contracts
pnpm build
```

**Note**: There's currently a compatibility issue with the MUD CLI and Node.js import assertions. Once resolved:

1. Build contracts: `pnpm build`
2. Deploy locally: `pnpm dev`
3. Deploy to testnet: `pnpm deploy:testnet`

### Building Client

```bash
cd packages/client
pnpm build
```

### Local Development

```bash
# Terminal 1: Start local blockchain
cd packages/contracts
pnpm dev

# Terminal 2: Start client
cd packages/client
pnpm dev
```

## 📋 Base App Guidelines Checklist

Based on [The Base App Guidelines](https://docs.base.org/mini-apps/building/building):

- [x] **One core need**: Building a floating city (simple, focused)
- [x] **Earning**: Players earn coins from facilities (passive income)
- [x] **Creating**: Players construct and customize buildings
- [x] **Fun**: Satisfying 3D building game with progression
- [x] **Low friction onboarding**: No personal info, 1000 starting coins
- [ ] **Mobile optimized**: Needs touch controls and performance work
- [ ] **Group chat features**: Could add multiplayer/competitive elements
- [x] **Simple UI**: Clean, focused interface
- [ ] **Notifications**: Webhook handler needs implementation

## 🎯 Recommended Priority Order

1. **Fix build tooling** - Resolve MUD CLI compatibility issue
2. **Mobile optimization** - Critical for Farcaster mobile app
3. **Integrate on-chain building** - Connect UI to smart contracts
4. **Tutorial/onboarding** - Help new users understand the game
5. **Sound & particle effects** - Make gameplay more satisfying
6. **Social features** - Add leaderboard for engagement
7. **Notifications** - Keep players coming back
8. **Progressive unlocks** - Long-term engagement

## 📱 Farcaster Mini App Configuration

Current configuration in `.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyNzY1OTM1MzNiZTdkYzJiNDc0YmY5YTRhMWM2YTk4MDZkZWEzNGFkIn0",
    "payload": "eyJkb21haW4iOiJsYXB1LmdnIn0",
    "signature": "MHhhZjY2ZTY1ZDgwY2M2MTlhYmFiODE3YmQxYWY1ODE0YjU3OTBjOWVhMzdhNzEyN2YzNDg0MzMyMzU3Y2UxMDk5NjBmZWI1MGQzZjc0ZWFlMjU3YzMxMGQzYmZlNDk4MTEzZjY5NDZhZjY1ZWE1MDQyMWE3MDk3YTZkNjIwZDkzMTFi"
  },
  "frame": {
    "version": "1",
    "name": "Lapu",
    "iconUrl": "https://lapu.gg/gravity.webp",
    "splashImageUrl": "https://lapu.gg/gravity.webp",
    "splashBackgroundColor": "#76ADAB",
    "homeUrl": "https://lapu.gg/",
    "webhookUrl": "https://lapu.gg/api/webhook"
  }
}
```

**Needs updating**: Account association signature should be regenerated with proper credentials.

## 🧪 Testing

Before submitting for featuring:

1. [ ] Test in Farcaster mobile app
2. [ ] Test wallet integration (both Farcaster and burner wallet)
3. [ ] Test resource system (earning, spending, claiming)
4. [ ] Test all building types and costs
5. [ ] Test on different devices and screen sizes
6. [ ] Load test with multiple users
7. [ ] Verify manifest validation

## 📚 Additional Resources

- [The Base App Documentation](https://docs.base.org/mini-apps)
- [Farcaster Mini App SDK](https://docs.farcaster.xyz/developers/frames/v2/spec)
- [MUD Framework](https://mud.dev)
- [Featured Guidelines](https://docs.base.org/mini-apps/featured-guidelines/overview)

---

**Status**: Core resource economy implemented ✅
**Next**: Mobile optimization + build tooling fixes 🚧
