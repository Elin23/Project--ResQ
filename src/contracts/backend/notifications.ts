import type { BackendId } from "./common";

export type AppNotificationCategory =
  | "REPORT"
  | "ADOPTION"
  | "DONATION"
  | "FEEDING_POINT"
  | "ORGANIZATION"
  | "CONTENT"
  | "SYSTEM"
  | "ADVERTISEMENT";

export interface AppNotificationDto {
  id: BackendId;
  title: string;
  body?: string;
  category: AppNotificationCategory;
  imageUrl?: string;
  deepLink?: string;
  createdAt: string;
  readAt?: string;
}
