export type OrganizationTaskStage = "assigned" | "accepted" | "on-route" | "arrived" | "rescued" | "cancelled";

export type OrganizationTaskChecklistKey = "arrived" | "assessed" | "secured";

export type OrganizationTaskTimelineItem = {
  id: OrganizationTaskStage;
  label: string;
  time?: string;
};

export type OrganizationTask = {
  id: string;
  code: string;
  animalType: string;
  city: string;
  healthStatus: string;
  reporterNote: string;
  reportedAgo: string;
  locationLabel: string;
  reporterName: string;
  reporterPhone: string;
  imageUri: string;
};

export type CompletedTaskSummary = {
  duration: string;
  distance: string;
  uploadedPhotos: string;
  notesStatus: string;
};
