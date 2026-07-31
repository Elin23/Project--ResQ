import { ImageSourcePropType } from "react-native";

export type SearchFilterKey = "all" | "clinics" | "adoption" | "lost";

export type AnimalSearchResult = {
  id: string;
  type: "animal";
  category: "adoption" | "lost";
  title: string;
  subtitle: string;
  distance: string;
  image: ImageSourcePropType;
  badge?: {
    label: string;
    backgroundColor: string;
    textColor: string;
  };
};

export type ClinicSearchResult = {
  id: string;
  type: "clinic";
  title: string;
  subtitle: string;
  distance: string;
  services: string;
  status?: {
    label: string;
    backgroundColor: string;
    textColor: string;
  };
};

export type SearchResult = AnimalSearchResult | ClinicSearchResult;
