import type { ServicePlace, ServicePlaceType } from "@/src/domain";
import type { MapEntityDto } from "@/src/contracts/backend/places";
const typeMap:Record<string,ServicePlaceType>={VET_CLINIC:"clinic",ORGANIZATION:"organization",SHELTER:"shelter",PET_SUPPLIES:"pet_store",ANIMAL_PHARMACY:"animal_pharmacy",PET_HOTEL:"pet_hotel",CAT_CAFE:"cat_cafe",GROOMING:"grooming",FEEDING_POINT:"feeding_point",OTHER:"other"};
export function mapEntityDtoToServicePlace(dto:MapEntityDto):ServicePlace {
  const openingHours = dto.openingTime && dto.closingTime
    ? Array.from({ length: 7 }, (_, day) => ({ day: day as 0|1|2|3|4|5|6, open: dto.openingTime!, close: dto.closingTime! }))
    : [];
  return { id:String(dto.id),type:typeMap[dto.type ?? "OTHER"] ?? "other",name:dto.name ?? "جهة خدمة",address:dto.address ?? "",latitude:dto.latitude,longitude:dto.longitude,phone:dto.phone ?? "",website:dto.website ?? undefined,status:dto.status === "ACTIVE" ? "active":"temporarily_closed",openingHours,description:dto.description ?? undefined,verified:dto.status === "ACTIVE",governorateId:String(dto.governorateId),governorateName:dto.governorateName ?? undefined,regionId:String(dto.regionId),regionName:dto.regionName ?? undefined };
}
