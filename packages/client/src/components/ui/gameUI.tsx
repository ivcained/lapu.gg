import { Inventory } from "./inventory";
import { NotificationSettings } from "./notifications";

function GameUI() {
  return (
    <div className="interface">
      <GameControls />
      <Inventory />
      <NotificationSettings />
    </div>
  );
}

export default GameUI;
