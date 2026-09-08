import type { BackendId, GeoLocationDto, MediaDto } from "./common";

export type ReportStatus = "OPEN" | "EN_ROUTE" | "RECEIVED" | "CLOSED";
export type ReportPriority = "NORMAL" | "URGENT";
export type AnimalType = "DOG" | "CAT" | "BIRD" | "OTHER";

export interface ReportReporterDto {
  id: BackendId;
  name: string;
  phone?: string;
  email?: string;
}

export interface AssignedOrganizationDto {
  id: BackendId;
  name: string;
}

export interface ReportDto {
  id: BackendId;
  code: string;
  status: ReportStatus;
  priority: ReportPriority;
  animalType: AnimalType;
  animalDescription?: string;
  title: string;
  description: string;
  location: GeoLocationDto;
  reporter: ReportReporterDto;
  assignedOrganization?: AssignedOrganizationDto;
  media: MediaDto[];
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  receivedAt?: string;
  closedAt?: string;
}

/** Reporting requires an authenticated account. Reporter identity is inferred from the access token. */
export interface CreateReportRequestDto {
  animalType: AnimalType;
  title: string;
  description: string;
  priority: ReportPriority;
  /** Optional when the backend resolves the approved location catalog from coordinates. */
  governorateId?: BackendId;
  regionId?: BackendId;
  address: string;
  latitude: number;
  longitude: number;
  mediaUploadIds?: BackendId[];
}

export type RescueMissionStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "RESCUED"
  | "COMPLETED"
  | "CANCELLED";

export interface RescueMissionDto {
  id: BackendId;
  reportId: BackendId;
  organizationId: BackendId;
  status: RescueMissionStatus;
  acceptedAt?: string;
  onTheWayAt?: string;
  arrivedAt?: string;
  rescuedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
  evidence: MediaDto[];
  createdAt: string;
  updatedAt: string;
}
