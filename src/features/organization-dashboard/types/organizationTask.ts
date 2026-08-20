import type { ImageSourcePropType } from "react-native";

export type OrganizationTaskStage = "accepted" | "on-route" | "arrived" | "rescued";

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
  etaMinutes: number;
  locationLabel: string;
  locationDistance: string;
  reporterName: string;
  reporterPhone: string;
  image: ImageSourcePropType;
  mapImage: ImageSourcePropType;
};

export type CompletedTaskSummary = {
  duration: string;
  distance: string;
  uploadedPhotos: string;
  notesStatus: string;
};
