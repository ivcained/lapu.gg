/**
 * Farcaster Mini App Context Types
 * Based on @farcaster/miniapp-sdk documentation
 */

export type MiniAppPlatformType = "web" | "mobile";

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type MiniAppNotificationDetails = {
  url: string;
  token: string;
};

export type MiniAppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
};

export type MiniAppCast = {
  author: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  hash: string;
  timestamp: number;
  text: string;
  embeds: string[];
  channelKey?: string;
};

// Location Context Types
export type CastEmbedLocationContext = {
  type: "cast_embed";
  embed: string;
  cast: MiniAppCast;
};

export type CastShareLocationContext = {
  type: "cast_share";
  cast: MiniAppCast;
};

export type NotificationLocationContext = {
  type: "notification";
  notification: {
    notificationId: string;
    title: string;
    body: string;
  };
};

export type LauncherLocationContext = {
  type: "launcher";
};

export type ChannelLocationContext = {
  type: "channel";
  channel: {
    key: string;
    name: string;
    imageUrl?: string;
  };
};

export type OpenMiniAppLocationContext = {
  type: "open_miniapp";
  referrerDomain: string;
};

export type MiniAppLocationContext =
  | CastEmbedLocationContext
  | CastShareLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext
  | OpenMiniAppLocationContext;

export type ClientContext = {
  platformType?: MiniAppPlatformType;
  clientFid: number;
  added: boolean;
  safeAreaInsets?: SafeAreaInsets;
  notificationDetails?: MiniAppNotificationDetails;
};

export type FeaturesContext = {
  haptics: boolean;
  cameraAndMicrophoneAccess?: boolean;
};

export type MiniAppContext = {
  user: MiniAppUser;
  location?: MiniAppLocationContext;
  client: ClientContext;
  features?: FeaturesContext;
};
