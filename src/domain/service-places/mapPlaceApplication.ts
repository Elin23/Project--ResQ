import type { DailyOpeningHours, ServicePlaceType } from "./servicePlace";

export type MapPlaceApplicationStatus = "draft" | "pending" | "approved" | "rejected" | "cancelled";

/**
 * A request by a normal user to publish a public service place on the map.
 * Approval never changes the user's AccountKind; it grants ownership of the
 * resulting ServicePlace resource only.
 */
export type MapPlaceApplication = {
  id: string;
  applicantUserId: string;
  requestedType: Exclude<ServicePlaceType, "organization">;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;
  website?: string;
  responsiblePerson?: string;
  emergency24h?: boolean;
  acceptsFreeCases?: boolean;
  openingHours?: DailyOpeningHours[];
  licenseNumber?: string;
  supportingDocumentUri?: string;
  status: MapPlaceApplicationStatus;
  rejectionReason?: string;
  /** Populated by the backend/reviewer when approval materializes a place. */
  approvedPlaceId?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

export function canUserManageMapPlace(ownerUserId: string | undefined, currentUserId: string): boolean {
  return Boolean(ownerUserId) && ownerUserId === currentUserId;
}

export function canUserManageMapPlaceApplication(
  application: Pick<MapPlaceApplication, "applicantUserId">,
  currentUserId: string,
): boolean {
  return application.applicantUserId === currentUserId;
}
