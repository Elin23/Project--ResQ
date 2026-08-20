import type { MapPlaceApplication } from "./mapPlaceApplication";

export type CreateMapPlaceApplicationInput = Omit<
  MapPlaceApplication,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "submittedAt"
  | "reviewedAt"
  | "reviewedBy"
  | "rejectionReason"
  | "approvedPlaceId"
>;

export type UpdateMapPlaceApplicationInput = Partial<
  Omit<CreateMapPlaceApplicationInput, "applicantUserId">
>;

export type MapPlaceReviewDecision =
  | { decision: "approve"; reviewerId: string; reviewedAt?: string; approvedPlaceId: string }
  | { decision: "reject"; reviewerId: string; reviewedAt?: string; rejectionReason: string };

export interface MapPlaceApplicationRepository {
  createDraft(input: CreateMapPlaceApplicationInput): Promise<MapPlaceApplication>;
  getById(id: string): Promise<MapPlaceApplication | null>;
  listForUser(userId: string): Promise<MapPlaceApplication[]>;
  listPendingReview(): Promise<MapPlaceApplication[]>;
  getForReview(id: string): Promise<MapPlaceApplication | null>;
  updateOwnedDraft(id: string, userId: string, input: UpdateMapPlaceApplicationInput): Promise<MapPlaceApplication>;
  submit(id: string, userId: string): Promise<MapPlaceApplication>;
  cancel(id: string, userId: string): Promise<MapPlaceApplication>;
  review(id: string, decision: MapPlaceReviewDecision): Promise<MapPlaceApplication>;
}
