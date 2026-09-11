import { resolveMediaUrl } from "../mediaUrl";
import type { AdoptionListing, AdoptionApplication } from "@/src/domain";
import type { AdoptionApplicationDto, AdoptionListingDto } from "@/src/contracts/backend/adoption";

const animalTypeLabel = (value?: string | null) => {
  switch (value?.toUpperCase()) {
    case "CAT": return "قطة";
    case "DOG": return "كلب";
    case "BIRD": return "طائر";
    case "RABBIT": return "أرنب";
    default: return "أخرى";
  }
};

const healthStatusFromApi = (value?: string | null): AdoptionListing["healthStatus"] => {
  switch (value?.toUpperCase()) {
    case "GOOD": return "good";
    case "NEEDS_CARE": return "needs_care";
    case "UNDER_TREATMENT": return "under_treatment";
    case "SPECIAL_NEEDS": return "special_needs";
    default: return "unknown";
  }
};

const housingFromApi = (value?: string | null): AdoptionApplication["housing"] => {
  switch (value?.toUpperCase()) {
    case "APARTMENT": return "apartment";
    case "HOUSE": return "house";
    case "FARM": return "farm";
    default: return "other";
  }
};

const experienceFromApi = (value?: string | null): AdoptionApplication["experience"] => {
  switch (value?.toUpperCase()) {
    case "BEGINNER": return "beginner";
    case "INTERMEDIATE": return "intermediate";
    case "EXPERIENCED": return "experienced";
    default: return "none";
  }
};

const normalizedUpper = (value?: string | null) => value?.trim().toUpperCase();

export function adoptionListingDtoToDomain(dto: AdoptionListingDto): AdoptionListing {
  const ageMonths = dto.animal?.estimatedAgeMonths ?? 0;
  const useYears = ageMonths >= 12 && ageMonths % 12 === 0;
  const media = dto.media ?? [];
  const images = media
    .filter((item) => !item.type || normalizedUpper(item.type) === "IMAGE")
    .map((item) => resolveMediaUrl(item.url))
    .filter(Boolean);

  const sexValue = normalizedUpper(dto.animal?.sex);
  const sex = sexValue === "MALE" ? "male" : sexValue === "FEMALE" ? "female" : "unknown";
  const sizeValue = normalizedUpper(dto.animal?.size);
  const size = sizeValue === "SMALL" ? "small" : sizeValue === "LARGE" ? "large" : "medium";
  const moderationValue = normalizedUpper(dto.moderationStatus);
  const moderationStatus = moderationValue === "PUBLISHED"
    ? "approved"
    : moderationValue === "PENDING_REVIEW"
      ? "pending_review"
      : moderationValue === "REJECTED"
        ? "rejected"
        : "draft";
  const lifecycleValue = normalizedUpper(dto.lifecycleStatus);
  const status = lifecycleValue === "RESERVED"
    ? "reserved"
    : lifecycleValue === "ADOPTED"
      ? "adopted"
      : lifecycleValue === "CLOSED"
        ? "closed"
        : "available";

  // Different adoption endpoints are not fully consistent: public/detail
  // responses return a nested `location`, while some write/mine responses can
  // expose the same fields at the listing root or temporarily omit `location`.
  // Normalize both shapes so rendering/refetching never crashes on
  // `dto.location.governorateId`.
  const location = dto.location ?? undefined;
  const governorateId = location?.governorateId ?? dto.governorateId;
  const governorateName = location?.governorateName ?? dto.governorateName ?? undefined;
  const regionId = location?.regionId ?? dto.regionId;
  const regionName = location?.regionName ?? dto.regionName ?? undefined;
  const address = location?.address ?? dto.address ?? "";
  const latitude = location?.latitude ?? dto.latitude ?? 0;
  const longitude = location?.longitude ?? dto.longitude ?? 0;

  return {
    id: String(dto.id),
    ownerAccountId: dto.publisher?.id ?? "",
    ownerAccountKind: dto.publisher?.type === "ORGANIZATION" ? "organization" : "user",
    animalName: dto.animal?.name ?? "بدون اسم",
    animalType: animalTypeLabel(dto.animal?.species),
    age: useYears ? ageMonths / 12 : ageMonths,
    ageUnit: useYears ? "years" : "months",
    gender: sex,
    traits: dto.animal?.traits ?? [],
    description: dto.animal?.description ?? "",
    weight: dto.animal?.weightKg ?? undefined,
    color: dto.animal?.color ?? "غير محدد",
    size,
    breed: dto.animal?.breed ?? undefined,
    healthStatus: healthStatusFromApi(dto.animal?.healthStatus),
    healthCondition: dto.animal?.healthCondition ?? "غير محدد",
    healthChecklist: [
      { id: "vaccinated", label: "مطعّم", checked: !!dto.animal?.isVaccinated },
      { id: "disease-free", label: "خالٍ من الأمراض المعدية", checked: !!dto.animal?.isFreeOfInfectiousDiseases },
      { id: "examined", label: "مفحوص بيطريًا", checked: !!dto.animal?.isVeterinaryExamined },
    ],
    images,
    mediaIds: media.map((item) => String(item.id)),
    location: {
      governorateId: governorateId == null ? undefined : String(governorateId),
      governorateName,
      regionId: regionId == null ? undefined : String(regionId),
      regionName,
      latitude: Number.isFinite(Number(latitude)) ? Number(latitude) : 0,
      longitude: Number.isFinite(Number(longitude)) ? Number(longitude) : 0,
      address,
      area: regionName,
    },
    contact: {
      name: dto.publisher?.name ?? "",
      phone: dto.publisher?.phone ?? "",
      preferredMethod: "phone",
    },
    imageUrl: images[0] ?? "",
    locationName: regionName ?? governorateName ?? address,
    organizationId: dto.publisher?.type === "ORGANIZATION" ? dto.publisher.id ?? undefined : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    status,
    moderationStatus,
    submittedAt: dto.submittedAt ?? undefined,
    reviewedAt: dto.publishedAt ?? dto.rejectedAt ?? undefined,
    rejectionReason: dto.moderationReason ?? undefined,
  };
}

export function adoptionApplicationDtoToDomain(dto: AdoptionApplicationDto, listingOwnerAccountId: string): AdoptionApplication {
  const status: AdoptionApplication["status"] = dto.status === "ACCEPTED" ? "accepted" : dto.status === "REJECTED" ? "rejected" : dto.status === "WITHDRAWN" ? "withdrawn" : dto.status === "COMPLETED" ? "completed" : dto.status === "NOT_SELECTED" ? "not_selected" : "pending";
  return { id:String(dto.id), listingId:String(dto.listingId), listingOwnerAccountId, applicantAccountId:dto.applicant?.id ?? "", applicantName:dto.applicant?.name ?? "", phone:dto.applicant?.phone ?? "", city:dto.applicant?.regionName ?? "", housing:housingFromApi(dto.houseType), hasOtherPets:!!dto.hasPets, hasOutdoorSpace:!!dto.hasOutdoorSpace, experience:experienceFromApi(dto.experienceLevel), reason:dto.message ?? "", notes:dto.additionalNotes ?? undefined, status, createdAt:dto.submittedAt, updatedAt:dto.respondedAt ?? dto.submittedAt, decidedAt:dto.respondedAt ?? undefined, decisionNote:dto.ownerResponse ?? undefined, applicantHandoverConfirmedAt:dto.applicantHandoverConfirmedAt ?? undefined, ownerHandoverConfirmedAt:dto.ownerHandoverConfirmedAt ?? undefined, completedAt:dto.completedAt ?? undefined };
}
