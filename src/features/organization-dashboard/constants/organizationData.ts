import {
  ENTITY_ORGANIZATION_ACTIVITIES,
  ENTITY_ORGANIZATION_ANIMALS,
  ENTITY_ORGANIZATION_TYPES,
} from "@/src/features/auth/constants/registerEntity";
import { SYRIAN_GOVERNORATES } from "@/src/features/auth/constants/governorates";
import { ORGANIZATIONS } from "@/src/features/organizations/constants/organizations";

import { ORGANIZATION_PUBLIC_PROFILE_ID } from "./organizationProfile";
import type { EditableOrganizationData } from "../types/organizationData";

/** خيارات الشاشة مأخوذة من نفس قوائم تسجيل الجهة حتى تبقى البيانات متطابقة بين التسجيل والحساب. */
export const ORGANIZATION_TYPE_OPTIONS = ENTITY_ORGANIZATION_TYPES;
export const ORGANIZATION_GOVERNORATE_OPTIONS = SYRIAN_GOVERNORATES;
export const ORGANIZATION_ACTIVITY_OPTIONS = ENTITY_ORGANIZATION_ACTIVITIES;
export const ORGANIZATION_ANIMAL_OPTIONS = ENTITY_ORGANIZATION_ANIMALS;

export const ORGANIZATION_DESCRIPTION_MAX_LENGTH = 300;
export const ORGANIZATION_DESCRIPTION_MIN_LENGTH = 40;

const PUBLIC_PROFILE =
  ORGANIZATIONS.find((organization) => organization.id === ORGANIZATION_PUBLIC_PROFILE_ID) ?? ORGANIZATIONS[0];

/**
 * البيانات المعروضة إلى حين ربط الحساب بالخلفية. الاسم والنبذة والمحافظة مأخوذة
 * من نفس مصدر الملف العام للجمعية، وباقي الحقول تعكس ملف التسجيل المعتمد.
 * الهوك يستبدل الاسم والبريد ببيانات الجلسة عند توفرها.
 */
export const DEFAULT_ORGANIZATION_DATA: EditableOrganizationData = {
  name: PUBLIC_PROFILE.name,
  entityType: ENTITY_ORGANIZATION_TYPES[0],
  licenseNumber: "SY-DMS-2015-0148",
  issuingAuthority: "وزارة الشؤون الاجتماعية والعمل",
  description: PUBLIC_PROFILE.description,
  email: "info@resq.sy",
  phone: "930112233",
  website: "resq.sy",
  governorate: PUBLIC_PROFILE.city,
  district: "المزة",
  address: "شارع الجلاء، بناء رقم 12",
  activities: ["rescue", "shelter", "adoption", "treatment"],
  animals: ["cats", "dogs"],
  workingHours: "السبت — الخميس، 9:00 صباحاً حتى 6:00 مساءً",
  hasShelter: true,
  shelterCapacity: "45",
  acceptsVolunteers: true,
};
