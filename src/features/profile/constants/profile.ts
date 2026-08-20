import { COLORS } from "@/src/theme";
import type { EditableProfile, ProfileMenuSection, ProfileStat } from "../types/profile";

export const DEFAULT_PROFILE: EditableProfile = {
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmad.ali@example.com",
  phone: "931234567",
  city: "دمشق",
  bio: "أنا محب للحيوانات وأسعى دائماً للمساعدة في إنقاذ الأرواح الضعيفة في شوارع دمشق.",
  profession: "",
  experienceYears: "3",
  skills: ["إسعاف أولي", "تصوير فوتوغرافي"],
  avatarUri: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500",
};

export const PROFILE_STATS: ProfileStat[] = [
  { label: "البلاغات", value: 18, color: COLORS.brown },
  { label: "إنقاذات", value: 12, color: COLORS.successDark },
  { label: "طلبات التبني", value: 3, color: COLORS.bgblue },
  { label: "ساعات التطوع", value: 27, color: COLORS.brownDark },
];

export const PROFILE_SECTIONS: ProfileMenuSection[] = [
  { title: "إعدادات الحساب", items: [
    { id: "personal", label: "البيانات الشخصية", icon: "person-outline", color: COLORS.brown, route: "/profile/edit" },
    { id: "security", label: "الأمان والخصوصية", icon: "shield-half-outline", color: COLORS.warning },
    { id: "contact", label: "الهاتف والبريد", icon: "id-card-outline", color: COLORS.brown },
  ]},
  { title: "نشاطي", items: [
    { id: "reports", label: "بلاغاتي", icon: "alert-circle-outline", color: COLORS.successDark, route: "/reports" },
    { id: "saved", label: "البلاغات المحفوظة", icon: "bookmark-outline", color: COLORS.successDark },
    { id: "adoption", label: "طلبات التبني", icon: "paw", color: COLORS.successDark, route: "/adoptions" },
    { id: "volunteer", label: "طلبات التطوع", icon: "heart-outline", color: COLORS.successDark },
    { id: "map-places", label: "جهاتي على الخريطة", icon: "business-outline", color: COLORS.brown, route: "/map-places" },
  ]},
  { title: "تطبيق ResQ", items: [
    { id: "notifications", label: "الإشعارات", icon: "notifications-outline", color: COLORS.bgblue, route: "/notifications" },
    { id: "theme", label: "المظهر", icon: "moon-outline", color: COLORS.bgblue, value: "فاتح" },
    { id: "language", label: "اللغة", icon: "globe-outline", color: COLORS.bgblue, value: "العربية" },
    { id: "location", label: "إعدادات الموقع", icon: "navigate-outline", color: COLORS.bgblue },
  ]},
  { title: "الدعم والمساعدة", items: [
    { id: "help", label: "مركز المساعدة", icon: "help-circle-outline", color: COLORS.brownMuted, route: "/help-center" },
    { id: "privacy", label: "سياسة الخصوصية", icon: "shield-checkmark-outline", color: COLORS.brownMuted, route: "/privacy-policy" },
    { id: "terms", label: "الشروط والأحكام", icon: "hammer-outline", color: COLORS.brownMuted, route: "/terms-and-conditions" },
    { id: "rating", label: "تقييم التطبيق", icon: "star-outline", color: COLORS.brownMuted },
  ]},
];

export const PROFILE_CITIES = ["دمشق", "ريف دمشق", "حلب", "حمص", "اللاذقية"];
