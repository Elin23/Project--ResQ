import type { Ionicons } from "@expo/vector-icons";

export type RegisterEntityType = "clinic" | "organization";
export type RegisterEntityUploadKey = "logo" | "license" | "manager" | "extra";

export type RegisterEntityErrorKey =
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
  | "terms";

export type RegisterEntityErrors = Partial<
  Record<RegisterEntityErrorKey, string>
>;

export type RegisterEntityChipOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export type EntityLocation = {
  latitude: number;
  longitude: number;
};
