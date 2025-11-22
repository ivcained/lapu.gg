import { sendMiniAppNotification as sdkSendNotification } from "@farcaster/miniapp-node";
import { getUserNotificationDetails } from "./kv";

type SendMiniAppNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
}): Promise<SendMiniAppNotificationResult> {
  const notificationDetails = await getUserNotificationDetails(fid, appFid);

  if (!notificationDetails) {
    return { state: "no_token" };
  }

  try {
    const result = await sdkSendNotification({
      notificationDetails,
      notification: {
        title,
        body,
      },
    });

    if (result.state === "rate_limit") {
      return { state: "rate_limit" };
    }

    return { state: "success" };
  } catch (error) {
    return { state: "error", error };
  }
}
