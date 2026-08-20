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

export const SUPPORT_EMAIL = "support@resq.app";
export const SUPPORT_PHONE = "+963 XX XXX XXXX";
export const MAX_MESSAGE_LENGTH = 1000;

export const MESSAGE_TYPES: MessageType[] = [
  { id: "question", label: "استفسار عام" },
  { id: "suggestion", label: "اقتراح" },
  { id: "technical", label: "مشكلة تقنية" },
  { id: "account", label: "مشكلة في الحساب" },
  { id: "report", label: "مشكلة في بلاغ" },
  { id: "other", label: "أخرى" },
];

export const SOCIAL_ITEMS: SocialItem[] = [
  { id: "website", label: "الموقع", icon: "globe-outline", url: "https://resq.app" },
  { id: "facebook", label: "فيسبوك", icon: "logo-facebook", url: "https://www.facebook.com" },
  { id: "instagram", label: "إنستغرام", icon: "logo-instagram", url: "https://www.instagram.com" },
  { id: "linkedin", label: "لينكدإن", icon: "logo-linkedin", url: "https://www.linkedin.com" },
];
