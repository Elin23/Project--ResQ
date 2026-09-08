import type { AppNotification, AppNotificationCategory } from "@/src/domain";
import type { AppNotificationDto } from "@/src/contracts/backend/notifications";

const categoryMap: Record<AppNotificationDto["category"], AppNotificationCategory> = {
  REPORT: "reports",
  ADOPTION: "adoption",
  DONATION: "donations",
  FEEDING_POINT: "feeding-points",
  ORGANIZATION: "organization",
  CONTENT: "content",
  SYSTEM: "system",
  ADVERTISEMENT: "advertisements",
};

export function notificationDtoToDomain(dto: AppNotificationDto, accountId: string): AppNotification {
  return {
    id: dto.id,
    accountId,
    title: dto.title,
    body: dto.body,
    category: categoryMap[dto.category],
    target: dto.deepLink
      ? { kind: "deep-link", href: dto.deepLink }
      : { kind: "none" },
    imageUrl: dto.imageUrl,
    deepLink: dto.deepLink,
    createdAt: dto.createdAt,
    readAt: dto.readAt,
  };
}
