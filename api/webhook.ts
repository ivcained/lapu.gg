import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from '@farcaster/miniapp-node';
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
} from './lib/db';
import { sendMiniAppNotification } from './lib/notifications';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse and verify the webhook event
    let data;
    try {
      data = await parseWebhookEvent(request.body, verifyAppKeyWithNeynar);
    } catch (e: any) {
      console.error('Error verifying webhook event:', e);
      return response.status(401).json({
        error: 'Invalid signature or event data',
        details: e.message
      });
    }

    // Extract webhook data
    const fid = data.fid;
    const appFid = data.appFid;
    const event = data.event;

    console.log(`Received event: ${event.event} for fid=${fid}, appFid=${appFid}`);

    // Handle different event types
    try {
      switch (event.event) {
        case 'miniapp_added':
          if (event.notificationDetails) {
            setUserNotificationDetails(fid, appFid, event.notificationDetails);
            // Send welcome notification asynchronously (don't wait for it)
            sendMiniAppNotification({
              fid,
              appFid,
              title: 'Welcome to Lapu!',
              body: 'Mini app is now added to your client',
            }).catch(err => console.error('Error sending welcome notification:', err));
          }
          break;

        case 'miniapp_removed':
          // Delete notification details
          deleteUserNotificationDetails(fid, appFid);
          break;

        case 'notifications_enabled':
          // Save new notification details
          if (event.notificationDetails) {
            setUserNotificationDetails(fid, appFid, event.notificationDetails);
            // Send confirmation notification asynchronously (don't wait for it)
            sendMiniAppNotification({
              fid,
              appFid,
              title: 'Ding ding ding',
              body: 'Notifications are now enabled',
            }).catch(err => console.error('Error sending confirmation notification:', err));
          }
          break;

        case 'notifications_disabled':
          // Delete notification details
          deleteUserNotificationDetails(fid, appFid);
          break;

        default:
          console.log(`Unknown event type: ${event.event}`);
      }

      // Return success response immediately
      // This is important for Base app to activate tokens
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return response.status(500).json({
        error: 'Error processing webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return response.status(500).json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
