import { resolveOptionalMediaUrl } from "../mediaUrl";
import type { AppNotification, AppNotificationCategory } from "@/src/domain";
import type { AppNotificationDto } from "@/src/contracts/backend/notifications";
import { toBackendId } from "@/src/contracts/backend/common";

const categoryMap: Record<string, AppNotificationCategory> = {
  REPORT: "reports",
  REPORTS: "reports",
  ADOPTION: "adoption",
  DONATION: "donations",
  DONATIONS: "donations",
  FEEDING_POINT: "feeding-points",
  FEEDING_POINTS: "feeding-points",
  ORGANIZATION: "organization",
  CONTENT: "content",
  SYSTEM: "system",
  ADVERTISEMENT: "advertisements",
  ADVERTISEMENTS: "advertisements",
  VOLUNTEERING: "volunteering",
};

function normalizeCategory(value?: string | null): AppNotificationCategory {
  return categoryMap[(value ?? "SYSTEM").trim().toUpperCase()] ?? "system";
}

function targetFromDto(dto: AppNotificationDto): AppNotification["target"] {
  if (dto.deepLink) return { kind: "deep-link", href: dto.deepLink };
  const entityType = (dto.entityType ?? dto.sourceType ?? "").trim().toUpperCase();
  const entityId = toBackendId(dto.entityId ?? dto.sourceId);
  if (entityId && ["REPORT", "REPORTS"].includes(entityType)) return { kind: "report", reportId: entityId };
  return { kind: "none" };
}

export function notificationDtoToDomain(dto: AppNotificationDto, accountId: string): AppNotification {
  return {
    id: toBackendId(dto.id),
    accountId,
    title: dto.title?.trim() || "إشعار جديد",
    body: dto.message ?? dto.body ?? undefined,
    category: normalizeCategory(dto.category),
    target: targetFromDto(dto),
    imageUrl: resolveOptionalMediaUrl(dto.imageUrl),
    deepLink: dto.deepLink ?? undefined,
    createdAt: dto.createdAt ?? dto.creationTime ?? new Date().toISOString(),
    readAt: dto.readAt ?? undefined,
  };
}
