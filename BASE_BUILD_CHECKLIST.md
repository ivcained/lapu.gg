# Base Mini App Build Checklist for Lapu.gg

> Comprehensive checklist based on [Base Build Checklist](https://docs.base.org/mini-apps/quickstart/build-checklist)

## ✅ Status Legend
- ✅ **Complete** - Fully implemented
- ⚠️ **Partial** - Started but needs work
- ❌ **Todo** - Not yet implemented
- 🔄 **In Review** - Needs testing/validation

---

## 1. Register for Base Build ❌

**Status:** Not Completed

**What it unlocks:**
- Builder Rewards eligibility
- Featured placement opportunities
- Growth insights and analytics
- Preview tool for testing and debugging

**Action Items:**
- [ ] Visit https://base.dev and register lapu.gg
- [ ] Complete Base Build application form
- [ ] Link GitHub repository
- [ ] Configure analytics/tracking

**Resources:**
- [Base Build Registration](https://base.dev)

---

## 2. Authentication ⚠️

**Status:** Partially Implemented

**Current Implementation:**
- ✅ Farcaster SDK integrated (`@farcaster/miniapp-sdk`)
- ✅ Wallet provider detection in miniapp context
- ✅ Fallback to burner wallet for development
- ⚠️ Auto-connects on load (should be deferred)

**Issues to Fix:**
- ❌ Authentication happens immediately on app load
- ❌ No clear user prompt for wallet connection
- ❌ Should defer auth until onchain interaction is needed

**Action Items:**
- [ ] Implement deferred authentication pattern
- [ ] Add "Connect Wallet" button/prompt only when needed
- [ ] Allow users to explore game before requiring wallet
- [ ] Add clear messaging about why wallet connection is needed
- [ ] Test auth flow in Farcaster client

**Code Locations:**
- Authentication logic: `packages/client/src/mud/setupNetwork.ts:77-117`
- App initialization: `packages/client/src/index.tsx:30-48`

**Resources:**
- [Authentication Best Practices](https://docs.base.org/mini-apps/core-concepts/authentication)

---

## 3. Manifest ⚠️

**Status:** Partially Implemented

**Current Implementation:**
- ✅ Manifest file exists: `packages/client/public/.well-known/farcaster.json`
- ✅ Basic fields configured (name, iconUrl, homeUrl, etc.)
- ⚠️ Account association present but with placeholder signature
- ❌ Missing `noindex: true` for testing phase

**Current Manifest:**
```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "PLACEHOLDER_SIGNATURE"  // ⚠️ NEEDS REAL SIGNATURE
  },
  "miniapp": {
    "version": "1",
    "name": "Lapu",
    "iconUrl": "https://lapu.gg/icons/gravity.webp",
    "homeUrl": "https://lapu.gg",
    "imageUrl": "https://lapu.gg/icons/gravity.webp",
    "buttonTitle": "Play Lapu",
    "splashImageUrl": "https://lapu.gg/icons/gravity.webp",
    "splashBackgroundColor": "#76ADAB",
    "webhookUrl": "https://lapu.gg/api/webhook"
  }
}
```

**Action Items:**
- [ ] **CRITICAL:** Sign the manifest with valid signature
- [ ] Add `"noindex": true` to manifest during testing
- [ ] Verify all asset URLs are accessible and valid
- [ ] Test manifest validation using Base Preview tool
- [ ] Add proper description field
- [ ] Consider adding category field for discovery
- [ ] Implement webhook endpoint (`/api/webhook`)
- [ ] Remove `noindex` flag before production launch

**Resources:**
- [Sign Your Manifest](https://docs.base.org/mini-apps/core-concepts/manifest)

---

## 4. Embeds & Previews ⚠️

**Status:** Partially Implemented

**Current Implementation:**
- ✅ Basic OG tags in `index.html`
- ✅ Icon/image URL configured
- ⚠️ Using same image for all contexts
- ❌ Missing compelling preview image
- ❌ No dedicated launch button design

**Current Meta Tags:**
```html
<meta property="og:title" content="Lapu" />
<meta property="og:description" content="Build your floating city in the sky" />
<meta property="og:image" content="/icons/gravity.webp" />
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="/icons/gravity.webp" />
```

**Action Items:**
- [ ] Create compelling preview image (1200x630px recommended)
- [ ] Design distinct splash screen image
- [ ] Add clear call-to-action in preview
- [ ] Test preview appearance in Farcaster feed
- [ ] Optimize images for fast loading
- [ ] Add Twitter Card meta tags for broader sharing
- [ ] Create variant images for different contexts

**Code Location:**
- Meta tags: `packages/client/index.html:9-17`

**Resources:**
- [Embeds & Previews](https://docs.base.org/mini-apps/core-concepts/embeds-and-previews)

---

## 5. Search & Discovery ❌

**Status:** Not Implemented

**Action Items:**
- [ ] Set primary category in manifest
- [ ] Share app at least once to trigger indexing
- [ ] Verify all asset URLs are valid and accessible
- [ ] Add relevant keywords/tags
- [ ] Test discoverability in Farcaster search
- [ ] Monitor search rankings in Base Build dashboard
- [ ] Optimize app name and description for discoverability

**Available Categories:**
- Games
- Social
- DeFi
- NFTs
- Utilities
- (Check latest Base docs for full list)

**Recommended Category:** `Games`

**Resources:**
- [Search & Discovery](https://docs.base.org/mini-apps/troubleshooting/how-search-works)

---

## 6. Sharing & Social Graph ❌

**Status:** Not Implemented

**What's Needed:**
- Social sharing functionality
- Cast/share buttons in-game
- Social navigation features
- Friend/follow integration
- Leaderboards or social features

**Action Items:**
- [ ] Implement native share flows using Farcaster SDK
- [ ] Add share button after achievements/milestones
- [ ] Integrate social graph for finding friends
- [ ] Add leaderboards or competitive features
- [ ] Create shareable moments (screenshots, achievements)
- [ ] Design share templates with compelling visuals
- [ ] Test sharing flow in Farcaster client

**Suggested Share Points:**
- City construction milestones
- High scores or achievements
- Unique building designs
- Daily rewards/streaks

**Resources:**
- [Sharing & Social Graph](https://docs.base.org/mini-apps/technical-guides/sharing-and-social-graph)

---

## 7. Notifications ❌

**Status:** Not Implemented

**What's Needed:**
- Notification permission flow
- Webhook endpoint implementation
- Rate limiting
- Notification scheduling

**Suggested Notification Use Cases:**
- Construction completion alerts
- Resource collection reminders
- Daily login rewards
- Special events or challenges
- Friend activity updates

**Action Items:**
- [ ] Implement webhook endpoint (`/api/webhook` - currently in manifest)
- [ ] Request notification permissions at appropriate time
- [ ] Design notification templates
- [ ] Implement rate limiting (avoid spam)
- [ ] Set up notification scheduling service
- [ ] Test notification delivery
- [ ] Add notification preferences in settings

**Code Location:**
- Webhook URL configured: `packages/client/public/.well-known/farcaster.json:16`
- Implementation needed: `/api/webhook` endpoint

**Resources:**
- [Notifications](https://docs.base.org/mini-apps/core-concepts/notifications)

---

## 8. UX Best Practices ⚠️

**Status:** Partially Implemented

### Design Patterns

**Current Implementation:**
- ✅ Responsive viewport meta tag
- ✅ Touch-optimized 3D game interface
- ✅ WebGL/Three.js for rendering
- ⚠️ May need safe area adjustments
- ❌ No loading states for actions
- ❌ Limited error handling UI

**Action Items:**
- [ ] Respect safe areas (iOS notch, Android navigation)
- [ ] Add loading states for all async operations
- [ ] Implement error boundaries
- [ ] Test on various screen sizes (iPhone SE to iPad)
- [ ] Ensure minimum touch target size (44x44pt)
- [ ] Add haptic feedback for important actions
- [ ] Optimize font sizes for mobile readability
- [ ] Test in portrait and landscape orientations
- [ ] Add offline state handling

**Code Locations:**
- Viewport config: `packages/client/index.html:6`
- Game UI: `packages/client/src/components/ui/gameUI.tsx`
- Layout: `packages/client/src/components/layout/layout.tsx`

### OnchainKit Integration ❌

**Status:** Not Implemented

**Action Items:**
- [ ] Install OnchainKit: `npm install @coinbase/onchainkit`
- [ ] Integrate OnchainKit components for wallet connection
- [ ] Use OnchainKit for transaction flows
- [ ] Implement OnchainKit identity components
- [ ] Add OnchainKit theming to match game aesthetic

**Resources:**
- [Design Guidelines](https://docs.base.org/mini-apps/featured-guidelines/design-guidelines)
- [OnchainKit](https://docs.base.org/mini-apps/featured-guidelines/product-guidelines/foundations)

---

## 9. Build for Growth ❌

**Status:** Not Implemented

### Optimize Onboarding

**Action Items:**
- [ ] Create clear first-time user flow
- [ ] Add tutorial or guided first steps
- [ ] Reduce friction to first meaningful action
- [ ] Set clear initial goals/objectives
- [ ] Provide immediate value before requiring wallet
- [ ] Add progress indicators for onboarding
- [ ] A/B test onboarding flows

**Suggested Onboarding Flow:**
1. Show compelling splash screen
2. Let user explore basic mechanics (no wallet)
3. Prompt wallet connection when needed
4. Guide first building placement
5. Celebrate first milestone
6. Introduce social/sharing features

### Build Viral Features

**Action Items:**
- [ ] Implement referral system
- [ ] Add social proof (show friend activity)
- [ ] Create shareable moments
- [ ] Design for screenshots/sharing
- [ ] Add competitive elements (leaderboards)
- [ ] Implement daily rewards/streaks
- [ ] Create limited-time events
- [ ] Add cooperative multiplayer elements

**Viral Loop Ideas:**
- "Friend helped build" mechanics
- Shared city showcases
- Competition events with social sharing
- Achievement unlocks that encourage sharing

**Resources:**
- [Optimize Onboarding](https://docs.base.org/mini-apps/growth/optimize-onboarding)
- [Build Viral Mini Apps](https://docs.base.org/mini-apps/growth/build-viral-mini-apps)

---

## Technical Debt & Improvements

### High Priority
- [ ] Sign manifest with valid signature
- [ ] Implement webhook endpoint
- [ ] Add proper error handling and user feedback
- [ ] Implement deferred authentication
- [ ] Add loading states throughout app

### Medium Priority
- [ ] Set up analytics/tracking
- [ ] Add comprehensive logging
- [ ] Implement performance monitoring
- [ ] Add feature flags for gradual rollout
- [ ] Set up A/B testing infrastructure

### Low Priority
- [ ] Add dark mode support
- [ ] Implement accessibility features
- [ ] Add keyboard shortcuts
- [ ] Create admin dashboard
- [ ] Add developer tools/debug mode

---

## Testing Checklist

### Pre-Launch Testing
- [ ] Test in Farcaster iOS app
- [ ] Test in Farcaster Android app
- [ ] Test authentication flow
- [ ] Test all transaction flows
- [ ] Test sharing functionality
- [ ] Test notifications
- [ ] Load test for concurrent users
- [ ] Test on slow network conditions
- [ ] Test with empty/error states
- [ ] Security audit of smart contracts

### Performance Benchmarks
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size optimized
- [ ] Image assets optimized
- [ ] 3D models/textures optimized

---

## Launch Readiness

### Before Public Launch
- [ ] All ✅ items above completed
- [ ] Base Build registration approved
- [ ] Manifest properly signed
- [ ] Remove `noindex: true` from manifest
- [ ] All assets tested and accessible
- [ ] Monitoring and alerts configured
- [ ] Support/help documentation ready
- [ ] Social media accounts set up
- [ ] Launch announcement prepared
- [ ] Community/Discord ready

### Post-Launch
- [ ] Monitor analytics closely
- [ ] Gather user feedback
- [ ] Track key metrics (DAU, retention, sharing)
- [ ] Iterate based on user behavior
- [ ] Apply for featured placement
- [ ] Engage with community
- [ ] Regular content updates

---

## Key Metrics to Track

1. **Acquisition**
   - Daily/Monthly Active Users (DAU/MAU)
   - Install sources
   - Share-to-install conversion

2. **Engagement**
   - Session length
   - Session frequency
   - Feature usage
   - Transaction completion rate

3. **Retention**
   - Day 1/7/30 retention
   - Churn rate
   - Re-engagement rate

4. **Virality**
   - K-factor (viral coefficient)
   - Share rate
   - Referral conversion

5. **Monetization** (if applicable)
   - Transaction volume
   - Average transaction value
   - Revenue per user

---

## Resources & References

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps)
- [Base Build Platform](https://base.dev)
- [Farcaster Mini App SDK](https://github.com/farcasterxyz/miniapp-sdk)
- [OnchainKit](https://onchainkit.xyz)
- [MUD Framework](https://mud.dev)

---

## Contact & Support

For questions or issues:
- Check the [Base Documentation](https://docs.base.org)
- Join the [Base Discord](https://discord.gg/base)
- Visit [Farcaster Developer Portal](https://developers.farcaster.xyz)

---

**Last Updated:** 2025-11-22
**Next Review:** Before public launch
