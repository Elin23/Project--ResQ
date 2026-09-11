import { resolveMediaUrl, resolveOptionalMediaUrl } from "./mediaUrl";
import type { PagedResultDto } from "@/src/contracts/backend/common";
import type { AddOrganizationDocumentRequest, OrganizationDetailsDto, OrganizationDocumentDto, OrganizationSummaryDto, UpdateOrganizationProfileRequest } from "@/src/contracts/backend/organizations";
import type { Organization, OrganizationService } from "@/src/features/organizations/types/organization";
import { apiRequest } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { pageItems, withQuery } from "./query";

const serviceLabel: Record<string, OrganizationService> = {
  RESCUE: "إنقاذ",
  SHELTER: "إطعام",
  FOSTER: "تطوع",
  ADOPTION: "تبني",
  AWARENESS: "تطوع",
  TRANSPORT: "إنقاذ",
  FOOD_SUPPORT: "إطعام",
  VETERINARY: "علاج",
  MEDICAL: "علاج",
};

export type OrganizationApiView = Organization & {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: OrganizationDetailsDto["operatingHours"];
  coverUrl?: string;
};

export function organizationDtoToView(dto: OrganizationDetailsDto): OrganizationApiView {
  const services = Array.from(new Set((dto.services ?? []).map((key) => serviceLabel[key]).filter(Boolean))) as OrganizationService[];
  const place = dto.place ?? undefined;
  const fallbackImage = resolveMediaUrl(dto.coverUrl ?? dto.logoUrl);
  return {
    id: String(dto.id), name: dto.name ?? "جمعية", city: place?.regionName ?? place?.governorateName ?? "",
    country: "سوريا", verified: dto.verificationStatus === "VERIFIED" && dto.status === "ACTIVE",
    description: dto.description ?? "", image: { uri: fallbackImage }, logo: dto.logoUrl ? { uri: resolveMediaUrl(dto.logoUrl) } : undefined,
    services,
    phone: dto.phone ?? place?.phone ?? undefined, email: dto.email ?? place?.email ?? undefined, website: dto.website ?? place?.website ?? undefined,
    address: place?.address ?? undefined, latitude: place?.latitude, longitude: place?.longitude, operatingHours: dto.operatingHours ?? [], coverUrl: resolveOptionalMediaUrl(dto.coverUrl),
  };
}

export function organizationSummaryToView(dto: OrganizationSummaryDto): OrganizationApiView {
  const services = Array.from(new Set((dto.services ?? []).map((key) => serviceLabel[key]).filter(Boolean))) as OrganizationService[];
  const logoUrl = resolveOptionalMediaUrl(dto.logoUrl);
  return {
    id: String(dto.id),
    name: dto.name || "جمعية",
    city: dto.regionName ?? dto.governorateName ?? "",
    country: "سوريا",
    verified: dto.verificationStatus === "VERIFIED" && dto.status === "ACTIVE",
    description: dto.description ?? "",
    image: { uri: logoUrl ?? "" },
    logo: logoUrl ? { uri: logoUrl } : undefined,
    services,
    address: dto.address ?? undefined,
    latitude: dto.latitude ?? undefined,
    longitude: dto.longitude ?? undefined,
  };
}

export async function fetchOrganizations(search?: string): Promise<OrganizationApiView[]> {
  const payload = await apiRequest<PagedResultDto<OrganizationSummaryDto> | OrganizationSummaryDto[]>(withQuery(API_ENDPOINTS.organizations.list, { search, page: 1, pageSize: 100 }));
  return pageItems(payload).map(organizationSummaryToView);
}

export async function fetchOrganization(id: string): Promise<OrganizationApiView> {
  return organizationDtoToView(await apiRequest<OrganizationDetailsDto>(API_ENDPOINTS.organizations.byId(id)));
}

function normalizeOrganizationDetails(dto: OrganizationDetailsDto): OrganizationDetailsDto {
  return {
    ...dto,
    logoUrl: resolveOptionalMediaUrl(dto.logoUrl),
    coverUrl: resolveOptionalMediaUrl(dto.coverUrl),
    documents: (dto.documents ?? []).map((document) => ({
      ...document,
      url: resolveMediaUrl(document.url),
    })),
  };
}

export async function fetchMyOrganization(): Promise<OrganizationDetailsDto> {
  return normalizeOrganizationDetails(await apiRequest<OrganizationDetailsDto>(API_ENDPOINTS.organizations.me));
}

export async function updateMyOrganization(input: UpdateOrganizationProfileRequest): Promise<OrganizationDetailsDto> {
  return normalizeOrganizationDetails(await apiRequest<OrganizationDetailsDto>(API_ENDPOINTS.organizations.me, { method: "PUT", body: JSON.stringify(input) }));
}

export async function addMyOrganizationDocument(input: AddOrganizationDocumentRequest): Promise<OrganizationDocumentDto> {
  const document = await apiRequest<OrganizationDocumentDto>(API_ENDPOINTS.organizations.documents, { method: "POST", body: JSON.stringify(input) });
  return { ...document, url: resolveMediaUrl(document.url) };
}
