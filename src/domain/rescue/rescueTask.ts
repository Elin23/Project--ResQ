export type RescueTaskStage = "accepted" | "on-route" | "arrived" | "rescued" | "completed";
export type RescueChecklistKey = "arrived" | "assessed" | "secured";

export interface RescueTask {
  id: string;
  code: string;
  reportId: string;
  organizationId: string;
  title: string;
  animalType: string;
  city: string;
  healthStatus: string;
  reporterNote: string;
  createdAt: string;
  completedAt?: string;
  distanceKm?: number;
  etaMinutes: number;
  locationLabel: string;
  locationDistance: string;
  latitude: number;
  longitude: number;
  reporterName: string;
  reporterPhone: string;
  imageUri: string;
  mapImageUri: string;
  progress: number;
  stage: RescueTaskStage;
  checklist: Record<RescueChecklistKey, boolean>;
  notes: string;
  evidenceUris: string[];
}
