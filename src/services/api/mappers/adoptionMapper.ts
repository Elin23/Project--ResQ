import type { AdoptionListing, AdoptionApplication } from "@/src/domain";
import type { AdoptionApplicationDto, AdoptionListingDto } from "@/src/contracts/backend/adoption";

export function adoptionListingDtoToDomain(dto: AdoptionListingDto): AdoptionListing {
  const ageMonths = dto.animal.estimatedAgeMonths ?? 0;
  const useYears = ageMonths >= 12 && ageMonths % 12 === 0;
  return {
    id: dto.id,
    ownerAccountId: dto.publisher.id,
    ownerAccountKind: dto.publisher.type === "ORGANIZATION" ? "organization" : "user",
    animalName: dto.animal.name ?? "بدون اسم",
    animalType: dto.animal.species,
    age: useYears ? ageMonths / 12 : ageMonths,
    ageUnit: useYears ? "years" : "months",
    gender: dto.animal.sex === "MALE" ? "male" : dto.animal.sex === "FEMALE" ? "female" : "unknown",
    traits: dto.animal.traits ?? [],
    description: dto.animal.description,
    weight: dto.animal.weightKg,
    color: dto.animal.color ?? "غير محدد",
    size: dto.animal.size === "SMALL" ? "small" : dto.animal.size === "LARGE" ? "large" : "medium",
    breed: dto.animal.breed,
    healthCondition: dto.animal.healthCondition ?? "غير محدد",
    healthChecklist: [],
    images: dto.media.filter((item) => item.type === "IMAGE").map((item) => item.url),
    location: {
      latitude: dto.location.latitude,
      longitude: dto.location.longitude,
      address: dto.location.address,
      area: dto.location.regionName,
    },
    contact: {
      name: dto.publisher.name,
      phone: dto.publisher.phone ?? "",
      preferredMethod: "phone",
    },
    imageUrl: dto.media.find((item) => item.type === "IMAGE")?.url ?? "",
    locationName: dto.location.regionName ?? dto.location.governorateName,
    organizationId: dto.publisher.type === "ORGANIZATION" ? dto.publisher.id : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    status: dto.lifecycleStatus === "RESERVED" ? "reserved" : dto.lifecycleStatus === "ADOPTED" ? "adopted" : dto.lifecycleStatus === "CLOSED" ? "closed" : "available",
    moderationStatus: dto.moderationStatus === "PUBLISHED" ? "approved" : dto.moderationStatus === "PENDING_REVIEW" ? "pending_review" : dto.moderationStatus === "REJECTED" ? "rejected" : "draft",
    submittedAt: dto.submittedAt,
    reviewedAt: dto.publishedAt ?? dto.rejectedAt,
    rejectionReason: dto.moderationReason,
  };
}

export function adoptionApplicationDtoToDomain(
  dto: AdoptionApplicationDto,
  listingOwnerAccountId: string,
): AdoptionApplication {
  const status: AdoptionApplication["status"] = dto.status === "ACCEPTED"
    ? "accepted"
    : dto.status === "REJECTED"
      ? "rejected"
      : dto.status === "WITHDRAWN"
        ? "withdrawn"
        : dto.status === "COMPLETED"
          ? "completed"
          : dto.status === "NOT_SELECTED"
            ? "not_selected"
            : "pending";
  return {
    id: dto.id,
    listingId: dto.listingId,
    listingOwnerAccountId,
    applicantAccountId: dto.applicant.id,
    applicantName: dto.applicant.name,
    phone: dto.applicant.phone ?? "",
    city: dto.applicant.regionName ?? "",
    housing: "other",
    hasOtherPets: false,
    experience: "",
    reason: dto.message ?? "",
    status,
    createdAt: dto.submittedAt,
    updatedAt: dto.respondedAt ?? dto.submittedAt,
    decidedAt: dto.respondedAt,
    decisionNote: dto.ownerResponse,
    applicantHandoverConfirmedAt: dto.applicantHandoverConfirmedAt,
    ownerHandoverConfirmedAt: dto.ownerHandoverConfirmedAt,
    completedAt: dto.completedAt,
  };
}
