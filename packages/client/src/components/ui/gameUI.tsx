import { Inventory } from "./inventory";
import { ResourcePanel } from "./resourcePanel";

function GameUI() {
  return (
    <div className="interface">
      <GameControls />
      <Inventory />
      <ResourcePanel />
    </div>
  );
}

export default GameUI;
