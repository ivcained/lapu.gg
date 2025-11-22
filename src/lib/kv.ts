import { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import { Redis } from "@upstash/redis";
import { APP_NAME } from "./constants";

// In-memory fallback storage
const localStore = new Map<string, MiniAppNotificationDetails>();

// Use Redis if KV env vars are present, otherwise use in-memory
const useRedis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const redis = useRedis
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null;

function getUserNotificationDetailsKey(fid: number, appFid: number): string {
  return `${APP_NAME}:user:${fid}:app:${appFid}`;
}

export async function getUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<MiniAppNotificationDetails | null> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  if (redis) {
    return await redis.get<MiniAppNotificationDetails>(key);
  }
  return localStore.get(key) || null;
}

export async function setUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: MiniAppNotificationDetails
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  if (redis) {
    await redis.set(key, notificationDetails);
  } else {
    localStore.set(key, notificationDetails);
  }
}

export async function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  if (redis) {
    await redis.del(key);
  } else {
    localStore.delete(key);
  }
}
