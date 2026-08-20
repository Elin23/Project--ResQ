import type { ServicePlace, ServicePlaceStatus, ServicePlaceType } from "./servicePlace";

export type ServicePlaceQuery = {
  type?: ServicePlaceType;
  search?: string;
};

export type CreateServicePlaceInput = Omit<ServicePlace, "id">;

/** Public information an owner may change. Moderation status is intentionally excluded. */
export type UpdateOwnedServicePlaceInput = Pick<
  ServicePlace,
  | "name"
  | "phone"
  | "secondaryPhone"
  | "whatsapp"
  | "website"
  | "responsiblePerson"
  | "emergency24h"
  | "acceptsFreeCases"
  | "openingHours"
  | "description"
>;

/** Trusted review-only changes to identity/location/verification fields. */
export type ApplySensitiveServicePlaceChangesInput = Partial<Pick<ServicePlace, "type" | "address" | "latitude" | "longitude" | "licenseNumber" | "supportingDocumentUri">>;

export type ServicePlaceModerationStatusInput = {
  status: Extract<ServicePlaceStatus, "active" | "suspended" | "archived">;
  reviewerId: string;
  reason?: string;
  changedAt?: string;
};

export interface ServicePlaceRepository {
  /** Public discovery only; suspended/archived places are excluded. */
  list(query?: ServicePlaceQuery): Promise<ServicePlace[]>;
  /** Public details only; suspended/archived places resolve to null. */
  getById(id: string): Promise<ServicePlace | null>;
  /** Trusted moderation lookup, regardless of publication state. */
  getForModeration(id: string): Promise<ServicePlace | null>;
  listOwnedByUser(userId: string): Promise<ServicePlace[]>;
  getOwnedByUser(placeId: string, userId: string): Promise<ServicePlace | null>;
  create(input: CreateServicePlaceInput): Promise<ServicePlace>;
  remove(id: string): Promise<void>;
  updateOwnedByUser(placeId: string, userId: string, input: UpdateOwnedServicePlaceInput): Promise<ServicePlace>;
  setModerationStatus(placeId: string, input: ServicePlaceModerationStatusInput): Promise<ServicePlace>;
  applySensitiveChanges(placeId: string, input: ApplySensitiveServicePlaceChangesInput): Promise<ServicePlace>;
}
