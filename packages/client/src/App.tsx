import { useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";

import RootLayout from "./components/layout/layout";
import GameRoot from "./game/gameRoot";
import { ShareButton } from "./components/ui/ShareButton";
import { useMUD } from "./useMUD";
import { AuthButton } from "./components/auth/AuthButton";
import { MiniAppActions, FarcasterDemo } from "./components/farcaster";
import { useFarcaster } from "./farcaster";

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { mudBuildFacility },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const { isInMiniApp } = useFarcaster();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <RootLayout>
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        {isInMiniApp && (
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="rounded-md bg-purple-600 px-3 py-1 text-sm font-medium text-white hover:bg-purple-700"
          >
            {showDemo ? "Hide" : "Show"} Farcaster Demo
          </button>
        )}
        <AuthButton />
      </div>

      {showDemo ? (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
            <button
              onClick={() => setShowDemo(false)}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              ← Back to Game
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-bold">Context Info</h2>
              <FarcasterDemo />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold">SDK Actions</h2>
              <MiniAppActions />
            </div>
          </div>
        </div>
      ) : (
        <>
          <GameRoot />
          <div>
            Counter: <span>{counter?.value ?? "??"}</span>
          </div>
          <button
            type="button"
            className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={async (event) => {
              event.preventDefault();
              console.log("new counter value:", await mudBuildFacility());
            }}
          >
            mudBuildFacility
          </button>
          <ShareButton />
          <LoadingScreen />
        </>
      )}
    </RootLayout>
  );
};
