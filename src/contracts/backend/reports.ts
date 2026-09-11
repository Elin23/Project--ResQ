export type ReportStatus = "OPEN" | "EN_ROUTE" | "RECEIVED" | "CLOSED";
export type ReportPriority = "NORMAL" | "URGENT";
export type AnimalType = "DOG" | "CAT" | "BIRD" | "RABBIT" | "OTHER";

export interface ReportLocationDto {
  governorateId: number;
  governorateName?: string | null;
  regionId: number;
  regionName?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
}
export interface ReportReporterDto { id?: string | null; name?: string | null; phone?: string | null; email?: string | null; }
export interface AssignedOrganizationDto { id: number; name?: string | null; }
export interface ReportMediaDto { id: number; type?: string | null; url?: string | null; thumbnailUrl?: string | null; altText?: string | null; }

export interface ReportDto {
  id: number;
  code?: string | null;
  status?: string | null;
  priority?: string | null;
  animalType?: string | null;
  animalDescription?: string | null;
  title?: string | null;
  description?: string | null;
  location: ReportLocationDto;
  reporter: ReportReporterDto;
  assignedOrganization?: AssignedOrganizationDto | null;
  media?: ReportMediaDto[] | null;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string | null;
  receivedAt?: string | null;
  closedAt?: string | null;
}

export interface CreateReportRequestDto {
  animalType: AnimalType;
  title: string;
  description: string;
  animalDescription?: string | null;
  priority: ReportPriority;
  governorateId: number;
  regionId: number;
  address: string;
  latitude: number;
  longitude: number;
  mediaUploadIds?: number[];
}

export type RescueMissionStatus = "ASSIGNED"|"ACCEPTED"|"ON_THE_WAY"|"ARRIVED"|"RESCUED"|"COMPLETED"|"CANCELLED";
export interface RescueMissionDto { id: number; reportId: number; organizationId: number; status?: string|null; acceptedAt?: string|null; onTheWayAt?: string|null; arrivedAt?: string|null; rescuedAt?: string|null; completedAt?: string|null; cancelledAt?: string|null; notes?: string|null; createdAt: string; updatedAt: string; }
