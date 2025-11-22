import { Redis } from "@upstash/redis";
import { APP_NAME } from "./constants";

// In-memory fallback storage
const localSquatStore = new Map<string, SquatStats>();

// Use Redis if KV env vars are present, otherwise use in-memory
const useRedis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const redis = useRedis
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null;

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
  if (redis) {
    return await redis.get<SquatStats>(key);
  }
  return localSquatStore.get(key) || null;
}

export async function setUserSquatStats(
  fid: number,
  stats: SquatStats
): Promise<void> {
  const key = getUserSquatStatsKey(fid);
  if (redis) {
    await redis.set(key, stats);
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
  if (redis) {
    await redis.del(key);
  } else {
    localSquatStore.delete(key);
  }
}
