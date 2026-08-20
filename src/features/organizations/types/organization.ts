import type { ImageSourcePropType } from "react-native";

export type OrganizationService = "إنقاذ" | "علاج" | "إطعام" | "تطوع" | "تبني";

export type Organization = {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  reviews: number;
  verified: boolean;
  description: string;
  image: ImageSourcePropType;
  logo?: ImageSourcePropType;
  services: OrganizationService[];
  successfulCases: number;
  volunteers: number;
  activeRescues: number;
  animalsTreated: number;
};
