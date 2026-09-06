/**
 * البيانات الرسمية للجمعية كما تُحرَّر من داخل حساب الجمعية.
 * تقابل `EditableProfile` في الحساب الشخصي، وتغطي نفس الحقول التي جُمعت
 * وقت تسجيل الجهة في `RegisterEntityScreen`.
 */
export type EditableOrganizationData = {
  name: string;
  entityType: string;
  licenseNumber: string;
  issuingAuthority: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  governorate: string;
  district: string;
  address: string;
  activities: string[];
  animals: string[];
  workingHours: string;
  hasShelter: boolean;
  shelterCapacity: string;
  acceptsVolunteers: boolean;
};

export type OrganizationDataErrors = Partial<Record<
  | "name"
  | "licenseNumber"
  | "issuingAuthority"
  | "description"
  | "email"
  | "phone"
  | "district"
  | "activities"
  | "animals"
  | "workingHours"
  | "shelterCapacity",
  string
>>;
