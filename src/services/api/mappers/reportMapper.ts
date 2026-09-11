import { resolveMediaUrl } from "../mediaUrl";
import type { CreateReportInput, Report, ReportStatus } from "@/src/domain";
import type { CreateReportRequestDto, ReportDto } from "@/src/contracts/backend/reports";

const toUiStatus = (status?: string | null): ReportStatus => {
  switch (status) {
    case "EN_ROUTE": return "assigned";
    case "RECEIVED": return "approved";
    case "CLOSED": return "closed";
    default: return "pending";
  }
};

export function reportDtoToDomain(dto: ReportDto): Report {
  const media = dto.media ?? [];
  const primaryImage = resolveMediaUrl(media.find((item) => item.type === "IMAGE")?.url);
  const animal = (dto.animalType ?? "OTHER").toLowerCase();
  return {
    id: String(dto.id), code: dto.code ?? `RP-${dto.id}`, title: dto.title ?? "بلاغ حيوان",
    description: dto.description ?? "", subtitle: dto.animalDescription ?? dto.description ?? "",
    animalType: (["dog","cat","bird","rabbit","other"].includes(animal) ? animal : "other") as Report["animalType"],
    imageUrl: primaryImage, mediaUrls: media.map((item) => resolveMediaUrl(item.url)).filter(Boolean),
    locationName: dto.location.regionName ?? dto.location.governorateName ?? dto.location.address ?? "",
    governorateId: String(dto.location.governorateId), governorateName: dto.location.governorateName ?? undefined,
    regionId: String(dto.location.regionId), regionName: dto.location.regionName ?? undefined,
    address: dto.location.address ?? undefined, latitude: dto.location.latitude, longitude: dto.location.longitude,
    status: toUiStatus(dto.status), priority: dto.priority === "URGENT" ? "urgent" : "normal",
    createdAt: dto.createdAt, updatedAt: dto.updatedAt, userId: dto.reporter?.id ?? "",
    assignedOrganizationId: dto.assignedOrganization ? String(dto.assignedOrganization.id) : undefined,
    assignedOrganizationName: dto.assignedOrganization?.name ?? undefined,
    assignedAt: dto.assignedAt ?? undefined, receivedAt: dto.receivedAt ?? undefined, closedAt: dto.closedAt ?? undefined,
  };
}

export function createReportInputToDto(input: CreateReportInput): CreateReportRequestDto {
  const animalType = input.animalType === "cat" ? "CAT" : input.animalType === "bird" ? "BIRD" : input.animalType === "rabbit" ? "RABBIT" : input.animalType === "other" ? "OTHER" : "DOG";
  const governorateId = Number(input.governorateId);
  const regionId = Number(input.regionId);
  if (!Number.isInteger(governorateId) || governorateId <= 0 || !Number.isInteger(regionId) || regionId <= 0) {
    throw new Error("يرجى اختيار المحافظة والمنطقة من القوائم المعتمدة.");
  }
  return { animalType, title: input.title, description: input.description, animalDescription: input.subtitle || null, priority: input.priority === "urgent" ? "URGENT" : "NORMAL", governorateId, regionId, address: (input.address ?? input.locationName).trim(), latitude: input.latitude, longitude: input.longitude, mediaUploadIds: input.mediaUploadIds?.map(Number).filter(Number.isFinite) };
}
