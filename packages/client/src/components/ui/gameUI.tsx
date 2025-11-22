import { Inventory } from "./inventory";
import { NotificationSettings } from "./notifications";

function GameUI() {
  return (
    <div className="interface">
      <Inventory />
      <NotificationSettings />
    </div>
  );
}

export default GameUI;
