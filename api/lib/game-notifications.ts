/**
 * Game-specific notification examples
 *
 * This file contains example functions for sending notifications
 * based on game events. Import and use these in your game logic.
 */

import { sendMiniAppNotification } from './notifications';

/**
 * Send notification when a facility is completed
 */
export async function notifyFacilityBuilt(
  fid: number,
  appFid: number,
  facilityName: string
) {
  return sendMiniAppNotification({
    fid,
    appFid,
    title: '🏗️ Building Complete',
    body: `Your ${facilityName} is ready!`,
  });
}

/**
 * Send notification when resources are ready to collect
 */
export async function notifyResourcesReady(
  fid: number,
  appFid: number,
  resourceType: string,
  amount: number
) {
  return sendMiniAppNotification({
    fid,
    appFid,
    title: '💎 Resources Ready',
    body: `Collect ${amount} ${resourceType} now!`,
  });
}

/**
 * Send notification when construction is blocked
 */
export async function notifyConstructionBlocked(
  fid: number,
  appFid: number,
  reason: string
) {
  return sendMiniAppNotification({
    fid,
    appFid,
    title: '⚠️ Construction Blocked',
    body: reason,
  });
}

/**
 * Send daily reminder notification
 */
export async function notifyDailyReminder(
  fid: number,
  appFid: number
) {
  return sendMiniAppNotification({
    fid,
    appFid,
    title: '🎮 Come back to Lapu!',
    body: 'Your facilities need attention',
  });
}

/**
 * Send achievement notification
 */
export async function notifyAchievement(
  fid: number,
  appFid: number,
  achievementName: string
) {
  return sendMiniAppNotification({
    fid,
    appFid,
    title: '🏆 Achievement Unlocked!',
    body: achievementName,
  });
}

/**
 * Send notification to multiple users
 * Useful for broadcasting game updates or events
 */
export async function notifyMultipleUsers(
  userIds: Array<{ fid: number; appFid: number }>,
  title: string,
  body: string
) {
  const results = await Promise.allSettled(
    userIds.map(({ fid, appFid }) =>
      sendMiniAppNotification({ fid, appFid, title, body })
    )
  );

  return {
    successful: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    total: results.length,
  };
}
