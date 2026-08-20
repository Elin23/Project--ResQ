export type AppNotificationCategory = "reports" | "volunteering" | "adoption";
export type AppNotificationTarget =
  | { kind: "adoption-application"; applicationId: string }
  | { kind: "adoption-listing-applications"; listingId: string }
  | { kind: "report"; reportId: string };

export interface AppNotification {
  id: string;
  accountId: string;
  title: string;
  body?: string;
  category: AppNotificationCategory;
  target: AppNotificationTarget;
  createdAt: string;
  readAt?: string;
}

export type CreateAppNotificationInput = Omit<AppNotification, "id" | "createdAt" | "readAt">;
