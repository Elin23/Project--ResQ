export type ReportStatus = "pending" | "approved" | "assigned" | "closed";

export type ReportPriority = "normal" | "urgent";
export type ReportAnimalType = "dog" | "cat" | "bird" | "other";

export interface Report {
  id: string;
  code: string;
  title: string;
  description: string;
  subtitle: string;
  animalType?: ReportAnimalType;
  imageUrl: string;
  mediaUrls?: string[];
  locationName: string;
  governorateId?: string;
  governorateName?: string;
  regionId?: string;
  regionName?: string;
  address?: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  assignedOrganizationName?: string;
  assignedAt?: string;
  receivedAt?: string;
  closedAt?: string;
  assignedOrganizationId?: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  subtitle: string;
  animalType?: ReportAnimalType;
  imageUrl?: string;
  mediaUploadIds?: string[];
  locationName: string;
  governorateId?: string;
  governorateName?: string;
  regionId?: string;
  regionName?: string;
  address?: string;
  latitude: number;
  longitude: number;
  priority: ReportPriority;
  userId: string;
}
