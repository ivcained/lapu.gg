import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import { NextRequest } from "next/server";
import { APP_NAME } from "~/lib/constants";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "~/lib/kv";
import { sendMiniAppNotification } from "~/lib/notifs";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  // Parse and verify the webhook event
  let data;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
    // Events are signed by the app key of a user with a JSON Farcaster Signature
  } catch (e: unknown) {
    const error = e as ParseWebhookEvent.ErrorType;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        // The request data is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        // The app key is invalid
        return Response.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        // Internal error verifying the app key (caller may want to try again)
        return Response.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      default:
        // If we reach here, an unknown error occurred
        return Response.json(
          { success: false, error: "Unknown error occurred" },
          { status: 500 }
        );
    }
  }

  // Extract webhook data
  const fid = data.fid;
  const appFid = data.appFid; // The FID of the client app that the user added the Mini App to
  const event = data.event;

  // Handle different event types
  try {
    switch (event.event) {
      case "miniapp_added":
        if (event.notificationDetails) {
          await setUserNotificationDetails(
            fid,
            appFid,
            event.notificationDetails
          );
          await sendMiniAppNotification({
            fid,
            appFid,
            title: `Welcome to ${APP_NAME}`,
            body: "Mini app is now added to your client",
          });
        }
        break;

      case "miniapp_removed":
        // Delete notification details
        await deleteUserNotificationDetails(fid, appFid);
        break;

      case "notifications_enabled":
        // Save new notification details and send confirmation
        await setUserNotificationDetails(
          fid,
          appFid,
          event.notificationDetails
        );
        await sendMiniAppNotification({
          fid,
          appFid,
          title: "Ding ding ding",
          body: "Notifications are now enabled",
        });
        break;

      case "notifications_disabled":
        // Delete notification details
        await deleteUserNotificationDetails(fid, appFid);
        break;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error processing webhook:", error);
    }
  }

  return Response.json({ success: true });
}
