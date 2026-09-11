import type { PagedResultDto } from "@/src/contracts/backend/common";
import type { ReportDto } from "@/src/contracts/backend/reports";
import type { AdoptionListingDto } from "@/src/contracts/backend/adoption";
import type { DonationCampaignDto } from "@/src/contracts/backend/donations";
import type { ArticleDto, SuccessStoryDto, FaqItemDto } from "@/src/contracts/backend/content";
import type { SponsoredAdvertisementDto } from "@/src/contracts/backend/advertising";
import type { MapEntityDto } from "@/src/contracts/backend/places";
import type {
  AdoptionRepository,
  AdoptionListing,
  CreateAdoptionListingInput,
  UpdateAdoptionListingInput,
  ModerationDecisionInput,
  CreateReportInput,
  Report,
  ReportStatus,
  DonationCampaign,
  CreateDonationCampaignInput,
  UpdateDonationCampaignInput,
  CampaignReviewInput,
  DonationCampaignRepository,
  PublicContent,
  PublicContentKind,
  ReportRepository,
  ServicePlaceQuery,
  ServicePlaceRepository,
  SponsoredAd,
} from "@/src/domain";
import type { FaqItem } from "@/src/domain/content/faq";
import { apiRequest, ApiError } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { pageItems, withQuery } from "./query";
import {
  reportDtoToDomain,
  createReportInputToDto,
  adoptionListingDtoToDomain,
  donationCampaignDtoToDomain,
  articleDtoToPublicContent,
  successStoryDtoToPublicContent,
  sponsoredAdvertisementDtoToDomain,
  mapEntityDtoToServicePlace,
} from "./mappers";
import { uploadLocalMediaUris } from "./uploadsApi";
import type { ApplySensitiveServicePlaceChangesInput, CreateServicePlaceInput, ServicePlaceModerationStatusInput } from "@/src/domain/service-places/servicePlaceRepository";
import type { ServicePlace } from "@/src/domain/service-places/servicePlace";

/**
 * Production repositories intentionally implement their domain contracts directly.
 * They must never inherit from an in-memory repository: doing so silently turns any
 * unimplemented API method into mock behavior and makes runtime state diverge from
 * the backend.
 */
export class ApiReportRepository implements ReportRepository {
  async create(input: CreateReportInput) {
    const localUris = [
      ...new Set(
        [
          ...(input.mediaLocalUris ?? []),
          ...(input.imageUrl && !/^https?:\/\//i.test(input.imageUrl) ? [input.imageUrl] : []),
        ].filter(Boolean),
      ),
    ];
    const uploads = localUris.length ? await uploadLocalMediaUris(localUris) : [];
    const dto = createReportInputToDto({
      ...input,
      mediaUploadIds: uploads.length ? uploads.map((item) => String(item.id)) : input.mediaUploadIds,
    });
    return reportDtoToDomain(
      await apiRequest<ReportDto>(API_ENDPOINTS.reports.create, {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    );
  }

  async list() {
    const payload = await apiRequest<PagedResultDto<ReportDto> | ReportDto[]>(
      withQuery(API_ENDPOINTS.reports.list, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(reportDtoToDomain);
  }

  async listByUser(_userId: string) {
    const payload = await apiRequest<PagedResultDto<ReportDto> | ReportDto[]>(
      withQuery(API_ENDPOINTS.reports.mine, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(reportDtoToDomain);
  }

  async listForOrganization(organizationId: string) {
    const numericId = Number(organizationId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new ApiError("تعذر تحديد الجمعية الحالية. سجّل الخروج ثم ادخل إلى حساب الجمعية مرة أخرى.", 422);
    }
    const payload = await apiRequest<PagedResultDto<ReportDto> | ReportDto[]>(
      withQuery(API_ENDPOINTS.reports.list, {
        AssignedOrganizationId: numericId,
        Page: 1,
        PageSize: 100,
      }),
    );
    return pageItems(payload).map(reportDtoToDomain);
  }

  async getById(id: string) {
    try {
      return reportDtoToDomain(await apiRequest<ReportDto>(API_ENDPOINTS.reports.byId(id)));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return undefined;
      throw error;
    }
  }

  async updateStatus(_id: string, _status: ReportStatus): Promise<Report> {
    throw new ApiError("تغيير حالة البلاغ يتم من مسار الإنقاذ/لوحة الإدارة وليس من حساب المستخدم.", 403);
  }

  async assignToOrganization(_id: string, _organizationId: string): Promise<Report> {
    throw new ApiError("إسناد البلاغ إلى جمعية متاح للإدارة فقط.", 403);
  }
}

export class ApiAdoptionRepository implements AdoptionRepository {
  async listAvailable() {
    const payload = await apiRequest<PagedResultDto<AdoptionListingDto> | AdoptionListingDto[]>(
      withQuery(API_ENDPOINTS.adoption.listings, {
        ModerationStatus: "PUBLISHED",
        LifecycleStatus: "AVAILABLE",
        Page: 1,
        PageSize: 100,
      }),
    );
    return pageItems(payload)
      .map(adoptionListingDtoToDomain)
      .filter((listing) => listing.moderationStatus === "approved" && listing.status === "available");
  }

  async getById(id: string) {
    try {
      return adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.byId(id)));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return undefined;
      throw error;
    }
  }

  async listByOwner(_ownerAccountId: string) {
    const payload = await apiRequest<PagedResultDto<AdoptionListingDto> | AdoptionListingDto[]>(
      withQuery(API_ENDPOINTS.adoption.mine, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(adoptionListingDtoToDomain);
  }

  async getOwnedById(id: string, _ownerAccountId: string) {
    try {
      return adoptionListingDtoToDomain(await apiRequest<AdoptionListingDto>(API_ENDPOINTS.adoption.mineById(id)));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return undefined;
      throw error;
    }
  }

  async submit(_input: CreateAdoptionListingInput): Promise<AdoptionListing> { throw new ApiError("استخدم مستودع الكتابة لإنشاء عرض تبنٍ.", 405); }
  async updateAndResubmit(_id: string, _ownerAccountId: string, _input: UpdateAdoptionListingInput): Promise<AdoptionListing> { throw new ApiError("استخدم مستودع الكتابة لتعديل عرض التبني.", 405); }
  async closeOwned(_id: string, _ownerAccountId: string): Promise<AdoptionListing> { throw new ApiError("استخدم مستودع الكتابة لإغلاق عرض التبني.", 405); }
  async reserveOwned(_id: string, _ownerAccountId: string): Promise<AdoptionListing> { throw new ApiError("استخدم مستودع الكتابة لحجز عرض التبني.", 405); }
  async markAdoptedOwned(_id: string, _ownerAccountId: string): Promise<AdoptionListing> { throw new ApiError("استخدم مستودع الكتابة لإتمام التبني.", 405); }
  async review(_id: string, _input: ModerationDecisionInput): Promise<AdoptionListing> { throw new ApiError("مراجعة عروض التبني متاحة للإدارة فقط.", 403); }
}

export class ApiDonationCampaignRepository implements DonationCampaignRepository {
  async listPublic() {
    const payload = await apiRequest<PagedResultDto<DonationCampaignDto> | DonationCampaignDto[]>(
      withQuery(API_ENDPOINTS.donations.campaigns, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(donationCampaignDtoToDomain);
  }

  async getPublicById(id: string) {
    try {
      return donationCampaignDtoToDomain(await apiRequest<DonationCampaignDto>(API_ENDPOINTS.donations.byId(id)));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return undefined;
      throw error;
    }
  }

  async listByOwner(_ownerAccountId: string) {
    const payload = await apiRequest<PagedResultDto<DonationCampaignDto> | DonationCampaignDto[]>(
      withQuery(API_ENDPOINTS.donations.mine, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(donationCampaignDtoToDomain);
  }

  async getOwnedById(id: string, ownerAccountId: string) {
    const items = await this.listByOwner(ownerAccountId);
    return items.find((item) => item.id === id);
  }

  async createDraft(_input: CreateDonationCampaignInput): Promise<DonationCampaign> { throw new ApiError("استخدم مستودع الكتابة لإنشاء حملة.", 405); }
  async updateOwned(_id: string, _ownerAccountId: string, _input: UpdateDonationCampaignInput): Promise<DonationCampaign> { throw new ApiError("استخدم مستودع الكتابة لتعديل الحملة.", 405); }
  async submitForReview(_id: string, _ownerAccountId: string): Promise<DonationCampaign> { throw new ApiError("استخدم مستودع الكتابة لإرسال الحملة للمراجعة.", 405); }
  async review(_id: string, _input: CampaignReviewInput): Promise<DonationCampaign> { throw new ApiError("مراجعة الحملات متاحة للإدارة فقط.", 403); }
  async pauseOwned(_id: string, _ownerAccountId: string): Promise<DonationCampaign> { throw new ApiError("إيقاف الحملة غير متاح من هذا المستودع.", 405); }
  async resumeOwned(_id: string, _ownerAccountId: string): Promise<DonationCampaign> { throw new ApiError("استئناف الحملة غير متاح من هذا المستودع.", 405); }
  async closeOwned(_id: string, _ownerAccountId: string): Promise<DonationCampaign> { throw new ApiError("إغلاق الحملة غير متاح من هذا المستودع.", 405); }
  async recordVerifiedDonation(_id: string, _amount: number): Promise<DonationCampaign> { throw new ApiError("تسجيل التبرعات الموثقة عملية خادمية داخلية.", 403); }
}

export class ApiServicePlaceRepository implements ServicePlaceRepository {
  async list(query: ServicePlaceQuery = {}) {
    const backendType: Record<string, string> = {
      clinic: "VET_CLINIC",
      organization: "ORGANIZATION",
      shelter: "SHELTER",
      pet_store: "PET_SUPPLIES",
      animal_pharmacy: "ANIMAL_PHARMACY",
      pet_hotel: "PET_HOTEL",
      cat_cafe: "CAT_CAFE",
      grooming: "GROOMING",
      feeding_point: "FEEDING_POINT",
      other: "OTHER",
    };
    const payload = await apiRequest<PagedResultDto<MapEntityDto> | MapEntityDto[]>(
      withQuery(API_ENDPOINTS.map.entities, {
        Search: query.search,
        Type: query.type ? backendType[query.type] : undefined,
        Page: 1,
        PageSize: 100,
      }),
    );
    return pageItems(payload).map(mapEntityDtoToServicePlace);
  }

  async getById(id: string) {
    const items = await this.list();
    return items.find((item) => item.id === id) ?? null;
  }

  async getForModeration(id: string) { return this.getById(id); }

  async listOwnedByUser(userId: string) {
    const payload = await apiRequest<MapEntityDto[]>(API_ENDPOINTS.map.myEntities);
    return payload.map((dto) => ({ ...mapEntityDtoToServicePlace(dto), ownerUserId: userId }));
  }

  async getOwnedByUser(placeId: string, userId: string) {
    try {
      const dto = await apiRequest<MapEntityDto>(API_ENDPOINTS.map.myEntityById(placeId));
      return { ...mapEntityDtoToServicePlace(dto), ownerUserId: userId };
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return null;
      throw error;
    }
  }

  async create(_input: CreateServicePlaceInput): Promise<ServicePlace> {
    throw new ApiError("إضافة جهة إلى الخريطة تتم عبر طلب إضافة الجهة، وليست كإضافة مباشرة.", 405);
  }
  async remove(_id: string): Promise<void> { throw new ApiError("حذف الجهة مباشرة غير متاح من واجهة الخادم الحالية.", 405); }
  async updateOwnedByUser(placeId: string, userId: string, input: import("@/src/domain").UpdateOwnedServicePlaceInput) {
    const firstOpen = input.openingHours.find((item) => item.open && item.close);
    const dto = await apiRequest<MapEntityDto>(API_ENDPOINTS.map.myEntityById(placeId), {
      method: "PUT",
      body: JSON.stringify({
        name: input.name.trim(),
        description: input.description?.trim() || null,
        phone: input.phone.trim() || null,
        email: null,
        website: input.website?.trim() || null,
        openingTime: firstOpen?.open ?? null,
        closingTime: firstOpen?.close ?? null,
      }),
    });
    return { ...mapEntityDtoToServicePlace(dto), ownerUserId: userId };
  }
  async setModerationStatus(_placeId: string, _input: ServicePlaceModerationStatusInput): Promise<ServicePlace> { throw new ApiError("مراجعة الجهات متاحة للإدارة فقط.", 403); }
  async applySensitiveChanges(_placeId: string, _input: ApplySensitiveServicePlaceChangesInput): Promise<ServicePlace> { throw new ApiError("تعديل النوع أو الموقع يحتاج مراجعة إدارية.", 405); }
}

export class ApiPublicContentRepository {
  async list(kind: PublicContentKind): Promise<PublicContent[]> {
    const path = kind === "article" ? API_ENDPOINTS.content.articles : API_ENDPOINTS.content.successStories;
    if (kind === "article") {
      const payload = await apiRequest<PagedResultDto<ArticleDto> | ArticleDto[]>(
        withQuery(path, { Status: "PUBLISHED", Page: 1, PageSize: 100 }),
      );
      return pageItems(payload).map(articleDtoToPublicContent);
    }
    const payload = await apiRequest<PagedResultDto<SuccessStoryDto> | SuccessStoryDto[]>(
      withQuery(path, { Status: "PUBLISHED", Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map(successStoryDtoToPublicContent);
  }

  async getById(kind: PublicContentKind, id: string): Promise<PublicContent | null> {
    const path = kind === "article"
      ? API_ENDPOINTS.content.articleById(id)
      : API_ENDPOINTS.content.successStoryById(id);
    try {
      if (kind === "article") return articleDtoToPublicContent(await apiRequest<ArticleDto>(path));
      return successStoryDtoToPublicContent(await apiRequest<SuccessStoryDto>(path));
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return null;
      throw error;
    }
  }
}

export class ApiSponsoredAdRepository {
  async listActive(_now?: string, placement?: SponsoredAd["placement"]): Promise<SponsoredAd[]> {
    const payload = await apiRequest<SponsoredAdvertisementDto[]>(
      withQuery("/api/advertisements", { placement }),
    );
    return (payload ?? []).map(sponsoredAdvertisementDtoToDomain).filter((item) => item.active);
  }
}

export class ApiFaqRepository {
  async list(): Promise<FaqItem[]> {
    const payload = await apiRequest<FaqItemDto[]>(API_ENDPOINTS.content.faq);
    return (payload ?? [])
      .filter((item) => item.active !== false)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        id: String(item.id),
        question: item.question ?? "",
        answer: item.answer ?? "",
        category: item.category ?? "GENERAL",
        order: item.order,
      }));
  }
}
