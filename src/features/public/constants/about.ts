import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

type FeatureItem = {
  id: string;
  title: string;
  icon: IoniconName;
};

type InfoItem = {
  id: string;
  label: string;
  value: string;
};

type SocialItem = {
  id: string;
  title: string;
  icon: IoniconName;
  url: string;
};

export const APP_VERSION = "1.0.0";
export const LAST_UPDATED = "يناير 2026";
export const PLATFORM = "Android";
export const ABOUT_SUPPORT_EMAIL = "support@resq.app";

export const ABOUT_FEATURES: FeatureItem[] = [
  { id: "reports", title: "الإبلاغ عن حالات", icon: "alert-circle-outline" },
  { id: "tracking", title: "متابعة البلاغات", icon: "time-outline" },
  { id: "adoption", title: "التبني", icon: "heart-outline" },
  { id: "donations", title: "التبرعات", icon: "wallet-outline" },
  { id: "feeding", title: "نقاط الإطعام", icon: "location-outline" },
  { id: "clinics", title: "عيادات بيطرية", icon: "medkit-outline" },
  { id: "organizations", title: "الجمعيات", icon: "people-outline" },
  { id: "volunteering", title: "التطوع", icon: "hand-left-outline" },
];

export const ABOUT_INFO_ITEMS: InfoItem[] = [
  { id: "version", label: "الإصدار", value: APP_VERSION },
  { id: "updated", label: "آخر تحديث", value: LAST_UPDATED },
  { id: "platform", label: "المنصة", value: PLATFORM },
];

export const ABOUT_SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "website",
    title: "الموقع الإلكتروني",
    icon: "globe-outline",
    url: "https://resq.app",
  },
  {
    id: "facebook",
    title: "فيسبوك",
    icon: "logo-facebook",
    url: "https://www.facebook.com",
  },
  {
    id: "instagram",
    title: "إنستغرام",
    icon: "logo-instagram",
    url: "https://www.instagram.com",
  },
  {
    id: "linkedin",
    title: "لينكد إن",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com",
  },
];

