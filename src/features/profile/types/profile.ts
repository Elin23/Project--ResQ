import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export type ProfileStat = { label: string; value: number; color: string };
export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route?: Href;
  value?: string;
};
export type ProfileMenuSection = { title: string; items: ProfileMenuItem[] };
export type EditableProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  governorateId: string;
  governorateName: string;
  regionId: string;
  regionName: string;
  birthDate?: string;
  bio: string;
  avatarUri: string;
  phoneVerified: boolean;
};
