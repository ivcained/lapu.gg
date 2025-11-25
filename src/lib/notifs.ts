import { getUserNotificationDetails } from "./kv";
import { APP_URL } from "./constants";

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
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: `notif-${Date.now()}`,
        title,
        body,
        targetUrl: APP_URL,
        tokens: [notificationDetails.token],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { state: "rate_limit" };
      }
      return { state: "error", error: `HTTP ${response.status}` };
    }

    try {
      const result = await response.json();

      if (result.result?.rateLimitedTokens?.length > 0) {
        return { state: "rate_limit" };
      }

      return { state: "success" };
    } catch (jsonError) {
      return { state: "error", error: "Invalid JSON response" };
    }
  } catch (error) {
    return { state: "error", error };
  }
}
