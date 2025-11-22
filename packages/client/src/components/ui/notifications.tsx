import { sdk } from "@farcaster/miniapp-sdk";
import { useCallback, useState } from "react";
import "./notifications.css";

export function NotificationSettings() {
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMiniApp = useCallback(async () => {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await sdk.actions.addMiniApp();

      if (response.notificationDetails) {
        setStatus("Mini App added with notifications enabled!");
      } else {
        setStatus("Mini App added without notifications");
      }
    } catch (error) {
      console.error("Error adding mini app:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="notification-settings">
      <button
        onClick={handleAddMiniApp}
        disabled={isLoading}
        className="notification-button"
      >
        {isLoading ? "Adding..." : "Enable Notifications"}
      </button>
      {status && <p className="notification-status">{status}</p>}
    </div>
  );
}
