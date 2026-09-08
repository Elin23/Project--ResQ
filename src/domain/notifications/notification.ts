export type AppNotificationCategory =
  | "reports"
  | "volunteering"
  | "adoption"
  | "donations"
  | "feeding-points"
  | "organization"
  | "content"
  | "system"
  | "advertisements";
export type AppNotificationTarget =
  | { kind: "adoption-application"; applicationId: string }
  | { kind: "adoption-listing-applications"; listingId: string }
  | { kind: "report"; reportId: string }
  | { kind: "deep-link"; href: string }
  | { kind: "none" };

export interface AppNotification {
  id: string;
  accountId: string;
  title: string;
  body?: string;
  category: AppNotificationCategory;
  target: AppNotificationTarget;
  imageUrl?: string;
  deepLink?: string;
  createdAt: string;
  readAt?: string;
}

export type CreateAppNotificationInput = Omit<AppNotification, "id" | "createdAt" | "readAt">;
