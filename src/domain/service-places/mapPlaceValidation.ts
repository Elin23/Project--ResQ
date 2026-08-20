import { validateOpeningHours, type DailyOpeningHours, type ServicePlaceType } from './servicePlace';

export type UserServicePlaceType = Exclude<ServicePlaceType, 'organization'>;

export type MapPlaceDraftData = {
  requestedType: UserServicePlaceType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  responsiblePerson?: string;
  licenseNumber?: string;
  supportingDocumentUri?: string;
  openingHours?: DailyOpeningHours[];
};

export function validateMapPlaceDraft(input: MapPlaceDraftData, options: { forSubmission?: boolean } = {}) {
  if (!input.name.trim() || !input.address.trim() || !input.phone.trim()) return 'الاسم والعنوان ورقم الهاتف مطلوبة.';
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90 || !Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
    return 'الموقع المحدد غير صحيح.';
  }
  if (input.openingHours) {
    const hoursError = validateOpeningHours(input.openingHours);
    if (hoursError) return hoursError;
  }
  if (options.forSubmission && input.requestedType === 'clinic') {
    if (!input.responsiblePerson?.trim()) return 'اسم الطبيب أو المسؤول مطلوب للعيادة.';
    if (!input.licenseNumber?.trim()) return 'رقم الترخيص مطلوب لإرسال طلب العيادة للمراجعة.';
    if (!input.supportingDocumentUri?.trim()) return 'صورة الترخيص أو إثبات مزاولة النشاط مطلوبة للعيادة.';
  }
  if (options.forSubmission && ['pet_hotel', 'grooming', 'shelter'].includes(input.requestedType) && !input.responsiblePerson?.trim()) {
    return 'اسم الشخص المسؤول مطلوب لهذا النوع من الجهات.';
  }
  return null;
}
