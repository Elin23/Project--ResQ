import type { Ionicons } from "@expo/vector-icons";

export type RegisterEntityType = "organization";

export type EntityLocation = {
  latitude: number;
  longitude: number;
};

export type RegisterEntityUploadKey = "logo" | "license" | "manager" | "extra";

export type RegisterEntityChipOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export type RegisterEntityErrors = Partial<Record<
  | "fullName"
  | "email"
  | "birthDate"
  | "phone"
  | "entityName"
  | "entityCategory"
  | "licenseNumber"
  | "issuingAuthority"
  | "description"
  | "serviceGovernorate"
  | "serviceDistrict"
  | "mapLocation"
  | "activities"
  | "animals"
  | "workingHours"
  | "shelterCapacity"
  | "volunteerRequirements"
  | "licenseDocument"
  | "password"
  | "confirmPassword"
  | "information"
  | "verification"
  | "terms",
  string | undefined
>>;
