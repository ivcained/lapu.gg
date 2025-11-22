// Configuration for Base MiniKit and Farcaster Miniapp
// This file configures the manifest and metadata for the Lapu miniapp

const ROOT_URL = "https://lapu.gg";

export const minikitConfig = {
  accountAssociation: {
    // These values should be generated using the Warpcast Mini App Manifest Tool
    // Visit: https://warpcast.com/~/developers/mini-apps
    // Or use the Base Build tool at: https://base.dev/preview
    header: "eyJmaWQiOjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0",
    payload: "eyJkb21haW4iOiJsYXB1LmdnIn0",
    signature: "PLACEHOLDER_SIGNATURE" // Replace with actual signature from Warpcast tool
  },
  miniapp: {
    version: "1",
    name: "Lapu",
    iconUrl: `${ROOT_URL}/icons/gravity.webp`,
    homeUrl: ROOT_URL,
    imageUrl: `${ROOT_URL}/icons/gravity.webp`,
    buttonTitle: "Play Lapu",
    splashImageUrl: `${ROOT_URL}/icons/gravity.webp`,
    splashBackgroundColor: "#76ADAB",
    webhookUrl: `${ROOT_URL}/api/webhook`,

    // Optional metadata for better discoverability
    subtitle: "Build your floating city in the sky",
    description: "A blockchain-based city-building game where you create and manage your own floating city",
    primaryCategory: "games" as const,
    tags: ["games", "blockchain", "city-building", "base", "mud"],
    heroImageUrl: `${ROOT_URL}/icons/gravity.webp`,
    tagline: "Build your floating city in the sky",
    ogTitle: "Lapu - Build Your Sky City",
    ogDescription: "Build your floating city in the sky on Base",
    ogImageUrl: `${ROOT_URL}/icons/gravity.webp`,
  },
} as const;

export default minikitConfig;
