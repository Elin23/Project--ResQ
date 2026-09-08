import type { BackendId, GeoLocationDto, MediaDto } from "./common";

export type FeedingPointStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
export type FeedingPointCreatorType = "USER" | "ORGANIZATION";
export type FeedingPointCondition = "GOOD" | "NEEDS_CLEANING" | "DAMAGED" | "MISSING" | "UNKNOWN";
export type FeedingPointFoodLevel = "FULL" | "MEDIUM" | "LOW" | "EMPTY" | "UNKNOWN";
export type RefillReviewStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type FeedingPointIssueStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
export type FeedingPointIssueType = "EMPTY" | "NO_WATER" | "DAMAGED" | "DIRTY" | "MISSING" | "UNSAFE_LOCATION" | "OTHER";

export interface FeedingPointActorDto {
  type: FeedingPointCreatorType;
  id: BackendId;
  name: string;
}

export interface FeedingPointDto {
  id: BackendId;
  name?: string;
  status: FeedingPointStatus;
  description?: string;
  location: GeoLocationDto;
  createdBy: FeedingPointActorDto;
  media: MediaDto[];
  condition?: FeedingPointCondition;
  foodLevel?: FeedingPointFoodLevel;
  waterAvailable?: boolean;
  lastVerifiedRefillAt?: string;
  latestRefillReportAt?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  inactiveReason?: string;
}

export interface FeedingPointRefillDto {
  id: BackendId;
  feedingPointId: BackendId;
  submittedBy: FeedingPointActorDto;
  foodLevelAfter?: Exclude<FeedingPointFoodLevel, "UNKNOWN">;
  waterAvailableAfter?: boolean;
  note?: string;
  media: MediaDto[];
  occurredAt: string;
  createdAt: string;
  reviewStatus: RefillReviewStatus;
  rejectionReason?: string;
}

export interface FeedingPointIssueDto {
  id: BackendId;
  feedingPointId: BackendId;
  type: FeedingPointIssueType;
  status: FeedingPointIssueStatus;
  description?: string;
  submittedBy: FeedingPointActorDto;
  media?: MediaDto[];
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  rejectionReason?: string;
}
