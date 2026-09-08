import type { BackendId, GeoLocationDto, MediaDto } from "./common";

export type OrganizationStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type OrganizationVerificationStatus =
  | "NOT_REVIEWED"
  | "IN_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "MORE_INFO_REQUIRED";

export type OrganizationServiceKey =
  | "RESCUE"
  | "SHELTER"
  | "FOSTER"
  | "ADOPTION"
  | "AWARENESS"
  | "TRANSPORT"
  | "FOOD_SUPPORT";

export interface OrganizationOperatingHoursDto {
  day: "SATURDAY" | "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
  closed: boolean;
  open24Hours?: boolean;
  opensAt?: string;
  closesAt?: string;
}

export interface OrganizationPublicDto {
  id: BackendId;
  name: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  status: OrganizationStatus;
  verificationStatus: OrganizationVerificationStatus;
  registrationNumber?: string;
  licenseNumber?: string;
  location: GeoLocationDto;
  phone?: string;
  email?: string;
  website?: string;
  services: OrganizationServiceKey[];
  operatingHours: OrganizationOperatingHoursDto[];
  media?: MediaDto[];
  createdAt: string;
  updatedAt: string;
}
