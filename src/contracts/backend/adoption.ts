import type { BackendId, GeoLocationDto, MediaDto } from "./common";

export type AdoptionSpecies = "DOG" | "CAT" | "BIRD" | "OTHER";
export type AdoptionSex = "MALE" | "FEMALE" | "UNKNOWN";
export type AdoptionPublisherType = "USER" | "ORGANIZATION";
export type AdoptionModerationStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
export type AdoptionLifecycleStatus = "AVAILABLE" | "RESERVED" | "ADOPTED" | "CLOSED";
export type AdoptionApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"
  | "COMPLETED"
  | "NOT_SELECTED";

export interface AdoptionListingDto {
  id: BackendId;
  animal: {
    name?: string;
    species: AdoptionSpecies;
    breed?: string;
    sex: AdoptionSex;
    estimatedAgeMonths?: number;
    color?: string;
    size?: "SMALL" | "MEDIUM" | "LARGE";
    weightKg?: number;
    description: string;
    healthCondition?: string;
    traits?: string[];
  };
  publisher: {
    type: AdoptionPublisherType;
    id: BackendId;
    name: string;
    phone?: string;
    email?: string;
  };
  media: MediaDto[];
  location: GeoLocationDto;
  moderationStatus: AdoptionModerationStatus;
  lifecycleStatus: AdoptionLifecycleStatus;
  moderationReason?: string;
  submittedAt?: string;
  publishedAt?: string;
  rejectedAt?: string;
  adoptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionApplicationDto {
  id: BackendId;
  listingId: BackendId;
  applicant: {
    id: BackendId;
    name: string;
    phone?: string;
    email?: string;
    regionId?: BackendId;
    regionName?: string;
  };
  status: AdoptionApplicationStatus;
  message?: string;
  submittedAt: string;
  respondedAt?: string;
  ownerResponse?: string;
  contactShared: boolean;
  applicantHandoverConfirmedAt?: string;
  ownerHandoverConfirmedAt?: string;
  completedAt?: string;
}
