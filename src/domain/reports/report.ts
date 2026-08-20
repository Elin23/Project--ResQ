export type ReportStatus = "pending" | "approved" | "assigned" | "closed";

export type ReportPriority = "normal" | "urgent";

export interface Report {
  id: string;
  code: string;
  title: string;
  description: string;
  subtitle: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  userId: string;
  assignedOrganizationId?: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  subtitle: string;
  imageUrl?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  priority: ReportPriority;
  userId: string;
}
