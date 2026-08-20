import type { AppNotification, CreateAppNotificationInput } from "./notification";
export interface NotificationRepository {
  create(input: CreateAppNotificationInput): Promise<AppNotification>;
  listForAccount(accountId: string): Promise<AppNotification[]>;
  markRead(id: string, accountId: string): Promise<AppNotification | undefined>;
  markAllRead(accountId: string): Promise<void>;
}
