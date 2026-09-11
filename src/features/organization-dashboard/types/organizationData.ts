import type { DailyOpeningHours } from "@/src/domain/service-places";

/**
 * Editable organization fields that are actually persisted by the backend.
 * Official identity fields (name/license/email) are read-only here because
 * changing them requires an identity/verification workflow rather than a
 * silent local edit.
 */
export type EditableOrganizationData = {
  description: string;
  phone: string;
  website: string;
  activities: string[];
  openingHours: DailyOpeningHours[];
  logoUri: string;
};

export type OrganizationIdentityData = {
  name: string;
  licenseNumber: string;
  registrationNumber: string;
  email: string;
  governorateName: string;
  regionName: string;
  address: string;
  verificationStatus: string;
};

export type OrganizationDataErrors = Partial<Record<
  "description" | "phone" | "website" | "activities" | "openingHours" | "general",
  string
>>;
