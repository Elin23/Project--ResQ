import type { BackendId, GeoLocationDto } from "./common";

export type MapEntityType =
  | "VET_CLINIC"
  | "ORGANIZATION"
  | "SHELTER"
  | "PET_SUPPLIES"
  | "ANIMAL_PHARMACY"
  | "PET_HOTEL"
  | "CAT_CAFE"
  | "GROOMING"
  | "FEEDING_POINT"
  | "OTHER";

export type MapListingSource = "USER_REQUEST" | "ADMIN" | "ORGANIZATION_AUTO" | "FEEDING_POINT_AUTO";
export type MapListingReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
export type MapListingStatus = "ACTIVE" | "INACTIVE";

export interface MapEntityDto {
  id: BackendId;
  sourceId: BackendId;
  type: MapEntityType;
  title: string;
  subtitle?: string;
  location: GeoLocationDto;
  source: MapListingSource;
  reviewStatus: MapListingReviewStatus;
  status: MapListingStatus;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface CreateMapListingRequestDto {
  type: Exclude<MapEntityType, "ORGANIZATION" | "FEEDING_POINT">;
  title: string;
  governorateId: BackendId;
  regionId?: BackendId;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
}
