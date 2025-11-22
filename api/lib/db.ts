import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const DB_FILE = join(DATA_DIR, 'notifications.json');

interface NotificationDetails {
  url: string;
  token: string;
  updatedAt: string;
}

interface NotificationDB {
  [key: string]: NotificationDetails; // key format: "fid-appFid"
}

// Ensure data directory exists
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read database
function readDB(): NotificationDB {
  ensureDataDir();
  if (!existsSync(DB_FILE)) {
    return {};
  }
  try {
    const data = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
}

// Write database
function writeDB(data: NotificationDB): void {
  ensureDataDir();
  try {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

// Generate key for user-app combination
function makeKey(fid: number, appFid: number): string {
  return `${fid}-${appFid}`;
}

// Set user notification details
export function setUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: { url: string; token: string }
): void {
  const db = readDB();
  const key = makeKey(fid, appFid);
  db[key] = {
    ...notificationDetails,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
}

// Get user notification details
export function getUserNotificationDetails(
  fid: number,
  appFid: number
): NotificationDetails | null {
  const db = readDB();
  const key = makeKey(fid, appFid);
  return db[key] || null;
}

// Delete user notification details
export function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): void {
  const db = readDB();
  const key = makeKey(fid, appFid);
  delete db[key];
  writeDB(db);
}
