import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";

import RootLayout from "./components/layout/layout";
import GameRoot from "./game/gameRoot";
import { ShareButton } from "./components/ui/ShareButton";
import { useMUD } from "./useMUD";
import { AuthButton } from "./components/auth/AuthButton";

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { mudBuildFacility },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);

  return (
    <RootLayout>
      <div className="absolute right-4 top-4 z-50">
        <AuthButton />
      </div>
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
    </RootLayout>
  );
};
