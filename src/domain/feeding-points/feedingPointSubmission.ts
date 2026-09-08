import type { ModerationMetadata } from "../moderation/moderation";
import type { ContentOwner } from "../shared/ownership";

export type FeedingPointFacility = "water" | "shade";
export type FeedingPointInitialStatus = "stocked" | "needsFood";
export type FeedingPointFoodLevel = "FULL" | "MEDIUM" | "LOW" | "EMPTY" | "UNKNOWN";
export type FeedingPointCondition = "GOOD" | "NEEDS_CLEANING" | "DAMAGED" | "MISSING" | "UNKNOWN";

export interface FeedingPointSubmission extends ContentOwner, ModerationMetadata {
  id: string;
  name: string;
  address: string;
  governorateId?: string;
  governorateName?: string;
  regionId?: string;
  regionName?: string;
  latitude: number;
  longitude: number;
  description?: string;
  photoUri: string;
  facilities: FeedingPointFacility[];
  initialStatus: FeedingPointInitialStatus;
  foodLevel?: FeedingPointFoodLevel;
  waterAvailable?: boolean;
  condition?: FeedingPointCondition;
  note?: string;
  createdAt: string;
  updatedAt: string;
  /** Filled after approval when the submission becomes a public feeding point. */
  publishedFeedingPointId?: string;
}

export interface CreateFeedingPointSubmissionInput {
  ownerAccountId: string;
  ownerAccountKind: ContentOwner["ownerAccountKind"];
  name: string;
  address: string;
  governorateId?: string;
  governorateName?: string;
  regionId?: string;
  regionName?: string;
  latitude: number;
  longitude: number;
  description?: string;
  photoUri: string;
  facilities?: FeedingPointFacility[];
  initialStatus: FeedingPointInitialStatus;
  foodLevel?: FeedingPointFoodLevel;
  waterAvailable?: boolean;
  condition?: FeedingPointCondition;
  note?: string;
}
