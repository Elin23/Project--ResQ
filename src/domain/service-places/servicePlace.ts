export type ServicePlaceType =
  | "clinic"
  | "organization"
  | "shelter"
  | "pet_store"
  | "pet_hotel"
  | "cat_cafe"
  | "grooming"
  | "other";

export type ServicePlaceStatus = "active" | "temporarily_closed" | "suspended" | "archived";

export type DailyOpeningHours = {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  open: string | null;
  close: string | null;
};

export type ServicePlace = {
  id: string;
  type: ServicePlaceType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;
  website?: string;
  responsiblePerson?: string;
  licenseNumber?: string;
  supportingDocumentUri?: string;
  emergency24h?: boolean;
  /** Whether this place explicitly accepts some cases free of charge. */
  acceptsFreeCases?: boolean;
  /** Account backing an organization-owned place, when applicable. */
  accountId?: string;
  /** Personal user who owns/manages an approved public map place. */
  ownerUserId?: string;
  status: ServicePlaceStatus;
  openingHours: DailyOpeningHours[];
  description?: string;
  imageUri?: string;
  verified?: boolean;
  statusReason?: string;
  statusChangedAt?: string;
  statusChangedBy?: string;
};

export type PlaceOpenState = {
  isOpen: boolean;
  label: string;
  nextChangeLabel?: string;
};

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] as const;

export const SERVICE_PLACE_TYPE_META: Record<ServicePlaceType, { label: string; icon: string }> = {
  clinic: { label: "عيادة", icon: "medical" },
  organization: { label: "جمعية", icon: "people" },
  shelter: { label: "ملجأ", icon: "home" },
  pet_store: { label: "مستلزمات", icon: "bag-handle" },
  pet_hotel: { label: "فندق حيوانات", icon: "bed" },
  cat_cafe: { label: "مقهى قطط", icon: "cafe" },
  grooming: { label: "عناية وتجميل", icon: "cut" },
  other: { label: "خدمة أخرى", icon: "location" },
};

export function servicePlaceTypeLabel(type: ServicePlaceType) {
  return SERVICE_PLACE_TYPE_META[type].label;
}

export function openingHoursForDay(place: ServicePlace, day: number) {
  return place.openingHours.find((item) => item.day === day) ?? null;
}

function parseMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatClock(value: string) {
  const [hoursRaw, minutesRaw] = value.split(":").map(Number);
  const suffix = hoursRaw >= 12 ? "م" : "ص";
  const hours = hoursRaw % 12 || 12;
  return `${hours}:${String(minutesRaw).padStart(2, "0")} ${suffix}`;
}



const CLOCK_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isValidOpeningClock(value: string | null | undefined) {
  return value == null || CLOCK_PATTERN.test(value);
}

export function validateOpeningHours(hours: DailyOpeningHours[]) {
  if (hours.length !== 7) return "يجب تحديد حالة الدوام لكل أيام الأسبوع.";
  const seen = new Set<number>();
  for (const item of hours) {
    if (seen.has(item.day)) return "يوجد يوم مكرر في ساعات العمل.";
    seen.add(item.day);
    const closed = item.open == null && item.close == null;
    const incomplete = (item.open == null) !== (item.close == null);
    if (incomplete) return `${DAY_NAMES[item.day]}: يجب تحديد وقت الفتح والإغلاق معًا أو اختيار مغلق.`;
    if (!closed && (!isValidOpeningClock(item.open) || !isValidOpeningClock(item.close))) {
      return `${DAY_NAMES[item.day]}: استخدم صيغة وقت صحيحة مثل 09:00 أو 21:30.`;
    }
    if (!closed && item.open === item.close) {
      return `${DAY_NAMES[item.day]}: وقت الفتح والإغلاق لا يمكن أن يكونا متطابقين.`;
    }
  }
  return null;
}

export function allDayOpeningHours(): DailyOpeningHours[] {
  return DAY_NAMES.map((_, day) => ({
    day: day as DailyOpeningHours["day"],
    open: "00:00",
    close: "23:59",
  }));
}

export function getPlaceOpenState(place: ServicePlace, now = new Date()): PlaceOpenState {
  if (place.status === "suspended") {
    return { isOpen: false, label: "موقوف عن الظهور" };
  }
  if (place.status === "archived") {
    return { isOpen: false, label: "مؤرشف" };
  }
  if (place.status === "temporarily_closed") {
    return { isOpen: false, label: "مغلق مؤقتًا" };
  }

  const today = openingHoursForDay(place, now.getDay());
  if (!today?.open || !today.close) {
    return { isOpen: false, label: "مغلق اليوم" };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseMinutes(today.open);
  const closeMinutes = parseMinutes(today.close);
  const isOvernight = closeMinutes <= openMinutes;
  const isOpen = isOvernight
    ? currentMinutes >= openMinutes || currentMinutes < closeMinutes
    : currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return isOpen
    ? {
        isOpen: true,
        label: "مفتوح الآن",
        nextChangeLabel: place.emergency24h ? "طوارئ على مدار الساعة" : `يغلق ${formatClock(today.close)}`,
      }
    : { isOpen: false, label: "مغلق الآن", nextChangeLabel: `يفتح ${formatClock(today.open)}` };
}

export function formatOpeningHours(item: DailyOpeningHours) {
  if (!item.open || !item.close) return `${DAY_NAMES[item.day]}: مغلق`;
  return `${DAY_NAMES[item.day]}: ${formatClock(item.open)} – ${formatClock(item.close)}`;
}
