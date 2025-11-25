import { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import { Redis } from "@upstash/redis";
import { APP_NAME } from "./constants";

// In-memory fallback storage
const localStore = new Map<string, MiniAppNotificationDetails>();

// Lazy Redis initialization
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (
    redis === null &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return redis;
}

function getUserNotificationDetailsKey(fid: number, appFid: number): string {
  return `${APP_NAME}:user:${fid}:app:${appFid}`;
}

export async function getUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<MiniAppNotificationDetails | null> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  const redisClient = getRedis();
  if (redisClient) {
    return await redisClient.get<MiniAppNotificationDetails>(key);
  }
  return localStore.get(key) || null;
}

export async function setUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: MiniAppNotificationDetails
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  const redisClient = getRedis();
  if (redisClient) {
    await redisClient.set(key, notificationDetails);
  } else {
    localStore.set(key, notificationDetails);
  }
}

export async function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid, appFid);
  const redisClient = getRedis();
  if (redisClient) {
    await redisClient.del(key);
  } else {
    localStore.delete(key);
  }
}
