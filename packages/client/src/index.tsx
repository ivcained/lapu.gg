import React from "react";
import mudConfig from "contracts/mud.config";
import ReactDOM from "react-dom/client";
import { sdk } from "@farcaster/miniapp-sdk";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { base } from "viem/chains";

import { App } from "./App";
import { setup } from "./mud/setup";

import "@/styles/index.css";

import { MUDProvider } from "./MUDProvider";

// Helper to check if we're running in a Farcaster miniapp context
const isMiniApp = () => {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  // Check for miniapp query param or if loaded in Farcaster client
  return (
    url.searchParams.get("miniApp") === "true" ||
    window.parent !== window || // Loaded in iframe
    navigator.userAgent.includes("Farcaster")
  );
};

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <React.StrictMode>
      <MiniKitProvider
        apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            name: import.meta.env.VITE_APP_NAME || "Lapu",
            logo: import.meta.env.VITE_APP_ICON_URL || "https://lapu.gg/icons/gravity.webp",
          },
        }}
      >
        <MUDProvider value={result}>
          <App />
        </MUDProvider>
      </MiniKitProvider>
    </React.StrictMode>
  );

  // Signal to Farcaster that the app is ready to display
  // This hides the splash screen in the Farcaster client
  if (isMiniApp()) {
    try {
      await sdk.actions.ready();
      console.log("[Farcaster]: Mini app ready signal sent");
    } catch (error) {
      console.warn("[Farcaster]: Failed to send ready signal", error);
    }
  }

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
