import { validateOpeningHours, type DailyOpeningHours, type ServicePlaceType } from "./servicePlace";

export type UserServicePlaceType = Exclude<ServicePlaceType, "organization">;

export type MapPlaceDraftData = {
  requestedType: UserServicePlaceType;
  name: string;
  governorateId?: string;
  regionId?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours?: DailyOpeningHours[];
  licenseNumber?: string;
  supportingDocumentUri?: string;
};

export function validateMapPlaceDraft(input: MapPlaceDraftData, _options: { forSubmission?: boolean } = {}) {
  if (!input.name.trim()) return "اسم الجهة مطلوب.";
  if (!input.governorateId?.trim()) return "اختر المحافظة من القائمة المعتمدة.";
  if (!input.regionId?.trim()) return "اختر المنطقة التابعة للمحافظة.";
  if (!input.address.trim()) return "عنوان الجهة مطلوب.";
  if (!input.phone.trim()) return "رقم الهاتف الأساسي مطلوب.";
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90 || !Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
    return "الموقع المحدد غير صحيح.";
  }
  if (input.requestedType === 'clinic') {
    if (!input.licenseNumber?.trim()) return "رقم ترخيص العيادة مطلوب.";
    if (!input.supportingDocumentUri?.trim()) return "أرفق صورة واضحة عن ترخيص العيادة للتحقق.";
  }
  if (input.openingHours) {
    const hoursError = validateOpeningHours(input.openingHours);
    if (hoursError) return hoursError;
  }
  return null;
}
