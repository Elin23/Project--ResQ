import type { FeedingPointDetails, FeedingPointIssueReason, FeedingPointSummary, FoodLevel, ReportedStatus } from "@/src/features/feeding-points/types";
import type { FeedingPointDto, FeedingPointFoodLevel, FeedingPointIssueType } from "@/src/contracts/backend/feedingPoints";

const displayFoodLevel = (level?: FeedingPointFoodLevel): FoodLevel => {
  if (level === "EMPTY") return "empty";
  if (level === "LOW" || level === "MEDIUM") return "medium";
  return "good";
};

const reportedStatus = (level?: FeedingPointFoodLevel): ReportedStatus =>
  level === "EMPTY" || level === "LOW" ? "needsFood" : "stocked";

export function feedingPointDtoToSummary(dto: FeedingPointDto): FeedingPointSummary {
  return {
    id: dto.id,
    name: dto.name ?? "نقطة إطعام",
    address: dto.location.address,
    coordinate: { latitude: dto.location.latitude, longitude: dto.location.longitude },
    status: reportedStatus(dto.foodLevel),
    lastStatusUpdateAt: dto.latestRefillReportAt ?? dto.updatedAt,
    thumbnailUrl: dto.media.find((item) => item.type === "IMAGE")?.thumbnailUrl ?? dto.media.find((item) => item.type === "IMAGE")?.url ?? null,
    isVerified: dto.status === "ACTIVE",
    hasWater: dto.waterAvailable ?? false,
    foodLevel: displayFoodLevel(dto.foodLevel),
  };
}

export function feedingPointDtoToDetails(dto: FeedingPointDto): FeedingPointDetails {
  const summary = feedingPointDtoToSummary(dto);
  return {
    ...summary,
    ownerAccountId: dto.createdBy.id,
    ownerAccountKind: dto.createdBy.type === "ORGANIZATION" ? "organization" : "user",
    moderationStatus: dto.status === "PENDING" ? "pending_review" : dto.status === "REJECTED" ? "rejected" : dto.status === "ACTIVE" ? "approved" : "archived",
    rejectionReason: dto.rejectionReason,
    photoUrl: dto.media.find((item) => item.type === "IMAGE")?.url ?? null,
    description: dto.description ?? null,
    createdByUserId: dto.createdBy.id,
    createdByName: dto.createdBy.name,
    createdAt: dto.createdAt,
    updatesCount: 0,
    facilities: dto.waterAvailable ? ["water"] : [],
  };
}

export const ISSUE_REASON_TO_BACKEND: Record<FeedingPointIssueReason, FeedingPointIssueType> = {
  empty: "EMPTY",
  noWater: "NO_WATER",
  damaged: "DAMAGED",
  dirty: "DIRTY",
  missing: "MISSING",
  unsafeLocation: "UNSAFE_LOCATION",
  other: "OTHER",
};
