import type { ImageSourcePropType } from "react-native";

export type OrganizationDashboardMetric = {
  id: string;
  label: string;
  value: string;
  dotColor?: string;
};

export type EmergencyRescueCase = {
  id: string;
  title: string;
  location: string;
  distance: string;
  reportedAgo: string;
  image: ImageSourcePropType;
  urgent?: boolean;
};

export type OrganizationRescueTask = {
  id: string;
  code: string;
  title: string;
  location: string;
  distance: string;
  progress: number;
  image: ImageSourcePropType;
};

export type OrganizationAchievement = {
  id: string;
  label: string;
  value: string;
  icon: "medal" | "star" | "ribbon" | "lock-closed";
  tone: "green" | "orange" | "blue" | "locked";
};
