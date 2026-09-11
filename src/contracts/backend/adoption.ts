export type AdoptionModerationStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | string;
export type AdoptionLifecycleStatus = "AVAILABLE" | "RESERVED" | "ADOPTED" | "CLOSED" | string;
export interface AdoptionAnimalDto {
  name?: string|null; species?: string|null; breed?: string|null; sex?: string|null;
  estimatedAgeMonths?: number|null; color?: string|null; size?: string|null; weightKg?: number|null;
  description?: string|null; healthStatus?: string|null; healthCondition?: string|null; isVaccinated?: boolean;
  isFreeOfInfectiousDiseases?: boolean; isVeterinaryExamined?: boolean; traits?: string[]|null;
}
export interface AdoptionPublisherDto { type?: string|null; id?: string|null; name?: string|null; phone?: string|null; email?: string|null; }
export interface AdoptionMediaDto { id:number; type?:string|null; url?:string|null; thumbnailUrl?:string|null; altText?:string|null; }
export interface AdoptionLocationDto {
  governorateId?: number | string | null;
  governorateName?: string | null;
  regionId?: number | string | null;
  regionName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
export interface AdoptionListingDto {
  id:number|string; code?:string|null; animal:AdoptionAnimalDto; publisher:AdoptionPublisherDto; media?:AdoptionMediaDto[]|null;
  location?:AdoptionLocationDto|null;
  /** Compatibility with endpoints that flatten location fields on the listing. */
  governorateId?: number|string|null; governorateName?: string|null;
  regionId?: number|string|null; regionName?: string|null;
  address?: string|null; latitude?: number|null; longitude?: number|null;
  moderationStatus?:string|null; lifecycleStatus?:string|null; moderationReason?:string|null;
  submittedAt?:string|null; publishedAt?:string|null; rejectedAt?:string|null; adoptedAt?:string|null; createdAt:string; updatedAt:string;
}
export interface AdoptionApplicationDto {
  id:number; listingId:number;
  applicant:{id?:string|null;name?:string|null;phone?:string|null;email?:string|null;regionId?:number|null;regionName?:string|null};
  status?:string|null; message?:string|null; submittedAt:string; respondedAt?:string|null; ownerResponse?:string|null;
  additionalNotes?:string|null; hasPets?:boolean; hasOutdoorSpace?:boolean; houseType?:string|null; experienceLevel?:string|null;
  contactShared:boolean; applicantHandoverConfirmedAt?:string|null; ownerHandoverConfirmedAt?:string|null; completedAt?:string|null;
}


/**
 * Some adoption write endpoints return an acknowledgement payload instead of
 * the full listing DTO. Keep that response shape explicit so callers do not
 * accidentally pass it to adoptionListingDtoToDomain().
 */
export interface AdoptionListingMutationResponseDto {
  message?: string | null;
  id?: number | string | null;
  animalName?: string | null;
  animalType?: string | null;
  governorateId?: number | null;
  regionId?: number | null;
}
