import { Ionicons } from "@expo/vector-icons";

export type MessageType = {
  id: string;
  label: string;
};

export type SocialItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  url: string;
};

export type ContactFormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  messageType?: string;
  message?: string;
};

const nonEmptyEnv = (value?: string) => value?.trim() || undefined;

/**
 * Public support details are deployment configuration, not demo data.
 * Optional channels stay hidden when they are not configured.
 */
export const SUPPORT_EMAIL = nonEmptyEnv(process.env.EXPO_PUBLIC_SUPPORT_EMAIL) ?? "support@resq.app";
export const SUPPORT_PHONE = nonEmptyEnv(process.env.EXPO_PUBLIC_SUPPORT_PHONE);
export const SUPPORT_HOURS = nonEmptyEnv(process.env.EXPO_PUBLIC_SUPPORT_HOURS);
export const MAX_MESSAGE_LENGTH = 1000;

export const MESSAGE_TYPES: MessageType[] = [
  { id: "question", label: "استفسار عام" },
  { id: "suggestion", label: "اقتراح" },
  { id: "technical", label: "مشكلة تقنية" },
  { id: "account", label: "مشكلة في الحساب" },
  { id: "report", label: "مشكلة في بلاغ" },
  { id: "other", label: "أخرى" },
];

const configuredSocialItems: (SocialItem | null)[] = [
  nonEmptyEnv(process.env.EXPO_PUBLIC_WEBSITE_URL)
    ? { id: "website", label: "الموقع", icon: "globe-outline", url: process.env.EXPO_PUBLIC_WEBSITE_URL!.trim() }
    : null,
  nonEmptyEnv(process.env.EXPO_PUBLIC_FACEBOOK_URL)
    ? { id: "facebook", label: "فيسبوك", icon: "logo-facebook", url: process.env.EXPO_PUBLIC_FACEBOOK_URL!.trim() }
    : null,
  nonEmptyEnv(process.env.EXPO_PUBLIC_INSTAGRAM_URL)
    ? { id: "instagram", label: "إنستغرام", icon: "logo-instagram", url: process.env.EXPO_PUBLIC_INSTAGRAM_URL!.trim() }
    : null,
  nonEmptyEnv(process.env.EXPO_PUBLIC_LINKEDIN_URL)
    ? { id: "linkedin", label: "لينكدإن", icon: "logo-linkedin", url: process.env.EXPO_PUBLIC_LINKEDIN_URL!.trim() }
    : null,
];

export const SOCIAL_ITEMS = configuredSocialItems.filter((item): item is SocialItem => item !== null);
