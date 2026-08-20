import type { ModerationMetadata } from "../moderation/moderation";
import type { ContentOwner } from "../shared/ownership";

export type AdoptionListingStatus = "available" | "reserved" | "adopted" | "closed";
export type AdoptionGender = "male" | "female" | "unknown";
export type AdoptionSize = "small" | "medium" | "large";
export type AdoptionAgeUnit = "months" | "years";

export interface AdoptionHealthItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface AdoptionLocation {
  latitude: number;
  longitude: number;
  address: string;
  area?: string;
}

export interface AdoptionContact {
  name: string;
  phone: string;
  alternatePhone?: string;
  preferredMethod: "phone" | "whatsapp";
}

export interface AdoptionListing extends ContentOwner, ModerationMetadata {
  id: string;
  animalName: string;
  animalType: string;
  age: number;
  ageUnit: AdoptionAgeUnit;
  gender: AdoptionGender;
  traits: string[];
  description: string;
  weight?: number;
  color: string;
  size: AdoptionSize;
  breed?: string;
  healthCondition: string;
  healthChecklist: AdoptionHealthItem[];
  images: string[];
  location: AdoptionLocation;
  contact: AdoptionContact;

  /** Public-list compatibility fields used by existing cards. */
  imageUrl: string;
  locationName: string;
  /** Compatibility field for organization-owned listings. */
  organizationId?: string;

  createdAt: string;
  updatedAt: string;
  status: AdoptionListingStatus;
}

export interface CreateAdoptionListingInput {
  ownerAccountId: string;
  ownerAccountKind: ContentOwner["ownerAccountKind"];
  animalName: string;
  animalType: string;
  age: number;
  ageUnit: AdoptionAgeUnit;
  gender: AdoptionGender;
  traits: string[];
  description: string;
  weight?: number;
  color: string;
  size: AdoptionSize;
  breed?: string;
  healthCondition: string;
  healthChecklist: AdoptionHealthItem[];
  images: string[];
  location: AdoptionLocation;
  contact: AdoptionContact;
  organizationId?: string;
}

export type UpdateAdoptionListingInput = Omit<
  CreateAdoptionListingInput,
  "ownerAccountId" | "ownerAccountKind" | "organizationId"
> & {
  organizationId?: string;
};

