import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AdoptionApplicationRepository,
  AdoptionContactAccess,
  AdoptionListing,
  AdoptionRepository,
  CreateAdoptionApplicationInput,
  CreateAdoptionListingInput,
  CreateDonationCampaignInput,
  CreateDonationTransferInput,
  CreateFeedingPointSubmissionInput,
  DonationCampaign,
  DonationCampaignRepository,
  DonationTransfer,
  DonationTransferRepository,
  FeedingPointSubmission,
  FeedingPointSubmissionRepository,
  UpdateAdoptionListingInput,
  UpdateDonationCampaignInput,
} from "@/src/domain";
import { validateMapPlaceDraft, type CreateMapPlaceApplicationInput, type MapPlaceApplication, type MapPlaceApplicationRepository, type MapPlaceReviewDecision, type UpdateMapPlaceApplicationInput, type MapPlaceChangeRequest, type MapPlaceChangeRequestRepository } from "@/src/domain/service-places";
import type { AdoptionApplicationDto, AdoptionListingDto, AdoptionListingMutationResponseDto } from "@/src/contracts/backend/adoption";
import type { DonationCampaignDto, DonationTransferDto } from "@/src/contracts/backend/donations";
import type { FeedingPointDto } from "@/src/contracts/backend/feedingPoints";
import type { MapEntityDto } from "@/src/contracts/backend/places";
import type { PagedResultDto } from "@/src/contracts/backend/common";
import { apiRequest, ApiError } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { pageItems, withQuery } from "./query";
import { adoptionApplicationDtoToDomain, adoptionListingDtoToDomain, donationCampaignDtoToDomain, donationTransferDtoToDomain } from "./mappers";
import { uploadLocalMediaUris } from "./uploadsApi";
import { resolveMediaUrl } from "./mediaUrl";

const asInt = (value: string | undefined, field: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`يرجى اختيار ${field} من القائمة المعتمدة.`);
  return parsed;
};
const upper = (value?: string | null) => value?.trim().replace(/[-\s]+/g, "_").toUpperCase();

const adoptionAnimalTypeToBackend = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (["cat", "قطة", "قط"].includes(normalized)) return "CAT";
  if (["dog", "كلب"].includes(normalized)) return "DOG";
  if (["bird", "طائر", "عصفور"].includes(normalized)) return "BIRD";
  if (["rabbit", "أرنب", "ارنب"].includes(normalized)) return "RABBIT";
  return "OTHER";
};

const healthFlag = (items: CreateAdoptionListingInput["healthChecklist"], id: string) => !!items.find((x) => x.id === id)?.checked;
const ageMonths = (input: Pick<CreateAdoptionListingInput, "age" | "ageUnit">) => Math.max(0, Math.round(input.ageUnit === "years" ? input.age * 12 : input.age));

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isAdoptionListingDto = (value: unknown): value is AdoptionListingDto => {
  if (!isRecord(value)) return false;
  return (
    (typeof value.id === "number" || typeof value.id === "string") &&
    isRecord(value.animal) &&
    isRecord(value.publisher) &&
    isRecord(value.location) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
};

const adoptionMutationId = (value: unknown): string | undefined => {
  if (!isRecord(value)) return undefined;
  const id = value.id;
  return typeof id === "number" || typeof id === "string" ? String(id) : undefined;
};

const normalizeComparableText = (value: string | null | undefined) => value?.trim().toLocaleLowerCase("ar") ?? "";

const sleep = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function adoptionRequestBody(input: CreateAdoptionListingInput | UpdateAdoptionListingInput) {
  const uploads = await uploadLocalMediaUris(input.images);
  return {
    animalName: input.animalName.trim(),
    animalType: adoptionAnimalTypeToBackend(input.animalType),
    estimatedAgeMonths: ageMonths(input),
    gender: input.gender === "male" ? "MALE" : input.gender === "female" ? "FEMALE" : "UNKNOWN",
    size: upper(input.size),
    weightKg: input.weight ?? null,
    color: input.color.trim(),
    governorateId: asInt(input.location.governorateId, "المحافظة"),
    regionId: asInt(input.location.regionId, "المنطقة"),
    address: input.location.address.trim(),
    latitude: input.location.latitude,
    longitude: input.location.longitude,
    breedId: null,
    healthStatus: upper(input.healthStatus) ?? "UNKNOWN",
    healthCondition: input.healthCondition.trim(),
    isVaccinated: healthFlag(input.healthChecklist, "vaccinated"),
    isFreeOfInfectiousDiseases: healthFlag(input.healthChecklist, "disease-free"),
    isVeterinaryExamined: healthFlag(input.healthChecklist, "examined") || healthFlag(input.healthChecklist, "vet-check"),
    description: input.description.trim(),
    traits: input.traits,
    newMediaUploadIds: uploads.map((x) => x.id),
    mediaUploadIds: uploads.map((x) => x.id),
  };
}

export class ApiAdoptionWriteRepository implements AdoptionRepository {
  async listAvailable() {
    const payload = await apiRequest<PagedResultDto<AdoptionListingDto> | AdoptionListingDto[]>(withQuery(API_ENDPOINTS.adoption.listings, { ModerationStatus: "PUBLISHED", LifecycleStatus: "AVAILABLE", Page: 1, PageSize: 100 }));
    return pageItems(payload)
      .map(adoptionListingDtoToDomain)
      .filter((listing) => listing.moderationStatus === "approved" && listing.status === "available");
  }
  async getById(id: string) {
    try { return adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.byId(id))); }
    catch (error) { if (error instanceof ApiError && error.isNotFound) return undefined; throw error; }
  }
  async listByOwner(_ownerAccountId: string) {
    const payload = await apiRequest<PagedResultDto<AdoptionListingDto> | AdoptionListingDto[]>(withQuery(API_ENDPOINTS.adoption.mine, { Page: 1, PageSize: 100 }));
    return pageItems(payload).map(adoptionListingDtoToDomain);
  }
  async getOwnedById(id: string, _ownerAccountId: string) {
    try { return adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.mineById(id))); }
    catch (error) { if (error instanceof ApiError && error.isNotFound) return undefined; throw error; }
  }
  private async resolveCreatedListing(
    response: AdoptionListingDto | AdoptionListingMutationResponseDto | unknown,
    input: CreateAdoptionListingInput,
  ): Promise<AdoptionListing> {
    // Some backend versions return the complete listing, while the currently
    // deployed create endpoint returns only an acknowledgement message.
    if (isAdoptionListingDto(response)) return adoptionListingDtoToDomain(response);

    // Future/backend-compatible path: if the acknowledgement starts returning
    // an id, prefer the exact resource instead of guessing from the owner's list.
    const responseId = adoptionMutationId(response);
    if (responseId) {
      const exact = await this.getOwnedById(responseId, input.ownerAccountId);
      if (exact) return exact;
    }

    const expectedName = normalizeComparableText(input.animalName);
    const expectedGovernorateId = String(input.location.governorateId);
    const expectedRegionId = String(input.location.regionId);

    // The POST response currently has no listing id. Refetch the authenticated
    // user's listings and select the newest exact form match. A short retry
    // protects against a small persistence/read-after-write delay.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const owned = await this.listByOwner(input.ownerAccountId);
      const match = owned
        .filter((listing) => (
          normalizeComparableText(listing.animalName) === expectedName &&
          String(listing.location.governorateId) === expectedGovernorateId &&
          String(listing.location.regionId) === expectedRegionId
        ))
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))[0];

      if (match) return match;
      if (attempt < 2) await sleep(250 * (attempt + 1));
    }

    throw new ApiError(
      "تم إرسال إعلان التبني، لكن تعذر تحميل الإعلان الذي تم إنشاؤه. افتح قائمة إعلاناتي وحاول التحديث.",
      502,
    );
  }

  async submit(input: CreateAdoptionListingInput) {
    const body = await adoptionRequestBody(input);
    const response = await apiRequest<AdoptionListingDto | AdoptionListingMutationResponseDto>(
      API_ENDPOINTS.adoption.listings,
      {
        method: "POST",
        body: JSON.stringify({
          ...body,
          mediaUploadIds: body.mediaUploadIds,
          submitForReview: true,
          newMediaUploadIds: undefined,
        }),
      },
    );

    return this.resolveCreatedListing(response, input);
  }

  async updateAndResubmit(id: string, _ownerAccountId: string, input: UpdateAdoptionListingInput) {
    const current = await this.getOwnedById(id, _ownerAccountId);
    const body = await adoptionRequestBody(input);
    const retainMediaIds = current
      ? current.images
          .map((uri, index) => input.images.includes(uri) ? Number(current.mediaIds?.[index]) : Number.NaN)
          .filter((mediaId) => Number.isFinite(mediaId) && mediaId > 0)
      : [];

    const response = await apiRequest<AdoptionListingDto | AdoptionListingMutationResponseDto>(
      API_ENDPOINTS.adoption.byId(id),
      {
        method: "PUT",
        body: JSON.stringify({
          ...body,
          retainMediaIds,
          newMediaUploadIds: body.newMediaUploadIds,
          mediaUploadIds: undefined,
          submitForReview: true,
        }),
      },
    );

    if (isAdoptionListingDto(response)) return adoptionListingDtoToDomain(response);

    // The update endpoint may also acknowledge with a message-only payload.
    // Refetch the exact listing so the screen always receives a real domain object.
    const refreshed = await this.getOwnedById(id, _ownerAccountId);
    if (refreshed) return refreshed;

    throw new ApiError(
      "تم تحديث إعلان التبني، لكن تعذر إعادة تحميل بياناته. حاول فتح الإعلان من قائمة إعلاناتي.",
      502,
    );
  }
  async closeOwned(id: string, _ownerAccountId: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.close(id), { method: "POST", body: JSON.stringify({ note: null }) });
    return (await this.getOwnedById(id, _ownerAccountId))!;
  }
  async reserveOwned(id: string, _ownerAccountId: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.reserve(id), { method: "POST", body: JSON.stringify({ note: null }) });
    return (await this.getOwnedById(id, _ownerAccountId))!;
  }
  async markAdoptedOwned(id: string, _ownerAccountId: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.markAdopted(id), { method: "POST", body: JSON.stringify({ note: null }) });
    return (await this.getOwnedById(id, _ownerAccountId))!;
  }
  async review(_id: string, _input: import("@/src/domain").ModerationDecisionInput): Promise<AdoptionListing> { throw new ApiError("مراجعة عروض التبني متاحة للإدارة فقط.", 403); }
}

export class ApiAdoptionApplicationRepository implements AdoptionApplicationRepository {
  private async ownerId(listingId: string) {
    const listing = adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.byId(listingId)));
    return listing.ownerAccountId;
  }
  async submit(input: CreateAdoptionApplicationInput) {
    const dto = await apiRequest<AdoptionApplicationDto>(API_ENDPOINTS.adoption.applications, { method: "POST", body: JSON.stringify({ listingId: asInt(input.listingId, "عرض التبني"), reason: input.reason.trim(), additionalNotes: input.notes?.trim() || null, hasPets: input.hasOtherPets, hasOutdoorSpace: input.hasOutdoorSpace, houseType: upper(input.housing), experienceLevel: upper(input.experience) }) });
    return adoptionApplicationDtoToDomain(dto, await this.ownerId(input.listingId));
  }
  async listByApplicant(_applicantAccountId: string) {
    const payload = await apiRequest<PagedResultDto<AdoptionApplicationDto> | AdoptionApplicationDto[]>(withQuery(API_ENDPOINTS.adoption.myApplications, { Page: 1, PageSize: 100 }));
    const items = pageItems(payload);
    return Promise.all(items.map(async (dto) => adoptionApplicationDtoToDomain(dto, await this.ownerId(String(dto.listingId)))));
  }
  async getByApplicant(id: string, _applicantAccountId: string) {
    try { const dto = await apiRequest<AdoptionApplicationDto>(API_ENDPOINTS.adoption.myApplicationById(id)); return adoptionApplicationDtoToDomain(dto, await this.ownerId(String(dto.listingId))); }
    catch (error) { if (error instanceof ApiError && error.isNotFound) return undefined; throw error; }
  }
  async listByListing(listingId: string, _listingOwnerAccountId: string) {
    const payload = await apiRequest<PagedResultDto<AdoptionApplicationDto> | AdoptionApplicationDto[]>(withQuery(API_ENDPOINTS.adoption.listingApplications(listingId), { Page: 1, PageSize: 100 }));
    return pageItems(payload).map((dto) => adoptionApplicationDtoToDomain(dto, _listingOwnerAccountId));
  }
  async getForListingOwner(id: string, listingId: string, listingOwnerAccountId: string) {
    try { return adoptionApplicationDtoToDomain(await apiRequest<AdoptionApplicationDto>(API_ENDPOINTS.adoption.listingApplicationById(listingId, id)), listingOwnerAccountId); }
    catch (error) { if (error instanceof ApiError && error.isNotFound) return undefined; throw error; }
  }
  async acceptForListingOwner(id: string, listingId: string, owner: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.acceptApplication(listingId, id), { method: "POST", body: JSON.stringify({ responseMessage: null }) });
    return (await this.getForListingOwner(id, listingId, owner))!;
  }
  async rejectForListingOwner(id: string, listingId: string, owner: string, decisionNote?: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.rejectApplication(listingId, id), { method: "POST", body: JSON.stringify({ responseMessage: decisionNote?.trim() || null }) });
    return (await this.getForListingOwner(id, listingId, owner))!;
  }
  async confirmHandoverForApplicant(id: string, applicant: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.confirmApplicantHandover(id), { method: "POST" });
    return (await this.getByApplicant(id, applicant))!;
  }
  async confirmHandoverForListingOwner(id: string, listingId: string, owner: string) {
    await apiRequest<void>(API_ENDPOINTS.adoption.confirmOwnerHandover(listingId, id), { method: "POST" });
    return (await this.getForListingOwner(id, listingId, owner))!;
  }
  async getAcceptedContactForApplicant(id: string, applicant: string): Promise<AdoptionContactAccess | undefined> {
    const app = await this.getByApplicant(id, applicant);
    if (!app || !["accepted", "completed"].includes(app.status)) return undefined;
    const listing = adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.byId(app.listingId)));
    return { applicationId: app.id, listingId: app.listingId, applicantAccountId: app.applicantAccountId, listingOwnerAccountId: app.listingOwnerAccountId, contact: listing.contact, location: listing.location };
  }
}

function feedingDtoToSubmission(dto: FeedingPointDto, ownerAccountId = ""): FeedingPointSubmission {
  const image = resolveMediaUrl(dto.media?.find((m) => !m.type || m.type === "IMAGE")?.url);
  return { id: String(dto.id), ownerAccountId, ownerAccountKind: "user", name: dto.name ?? "نقطة إطعام", address: dto.address ?? "", governorateId: String(dto.governorateId), governorateName: dto.governorateName ?? undefined, regionId: String(dto.regionId), regionName: dto.regionName ?? undefined, latitude: dto.latitude, longitude: dto.longitude, description: dto.note ?? undefined, photoUri: image, facilities: dto.waterAvailable ? ["water"] : [], initialStatus: dto.foodLevel === "EMPTY" || dto.foodLevel === "LOW" ? "needsFood" : "stocked", foodLevel: (dto.foodLevel as FeedingPointSubmission["foodLevel"]) ?? undefined, waterAvailable: dto.waterAvailable, condition: (dto.condition as FeedingPointSubmission["condition"]) ?? undefined, note: dto.note ?? undefined, createdAt: dto.createdAt, updatedAt: dto.updatedAt, moderationStatus: dto.status === "PENDING" ? "pending_review" : dto.status === "REJECTED" ? "rejected" : dto.status === "ACTIVE" ? "approved" : "archived", rejectionReason: dto.rejectionReason ?? undefined, publishedFeedingPointId: dto.status === "ACTIVE" ? String(dto.id) : undefined };
}

export class ApiFeedingPointSubmissionRepository implements FeedingPointSubmissionRepository {
  async submit(input: CreateFeedingPointSubmissionInput) {
    const uploads = await uploadLocalMediaUris([input.photoUri]);
    const dto = await apiRequest<FeedingPointDto>(API_ENDPOINTS.feedingPoints.submissions, { method: "POST", body: JSON.stringify({ name: input.name.trim(), address: input.address.trim(), governorateId: asInt(input.governorateId, "المحافظة"), regionId: asInt(input.regionId, "المنطقة"), latitude: input.latitude, longitude: input.longitude, note: [input.description, input.note].filter(Boolean).join("\n").trim() || null, mediaUploadIds: uploads.map((x) => x.id) }) });
    return feedingDtoToSubmission(dto, input.ownerAccountId);
  }
  async listByOwner(ownerAccountId: string) {
    const payload = await apiRequest<PagedResultDto<FeedingPointDto> | FeedingPointDto[]>(withQuery(API_ENDPOINTS.feedingPoints.mySubmissions, { Page: 1, PageSize: 100 }));
    return pageItems(payload).map((dto) => feedingDtoToSubmission(dto, ownerAccountId));
  }
  async getOwnedById(id: string, ownerAccountId: string) {
    const items = await this.listByOwner(ownerAccountId);
    return items.find((x) => x.id === id);
  }
  async listPendingReview(): Promise<FeedingPointSubmission[]> { throw new ApiError("مراجعة نقاط الإطعام متاحة للإدارة فقط.", 403); }
  async getForReview(): Promise<FeedingPointSubmission | undefined> { throw new ApiError("مراجعة نقاط الإطعام متاحة للإدارة فقط.", 403); }
  async review(): Promise<FeedingPointSubmission> { throw new ApiError("مراجعة نقاط الإطعام متاحة للإدارة فقط.", 403); }
}

type PlaceRequestDto = {
  id: number; requesterAccountId: string; type?: string | null; name?: string | null; description?: string | null;
  licenseNumber?: string | null; supportingMediaUrl?: string | null;
  governorateId: number; governorateName?: string | null; regionId: number; regionName?: string | null;
  address?: string | null; latitude: number; longitude: number; phone?: string | null; email?: string | null;
  website?: string | null; openingTime?: string | null; closingTime?: string | null; status?: string | null;
  rejectionReason?: string | null; createdAt: string; reviewedAt?: string | null;
};
const placeTypeToBackend: Record<string,string> = { clinic:"VET_CLINIC", shelter:"SHELTER", pet_store:"PET_SUPPLIES", animal_pharmacy:"ANIMAL_PHARMACY", pet_hotel:"PET_HOTEL", cat_cafe:"CAT_CAFE", grooming:"GROOMING", other:"OTHER", feeding_point:"OTHER" };
const placeTypeFromBackend: Record<string,MapPlaceApplication["requestedType"]> = { VET_CLINIC:"clinic", SHELTER:"shelter", PET_SUPPLIES:"pet_store", ANIMAL_PHARMACY:"animal_pharmacy", PET_HOTEL:"pet_hotel", CAT_CAFE:"cat_cafe", GROOMING:"grooming", OTHER:"other" };
const MAP_PLACE_DRAFTS_KEY = "@resq/map-place-application-drafts/v2";

function placeRequestToDomain(dto: PlaceRequestDto, approvedPlaceId?: string): MapPlaceApplication {
  const normalizedStatus = upper(dto.status) ?? "PENDING";
  const status: MapPlaceApplication["status"] = normalizedStatus === "ACTIVE" ? "approved" : normalizedStatus === "REJECTED" ? "rejected" : normalizedStatus === "INACTIVE" ? "cancelled" : "pending";
  return {
    id:String(dto.id), applicantUserId:dto.requesterAccountId,
    requestedType:placeTypeFromBackend[upper(dto.type) ?? "OTHER"] ?? "other",
    name:dto.name ?? "مكان", description:dto.description ?? undefined,
    governorateId:String(dto.governorateId), governorateName:dto.governorateName ?? undefined,
    regionId:String(dto.regionId), regionName:dto.regionName ?? undefined,
    address:dto.address ?? "", latitude:dto.latitude, longitude:dto.longitude, phone:dto.phone ?? "",
    website:dto.website ?? undefined,
    licenseNumber:dto.licenseNumber ?? undefined, supportingDocumentUri:resolveMediaUrl(dto.supportingMediaUrl) || undefined,
    openingHours:dto.openingTime && dto.closingTime ? ([0,1,2,3,4,5,6] as const).map(day=>({day,open:dto.openingTime!,close:dto.closingTime!})) : undefined,
    status, rejectionReason:dto.rejectionReason ?? undefined, approvedPlaceId, createdAt:dto.createdAt,
    updatedAt:dto.reviewedAt ?? dto.createdAt, submittedAt:dto.createdAt, reviewedAt:dto.reviewedAt ?? undefined,
  };
}
function cloneMapPlaceApplication(item: MapPlaceApplication): MapPlaceApplication { return { ...item, openingHours:item.openingHours?.map(day=>({...day})) }; }
async function readMapPlaceDrafts(): Promise<MapPlaceApplication[]> {
  try {
    const raw=await AsyncStorage.getItem(MAP_PLACE_DRAFTS_KEY); if(!raw)return [];
    const parsed: unknown=JSON.parse(raw); if(!Array.isArray(parsed))return [];
    return parsed.filter((item): item is MapPlaceApplication=>Boolean(item&&typeof item==="object"&&(item as MapPlaceApplication).status==="draft"&&typeof (item as MapPlaceApplication).id==="string")).map(cloneMapPlaceApplication);
  } catch { return []; }
}
async function writeMapPlaceDrafts(items: MapPlaceApplication[]) { await AsyncStorage.setItem(MAP_PLACE_DRAFTS_KEY,JSON.stringify(items.filter(item=>item.status==="draft"))); }
async function upsertMapPlaceDraft(item: MapPlaceApplication) { const drafts=await readMapPlaceDrafts(); await writeMapPlaceDrafts([cloneMapPlaceApplication(item),...drafts.filter(entry=>entry.id!==item.id)]); }
async function removeMapPlaceDraft(id: string) { const drafts=await readMapPlaceDrafts(); await writeMapPlaceDrafts(drafts.filter(entry=>entry.id!==id)); }
async function mapPlaceRequestBody(local: MapPlaceApplication) {
  const hours=local.openingHours?.find(item=>item.open&&item.close);
  const evidence = local.supportingDocumentUri && !/^https?:\/\//i.test(local.supportingDocumentUri) ? (await uploadLocalMediaUris([local.supportingDocumentUri]))[0] : undefined;
  return {
    type:placeTypeToBackend[local.requestedType]??"OTHER", name:local.name.trim(), description:local.description?.trim()||null,
    governorateId:asInt(local.governorateId,"المحافظة"), regionId:asInt(local.regionId,"المنطقة"),
    address:local.address.trim(), latitude:local.latitude, longitude:local.longitude, phone:local.phone.trim()||null,
    email:null, website:local.website?.trim()||null, openingTime:hours?.open??null, closingTime:hours?.close??null,
    licenseNumber:local.licenseNumber?.trim()||null, supportingMediaId:evidence?.id ?? null,
  };
}

export class ApiMapPlaceApplicationRepository implements MapPlaceApplicationRepository {
  async createDraft(input: CreateMapPlaceApplicationInput) {
    const now=new Date().toISOString();
    const draft: MapPlaceApplication={...input,id:`draft-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,status:"draft",createdAt:now,updatedAt:now};
    await upsertMapPlaceDraft(draft); return cloneMapPlaceApplication(draft);
  }
  async updateOwnedDraft(id:string,userId:string,input:UpdateMapPlaceApplicationInput) {
    if(id.startsWith("draft-")){
      const current=(await readMapPlaceDrafts()).find(item=>item.id===id);
      if(!current||current.applicantUserId!==userId)throw new ApiError("تعذر العثور على مسودة المكان أو لا تملك صلاحية تعديلها.",404);
      const next:MapPlaceApplication={...current,...input,status:"draft",rejectionReason:undefined,reviewedAt:undefined,reviewedBy:undefined,updatedAt:new Date().toISOString()};
      await upsertMapPlaceDraft(next); return cloneMapPlaceApplication(next);
    }
    const current=await this.getById(id);
    if(!current||current.applicantUserId!==userId)throw new ApiError("تعذر العثور على طلب المكان أو لا تملك صلاحية تعديله.",404);
    if(current.status!=="rejected")throw new ApiError("يمكن تعديل طلب المكان فقط بعد رفضه وقبل إعادة إرساله.",409);
    const next:MapPlaceApplication={...current,...input,status:"rejected",updatedAt:new Date().toISOString()};
    const validationError=validateMapPlaceDraft(next,{forSubmission:true}); if(validationError)throw new ApiError(validationError,422);
    return placeRequestToDomain(await apiRequest<PlaceRequestDto>(API_ENDPOINTS.map.requestById(id),{method:"PUT",body:JSON.stringify(await mapPlaceRequestBody(next))}));
  }
  async submit(id:string,userId:string) {
    if(id.startsWith("draft-")){
      const local=(await readMapPlaceDrafts()).find(item=>item.id===id);
      if(!local||local.applicantUserId!==userId)throw new ApiError("تعذر العثور على مسودة المكان أو لا تملك صلاحية إرسالها.",404);
      const validationError=validateMapPlaceDraft(local,{forSubmission:true}); if(validationError)throw new ApiError(validationError,422);
      const dto=await apiRequest<PlaceRequestDto>(API_ENDPOINTS.map.requests,{method:"POST",body:JSON.stringify(await mapPlaceRequestBody(local))});
      await removeMapPlaceDraft(id); return placeRequestToDomain(dto);
    }
    const current=await this.getById(id);
    if(!current||current.applicantUserId!==userId)throw new ApiError("تعذر العثور على طلب المكان أو لا تملك صلاحية إرساله.",404);
    if(current.status!=="rejected")throw new ApiError("يمكن إعادة إرسال الطلبات المرفوضة فقط.",409);
    return placeRequestToDomain(await apiRequest<PlaceRequestDto>(API_ENDPOINTS.map.resubmitRequest(id),{method:"POST"}));
  }
  async listForUser(userId:string) {
    const [payload,drafts,ownedPlaces]=await Promise.all([
      apiRequest<PlaceRequestDto[]|PagedResultDto<PlaceRequestDto>>(API_ENDPOINTS.map.myRequests),
      readMapPlaceDrafts(),
      apiRequest<MapEntityDto[]>(API_ENDPOINTS.map.myEntities).catch(()=>[] as MapEntityDto[]),
    ]);
    const approvedByRequest=new Map(ownedPlaces.filter(place=>place.sourceType==="USER_REQUEST"&&place.sourceEntityId!=null).map(place=>[String(place.sourceEntityId),String(place.id)]));
    const remote=pageItems(payload).map(dto=>placeRequestToDomain(dto,approvedByRequest.get(String(dto.id))));
    return [...drafts.filter(item=>item.applicantUserId===userId).map(cloneMapPlaceApplication),...remote].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  }
  async getById(id:string) {
    if(id.startsWith("draft-")){const local=(await readMapPlaceDrafts()).find(item=>item.id===id);return local?cloneMapPlaceApplication(local):null;}
    const [payload,ownedPlaces]=await Promise.all([
      apiRequest<PlaceRequestDto[]|PagedResultDto<PlaceRequestDto>>(API_ENDPOINTS.map.myRequests),
      apiRequest<MapEntityDto[]>(API_ENDPOINTS.map.myEntities).catch(()=>[] as MapEntityDto[]),
    ]);
    const owned=ownedPlaces.find(place=>String(place.sourceEntityId)===id&&place.sourceType==="USER_REQUEST");
    const dto=pageItems(payload).find(item=>String(item.id)===id);
    return dto?placeRequestToDomain(dto,owned?String(owned.id):undefined):null;
  }
  async cancel(id:string,userId:string) {
    if(id.startsWith("draft-")){
      const local=(await readMapPlaceDrafts()).find(item=>item.id===id);
      if(!local||local.applicantUserId!==userId)throw new ApiError("تعذر العثور على مسودة المكان أو لا تملك صلاحية إلغائها.",404);
      await removeMapPlaceDraft(id); return { ...local, status: "cancelled" as const, updatedAt: new Date().toISOString() };
    }
    const current=await this.getById(id);
    if(!current||current.applicantUserId!==userId)throw new ApiError("تعذر العثور على طلب المكان أو لا تملك صلاحية إلغائه.",404);
    if(!["pending","rejected"].includes(current.status))throw new ApiError("لا يمكن إلغاء هذا الطلب في حالته الحالية.",409);
    return placeRequestToDomain(await apiRequest<PlaceRequestDto>(API_ENDPOINTS.map.cancelRequest(id),{method:"POST"}));
  }
  async listPendingReview(): Promise<MapPlaceApplication[]> { throw new ApiError("مراجعة طلبات الخريطة متاحة في لوحة الإدارة فقط.",403); }
  async getForReview(): Promise<MapPlaceApplication|null> { throw new ApiError("مراجعة طلبات الخريطة متاحة في لوحة الإدارة فقط.",403); }
  async review(_id:string,_decision:MapPlaceReviewDecision): Promise<MapPlaceApplication> { throw new ApiError("مراجعة طلبات الخريطة متاحة في لوحة الإدارة فقط.",403); }
}

async function campaignBody(input: CreateDonationCampaignInput | UpdateDonationCampaignInput) {
  const media = [input.coverImageUrl, ...(input.images ?? [])].filter(Boolean);
  const uploads = await uploadLocalMediaUris([...new Set(media)]);
  return {
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    category: upper(input.category),
    urgent: input.urgent,
    targetAmountMinor: Math.round(input.targetAmount),
    currency: "SYP",
    beneficiaryOrganizationId: null,
    startAt: input.startsAt ?? null,
    endAt: input.endsAt ?? null,
    newMediaUploadIds: uploads.map((item) => item.id),
  };
}
export class ApiDonationCampaignWriteRepository implements DonationCampaignRepository {
  async listPublic(){ const payload=await apiRequest<PagedResultDto<DonationCampaignDto>|DonationCampaignDto[]>(withQuery(API_ENDPOINTS.donations.campaigns,{Page:1,PageSize:100})); return pageItems(payload).map(donationCampaignDtoToDomain); }
  async getPublicById(id:string){ try{return donationCampaignDtoToDomain(await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.byId(id)));}catch(error){if(error instanceof ApiError&&error.isNotFound)return undefined;throw error;} }
  async listByOwner(_ownerAccountId:string){ const payload=await apiRequest<PagedResultDto<DonationCampaignDto>|DonationCampaignDto[]>(withQuery(API_ENDPOINTS.donations.mine,{Page:1,PageSize:100})); return pageItems(payload).map(donationCampaignDtoToDomain); }
  async getOwnedById(id:string,owner:string){ const all=await this.listByOwner(owner); return all.find((x)=>x.id===id); }
  async createDraft(input:CreateDonationCampaignInput){
    const body = await campaignBody(input);
    const dto=await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.campaigns,{method:"POST",body:JSON.stringify({ ...body, mediaUploadIds: body.newMediaUploadIds, newMediaUploadIds: undefined })});
    return donationCampaignDtoToDomain(dto);
  }
  async updateOwned(id:string,owner:string,input:UpdateDonationCampaignInput){
    const current = await this.getOwnedById(id, owner);
    if (!current) throw new ApiError("الحملة غير موجودة أو لا تملك صلاحية تعديلها.", 404);
    const body = await campaignBody(input);
    const selectedRemoteUris = new Set((input.images ?? []).filter((uri) => /^https?:\/\//i.test(uri)));
    const retainMediaIds = current.images
      .map((uri, index) => selectedRemoteUris.has(uri) ? Number(current.mediaIds?.[index]) : Number.NaN)
      .filter((mediaId) => Number.isFinite(mediaId) && mediaId > 0);
    const dto=await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.byId(id),{method:"PUT",body:JSON.stringify({ ...body, retainMediaIds })});
    return donationCampaignDtoToDomain(dto);
  }
  async submitForReview(id:string,owner:string){ await apiRequest<void>(API_ENDPOINTS.donations.submit(id),{method:"POST"}); return (await this.getOwnedById(id,owner))!; }
  async pauseOwned(id: string, _ownerAccountId: string): Promise<DonationCampaign> { return donationCampaignDtoToDomain(await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.pause(id), { method: "POST" })); }
  async resumeOwned(id: string, _ownerAccountId: string): Promise<DonationCampaign> { return donationCampaignDtoToDomain(await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.resume(id), { method: "POST" })); }
  async closeOwned(id: string, _ownerAccountId: string): Promise<DonationCampaign> { return donationCampaignDtoToDomain(await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.close(id), { method: "POST" })); }
  async review(_id: string, _input: import("@/src/domain").CampaignReviewInput): Promise<DonationCampaign> { throw new ApiError("مراجعة الحملات متاحة للإدارة فقط.", 403); }
  async recordVerifiedDonation(_id: string, _amount: number): Promise<DonationCampaign> { throw new ApiError("تسجيل التبرع الموثق عملية داخلية في الخادم.", 403); }
}

export class ApiDonationTransferWriteRepository implements DonationTransferRepository {
  async submit(input:CreateDonationTransferInput){ const dto=await apiRequest<DonationTransferDto>(API_ENDPOINTS.donations.transfers,{method:"POST",body:JSON.stringify({campaignId:asInt(input.campaignId,"الحملة"),transferProviderId:asInt(input.transferProviderId,"شركة الحوالات"),transferNumber:input.transferNumber.trim(),amountMinor:Math.round(input.amountMinor ?? input.amount),currency:"SYP",senderFullName:input.senderFullName.trim(),senderMobile:input.senderMobile.trim(),senderGovernorateId:asInt(input.senderGovernorateId,"محافظة المرسل"),supportMessage:input.supportMessage?.trim()||null,notifyOnStatusChange:input.notifyOnStatusChange ?? true})}); return donationTransferDtoToDomain(dto,dto.campaignTitle ?? ""); }
  async listByDonor(_donor:string){ const payload=await apiRequest<PagedResultDto<DonationTransferDto>|DonationTransferDto[]>(withQuery(API_ENDPOINTS.donations.myTransfers,{page:1,pageSize:100})); return pageItems(payload).map((x)=>donationTransferDtoToDomain(x,x.campaignTitle ?? "")); }
  async getByDonor(id:string,_donor:string){ try{const dto=await apiRequest<DonationTransferDto>(API_ENDPOINTS.donations.transferById(id));return donationTransferDtoToDomain(dto,dto.campaignTitle ?? "");}catch(error){if(error instanceof ApiError&&error.isNotFound)return undefined;throw error;} }
  async getByVerificationCode(code:string){ const items=await this.listByDonor(""); return items.find((x)=>x.verificationCode.toLowerCase()===code.trim().toLowerCase()); }
  async listByCampaignOwner(campaignId:string,_owner:string){ const payload=await apiRequest<PagedResultDto<DonationTransferDto>|DonationTransferDto[]>(withQuery(API_ENDPOINTS.donations.campaignTransfers(campaignId),{page:1,pageSize:100})); return pageItems(payload).map((x)=>donationTransferDtoToDomain(x,x.campaignTitle ?? "")); }
  async markVerifying(): Promise<DonationTransfer> { throw new ApiError("مراجعة الحوالات متاحة للإدارة فقط.", 403); }
  async review(): Promise<DonationTransfer> { throw new ApiError("مراجعة الحوالات متاحة للإدارة فقط.", 403); }
}


/** No fake persistence: these operations remain unavailable until their reviewed backend workflow exists. */
export class ApiMapPlaceChangeRequestRepository implements MapPlaceChangeRequestRepository {
  async create(): Promise<MapPlaceChangeRequest> { throw new ApiError("طلبات تغيير نوع أو موقع الجهة تحتاج مسار مراجعة على الخادم.", 405); }
  async listForUser(): Promise<MapPlaceChangeRequest[]> { return []; }
  async getOwned(): Promise<MapPlaceChangeRequest | null> { return null; }
  async getForReview(): Promise<MapPlaceChangeRequest | null> { throw new ApiError("مراجعة طلبات التعديل متاحة للإدارة فقط.", 403); }
  async review(): Promise<MapPlaceChangeRequest> { throw new ApiError("مراجعة طلبات التعديل متاحة للإدارة فقط.", 403); }
  async cancel(): Promise<MapPlaceChangeRequest> { throw new ApiError("لا يوجد طلب تعديل محفوظ على الخادم لإلغائه.", 405); }
}
