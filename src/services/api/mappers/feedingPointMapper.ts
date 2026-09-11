import { resolveMediaUrl } from "../mediaUrl";
import type {
  FeedingPointDetails,
  FeedingPointIssueReason,
  FeedingPointSummary,
  FoodLevel,
  ReportedStatus,
} from "@/src/features/feeding-points/types";
import type {
  FeedingPointDto,
  FeedingPointIssueType,
} from "@/src/contracts/backend/feedingPoints";

const displayFoodLevel = (level?: string | null): FoodLevel =>
  level === "EMPTY"
    ? "empty"
    : level === "LOW" || level === "MEDIUM"
      ? "medium"
      : "good";

const reportedStatus = (level?: string | null): ReportedStatus =>
  level === "EMPTY" || level === "LOW" ? "needsFood" : "stocked";

export function feedingPointDtoToSummary(
  dto: FeedingPointDto,
): FeedingPointSummary {
  const media = dto.media ?? [];

  return {
    id: String(dto.id),
    name: dto.name ?? "نقطة إطعام",
    address: dto.address ?? "",
    coordinate: {
      latitude: dto.latitude,
      longitude: dto.longitude,
    },
    status: reportedStatus(dto.foodLevel),
    lastStatusUpdateAt: dto.lastVerifiedRefillAt ?? dto.updatedAt,
    thumbnailUrl:
      resolveMediaUrl(
        media.find((x) => !x.type || x.type === "IMAGE")?.thumbnailUrl ??
          media.find((x) => !x.type || x.type === "IMAGE")?.url,
      ) || null,
    isVerified: dto.status === "ACTIVE",
    hasWater: dto.waterAvailable,
    foodLevel: displayFoodLevel(dto.foodLevel),
  };
}

export function feedingPointDtoToDetails(
  dto: FeedingPointDto,
): FeedingPointDetails {
  const s = feedingPointDtoToSummary(dto);
  const media = dto.media ?? [];

  return {
    ...s,
    ownerAccountId: "",
    ownerAccountKind: "user",
    moderationStatus:
      dto.status === "PENDING"
        ? "pending_review"
        : dto.status === "REJECTED"
          ? "rejected"
          : dto.status === "ACTIVE"
            ? "approved"
            : "archived",
    rejectionReason: dto.rejectionReason ?? undefined,

    // FeedingPointDetails.photoUrl معرف كـ string وليس string | null
    photoUrl:
      resolveMediaUrl(
        media.find((x) => !x.type || x.type === "IMAGE")?.url,
      ) || "",

    description: dto.note ?? null,
    createdByUserId: "",
    createdByName: "",
    createdAt: dto.createdAt,
    updatesCount: 0,
    facilities: dto.waterAvailable ? ["water"] : [],
  };
}

export const ISSUE_REASON_TO_BACKEND: Record<
  FeedingPointIssueReason,
  FeedingPointIssueType
> = {
  empty: "EMPTY",
  noWater: "NO_WATER",
  damaged: "DAMAGED",
  dirty: "DIRTY",
  missing: "MISSING",
  unsafeLocation: "UNSAFE_LOCATION",
  other: "OTHER",
};