import { Redis } from "@upstash/redis";
import { APP_NAME } from "./constants";

// In-memory fallback storage
const localSquatStore = new Map<string, SquatStats>();

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

export interface SquatStats {
  totalSquats: number;
  jsqtPoints: number;
  lastUpdated: string;
}

function getUserSquatStatsKey(fid: number): string {
  return `${APP_NAME}:squats:${fid}`;
}

export async function getUserSquatStats(
  fid: number
): Promise<SquatStats | null> {
  const key = getUserSquatStatsKey(fid);
  const redisClient = getRedis();
  if (redisClient) {
    return await redisClient.get<SquatStats>(key);
  }
  return localSquatStore.get(key) || null;
}

export async function setUserSquatStats(
  fid: number,
  stats: SquatStats
): Promise<void> {
  const key = getUserSquatStatsKey(fid);
  const redisClient = getRedis();
  if (redisClient) {
    await redisClient.set(key, stats);
  } else {
    localSquatStore.set(key, stats);
  }
}

export async function incrementUserSquats(
  fid: number,
  squats: number
): Promise<SquatStats> {
  const currentStats = await getUserSquatStats(fid);
  const newStats: SquatStats = {
    totalSquats: (currentStats?.totalSquats || 0) + squats,
    jsqtPoints: (currentStats?.jsqtPoints || 0) + squats,
    lastUpdated: new Date().toISOString(),
  };
  await setUserSquatStats(fid, newStats);
  return newStats;
}

export async function deleteUserSquatStats(fid: number): Promise<void> {
  const key = getUserSquatStatsKey(fid);
  const redisClient = getRedis();
  if (redisClient) {
    await redisClient.del(key);
  } else {
    localSquatStore.delete(key);
  }
}
