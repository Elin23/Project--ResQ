import { ROUTES } from "@/src/navigation/routes";
import { COLORS } from "@/src/theme";
import type { ProfileMenuSection } from "../types/profile";

export const PROFILE_SECTIONS: ProfileMenuSection[] = [
  { title: "إعدادات الحساب", items: [
    { id: "security", label: "الأمان والخصوصية", icon: "shield-half-outline", color: COLORS.warning, route: ROUTES.securityPrivacy },
    // معلّق حتى تُنفَّذ شاشته — أزل التعليق لإعادته إلى القائمة.
    // { id: "contact", label: "الهاتف والبريد", icon: "id-card-outline", color: COLORS.brown },
  ]},
  { title: "نشاطي", items: [
    { id: "reports", label: "بلاغاتي", icon: "alert-circle-outline", color: COLORS.successDark, route: "/reports" },
    { id: "favorites", label: "المفضلة", icon: "heart-outline", color: COLORS.danger, route: ROUTES.favorites },
    // معلّق: بند خاص بحسابات الجمعيات، وشاشة الحساب الشخصي لا تُفتح لها.
    // { id: "saved", label: "البلاغات المحفوظة", icon: "bookmark-outline", color: COLORS.successDark },
    { id: "adoption", label: "طلبات التبني", icon: "paw", color: COLORS.successDark, route: "/adoptions/my-applications" },
    // معلّق حتى تُنفَّذ شاشته — أزل التعليق لإعادته إلى القائمة.
    // { id: "volunteer", label: "طلبات التطوع", icon: "hand-left-outline", color: COLORS.successDark },
    { id: "map-places", label: "جهاتي على الخريطة", icon: "business-outline", color: COLORS.brown, route: "/map-places" },
  ]},
  { title: "تطبيق ResQ", items: [
    { id: "notifications", label: "الإشعارات", icon: "notifications-outline", color: COLORS.bgblue, route: "/notifications" },
    { id: "articles", label: "المقالات والنصائح", icon: "newspaper-outline", color: COLORS.warning, route: ROUTES.articles },
    { id: "success-stories", label: "قصص النجاح", icon: "sparkles-outline", color: COLORS.successDark, route: ROUTES.successStories },
    // معلّقة حتى تُنفَّذ شاشاتها — أزل التعليق لإعادتها إلى القائمة.
    // { id: "theme", label: "المظهر", icon: "moon-outline", color: COLORS.bgblue, value: "فاتح" },
    // { id: "language", label: "اللغة", icon: "globe-outline", color: COLORS.bgblue, value: "العربية" },
    // { id: "location", label: "إعدادات الموقع", icon: "navigate-outline", color: COLORS.bgblue },
  ]},
  { title: "الدعم والمساعدة", items: [
    { id: "help", label: "مركز المساعدة", icon: "help-circle-outline", color: COLORS.brownMuted, route: "/help-center" },
    { id: "privacy", label: "سياسة الخصوصية", icon: "shield-checkmark-outline", color: COLORS.brownMuted, route: "/privacy-policy" },
    { id: "terms", label: "الشروط والأحكام", icon: "hammer-outline", color: COLORS.brownMuted, route: "/terms-and-conditions" },
    { id: "about", label: "عن ResQ", icon: "information-circle-outline", color: COLORS.brownMuted, route: ROUTES.about },
    // معلّق حتى يُربط بمتجر التطبيقات — أزل التعليق لإعادته إلى القائمة.
    // { id: "rating", label: "تقييم التطبيق", icon: "star-outline", color: COLORS.brownMuted },
  ]},
];

