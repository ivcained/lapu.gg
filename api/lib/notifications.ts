import { getUserNotificationDetails } from './db';

export interface SendNotificationRequest {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
}

export interface SendNotificationResponse {
  result: {
    successfulTokens: string[];
    invalidTokens: string[];
    rateLimitedTokens: string[];
  };
}

export type SendMiniAppNotificationResult =
  | { state: 'success' }
  | { state: 'no_token' }
  | { state: 'rate_limit' }
  | { state: 'error'; error: any };

export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendMiniAppNotificationResult> {
  const notificationDetails = getUserNotificationDetails(fid, appFid);
  if (!notificationDetails) {
    return { state: 'no_token' };
  }

  // Use the app's home URL if no targetUrl is provided
  const url = targetUrl || 'https://lapu.gg';

  const requestBody: SendNotificationRequest = {
    notificationId: crypto.randomUUID(),
    title,
    body,
    targetUrl: url,
    tokens: [notificationDetails.token],
  };

  try {
    const response = await fetch(notificationDetails.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      const responseBody = responseJson as SendNotificationResponse;

      if (responseBody.result.rateLimitedTokens.length) {
        return { state: 'rate_limit' };
      }

      return { state: 'success' };
    } else {
      return { state: 'error', error: responseJson };
    }
  } catch (error) {
    return { state: 'error', error };
  }
}
