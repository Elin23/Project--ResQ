import type { ReportMediaDto } from "./reports";

export type RescueMissionStatus = "ASSIGNED" | "ACCEPTED" | "ON_THE_WAY" | "ARRIVED" | "RESCUED" | "COMPLETED" | "CANCELLED";

export interface RescueMissionDto {
  id: number;
  reportId: number;
  organizationId: number;
  organizationName?: string | null;
  status?: string | null;
  assignedAt: string;
  acceptedAt?: string | null;
  onTheWayAt?: string | null;
  arrivedAt?: string | null;
  rescuedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  evidence?: ReportMediaDto[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface RescueMissionActionRequest {
  note?: string | null;
  evidenceMediaIds?: number[] | null;
}

export interface CancelRescueMissionRequest {
  reason?: string | null;
  note?: string | null;
}
