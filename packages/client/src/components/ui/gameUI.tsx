import { Inventory } from "./inventory";
import GameControls from "./gameControls";

function GameUI() {
  return (
    <div className="interface">
      <GameControls />
      <Inventory />
    </div>
  );
}

export default GameUI;
