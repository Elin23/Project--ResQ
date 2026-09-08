import type { CreateReportInput, Report, ReportStatus } from "@/src/domain";
import type { CreateReportRequestDto, ReportDto, ReportStatus as BackendReportStatus } from "@/src/contracts/backend/reports";

const toUiStatus = (status: BackendReportStatus): ReportStatus => {
  switch (status) {
    case "OPEN": return "pending";
    case "EN_ROUTE": return "assigned";
    case "RECEIVED": return "approved";
    case "CLOSED": return "closed";
  }
};

const toBackendPriority = (priority: CreateReportInput["priority"]): CreateReportRequestDto["priority"] =>
  priority === "urgent" ? "URGENT" : "NORMAL";

const toBackendAnimalType = (animalType: CreateReportInput["animalType"]): CreateReportRequestDto["animalType"] => {
  switch (animalType) {
    case "cat": return "CAT";
    case "bird": return "BIRD";
    case "other": return "OTHER";
    case "dog":
    default:
      return "DOG";
  }
};

export function reportDtoToDomain(dto: ReportDto): Report {
  const primaryImage = dto.media.find((item) => item.type === "IMAGE")?.url ?? "";
  const animalType: Report["animalType"] = dto.animalType.toLowerCase() as Report["animalType"];
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    description: dto.description,
    subtitle: dto.animalDescription ?? dto.description,
    animalType,
    imageUrl: primaryImage,
    mediaUrls: dto.media.map((item) => item.url),
    locationName: dto.location.regionName ?? dto.location.governorateName,
    governorateId: dto.location.governorateId,
    governorateName: dto.location.governorateName,
    regionId: dto.location.regionId,
    regionName: dto.location.regionName,
    address: dto.location.address,
    latitude: dto.location.latitude,
    longitude: dto.location.longitude,
    status: toUiStatus(dto.status),
    priority: dto.priority === "URGENT" ? "urgent" : "normal",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    userId: dto.reporter.id,
    assignedOrganizationId: dto.assignedOrganization?.id,
    assignedOrganizationName: dto.assignedOrganization?.name,
    assignedAt: dto.assignedAt,
    receivedAt: dto.receivedAt,
    closedAt: dto.closedAt,
  };
}

export function createReportInputToDto(input: CreateReportInput): CreateReportRequestDto {
  return {
    animalType: toBackendAnimalType(input.animalType),
    title: input.title,
    description: input.description,
    priority: toBackendPriority(input.priority),
    governorateId: input.governorateId,
    regionId: input.regionId,
    address: input.address ?? input.locationName,
    latitude: input.latitude,
    longitude: input.longitude,
    mediaUploadIds: input.mediaUploadIds,
  };
}
