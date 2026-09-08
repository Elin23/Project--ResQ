import type { ServicePlace, ServicePlaceType } from "@/src/domain";
import type { MapEntityDto, MapEntityType } from "@/src/contracts/backend/places";

const typeMap: Record<MapEntityType, ServicePlaceType> = {
  VET_CLINIC: "clinic",
  ORGANIZATION: "organization",
  SHELTER: "shelter",
  PET_SUPPLIES: "pet_store",
  ANIMAL_PHARMACY: "animal_pharmacy",
  PET_HOTEL: "pet_hotel",
  CAT_CAFE: "cat_cafe",
  GROOMING: "grooming",
  FEEDING_POINT: "feeding_point",
  OTHER: "other",
};

export function mapEntityDtoToServicePlace(dto: MapEntityDto): ServicePlace {
  return {
    id: dto.id,
    type: typeMap[dto.type],
    name: dto.title,
    address: dto.location.address,
    latitude: dto.location.latitude,
    longitude: dto.location.longitude,
    phone: dto.phone ?? "",
    website: dto.website,
    status: dto.status === "ACTIVE" ? "active" : "temporarily_closed",
    openingHours: [],
    description: dto.description,
    imageUri: dto.imageUrl,
    verified: dto.reviewStatus === "APPROVED",
    governorateId: dto.location.governorateId,
    governorateName: dto.location.governorateName,
    regionId: dto.location.regionId,
    regionName: dto.location.regionName,
  };
}
