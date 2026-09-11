import type { ImageSourcePropType } from "react-native";

export type SearchFilterKey = "all" | "clinics" | "adoption" | "reports";

type SearchBadge = { label: string; backgroundColor: string; textColor: string };

export type AdoptionSearchResult = {
  id: string;
  entityId: string;
  type: "adoption";
  title: string;
  subtitle: string;
  meta: string;
  image?: ImageSourcePropType;
  badge?: SearchBadge;
};

export type ReportSearchResult = {
  id: string;
  entityId: string;
  type: "report";
  title: string;
  subtitle: string;
  meta: string;
  image?: ImageSourcePropType;
  badge?: SearchBadge;
};

export type ClinicSearchResult = {
  id: string;
  entityId: string;
  type: "clinic";
  title: string;
  subtitle: string;
  meta: string;
  services: string;
  status?: SearchBadge;
};

export type SearchResult = AdoptionSearchResult | ReportSearchResult | ClinicSearchResult;
