import type { BackendId } from "./common";

export type AppNotificationCategory =
  | "REPORT"
  | "ADOPTION"
  | "DONATION"
  | "FEEDING_POINT"
  | "ORGANIZATION"
  | "CONTENT"
  | "SYSTEM"
  | "ADVERTISEMENT"
  | string;

/** Swagger currently documents the notification list response loosely; these
 * fields mirror the concrete backend notification model and tolerate both the
 * historical `body` name and the production `message` name. */
export interface AppNotificationDto {
  id: BackendId | number;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  category?: AppNotificationCategory | null;
  imageUrl?: string | null;
  deepLink?: string | null;
  entityType?: string | null;
  entityId?: string | number | null;
  sourceType?: string | null;
  sourceId?: string | number | null;
  createdAt?: string | null;
  creationTime?: string | null;
  readAt?: string | null;
}

export interface UnreadCountDto { count: number; }

export interface RegisterDeviceRequest {
  pushToken: string;
  platform: string;
  deviceId: string;
}

export interface DeviceRegistrationDto {
  id: number;
  platform?: string | null;
  deviceId?: string | null;
  isActive: boolean;
  lastSeenAt: string;
}
