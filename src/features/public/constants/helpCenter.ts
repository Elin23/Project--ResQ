import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/src/theme";
export type CategoryItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  route: string;
  keywords: string[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

export type ArticleItem = {
  id: string;
  title: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  keywords: string[];
};

export const CATEGORIES: CategoryItem[] = [
  {
    id: "account",
    title: "الحساب",
    icon: "person-circle-outline",
    iconColor: COLORS.primary,
    iconBackground: COLORS.infoSoft,
    route: "/help/account",
    keywords: ["حساب", "تسجيل", "دخول", "كلمة المرور", "الهاتف"],
  },
  {
    id: "reports",
    title: "البلاغات",
    icon: "alert-circle",
    iconColor: COLORS.primaryStrong,
    iconBackground: COLORS.disabledSurface,
    route: "/help/reports",
    keywords: ["بلاغ", "بلاغات", "حالة", "إنقاذ", "طارئ"],
  },
  {
    id: "adoption",
    title: "التبني",
    icon: "paw",
    iconColor: COLORS.secondaryStrong,
    iconBackground: COLORS.disabledSurface,
    route: "/help/adoption",
    keywords: ["تبني", "طلب تبني", "حيوان", "متبني"],
  },
  {
    id: "donations",
    title: "التبرعات",
    icon: "hand-left",
    iconColor: COLORS.primary,
    iconBackground: COLORS.infoSoft,
    route: "/help/donations",
    keywords: ["تبرع", "تبرعات", "دفع", "مساعدة مالية"],
  },
  {
    id: "clinics",
    title: "العيادات",
    icon: "medkit",
    iconColor: COLORS.secondaryStrong,
    iconBackground: COLORS.disabledSurface,
    route: "/help/clinics",
    keywords: ["عيادة", "عيادات", "طبيب", "بيطري", "خريطة"],
  },
  {
    id: "organizations",
    title: "الجمعيات",
    icon: "people",
    iconColor: COLORS.primaryStrong,
    iconBackground: COLORS.disabledSurface,
    route: "/help/organizations",
    keywords: ["جمعية", "جمعيات", "منظمة", "متطوعين"],
  },
  {
    id: "feeding-points",
    title: "نقاط الإطعام",
    icon: "restaurant",
    iconColor: COLORS.primary,
    iconBackground: COLORS.infoSoft,
    route: "/help/feeding-points",
    keywords: ["إطعام", "نقطة", "طعام", "موقع"],
  },
  {
    id: "settings",
    title: "الإعدادات",
    icon: "settings",
    iconColor: COLORS.textSecondary,
    iconBackground: COLORS.disabledSurface,
    route: "/help/settings",
    keywords: ["إعدادات", "إشعارات", "خصوصية", "لغة"],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: "create-report",
    question: "كيف يمكنني إنشاء بلاغ؟",
    answer:
      "يمكنك إنشاء بلاغ من زر البلاغ الموجود في الصفحة الرئيسية، ثم إضافة نوع الحالة والصور والموقع والوصف وإرسال البلاغ.",
    keywords: ["إنشاء بلاغ", "بلاغ", "إرسال", "حالة"],
  },
  {
    id: "track-report",
    question: "كيف أتابع حالة البلاغ؟",
    answer:
      "انتقل إلى قسم بلاغاتي من حسابك، ثم افتح البلاغ المطلوب لمشاهدة حالته وآخر التحديثات عليه.",
    keywords: ["متابعة البلاغ", "حالة البلاغ", "بلاغاتي"],
  },
  {
    id: "adoption-request",
    question: "كيف أقدّم طلب تبني؟",
    answer:
      "افتح صفحة الحيوان الذي ترغب في تبنيه، واضغط على تقديم طلب تبني، ثم أكمل البيانات المطلوبة وأرسل الطلب للمراجعة.",
    keywords: ["طلب تبني", "تبني", "حيوان"],
  },
];

export const ARTICLES: ArticleItem[] = [
  {
    id: "first-aid",
    title: "دليل الإسعافات الأولية للحيوانات",
    duration: "3 دقائق",
    icon: "book-outline",
    route: "/help/articles/animal-first-aid",
    keywords: ["إسعافات", "أولية", "حيوان", "طوارئ"],
  },
  {
    id: "vaccinations",
    title: "أهمية التطعيمات الدورية",
    duration: "5 دقائق",
    icon: "shield-checkmark-outline",
    route: "/help/articles/vaccinations",
    keywords: ["تطعيم", "لقاح", "صحة"],
  },
  {
    id: "new-pet",
    title: "تجهيز منزلك للحيوان الأليف الجديد",
    duration: "4 دقائق",
    icon: "home-outline",
    route: "/help/articles/new-pet-home",
    keywords: ["منزل", "حيوان جديد", "تجهيز", "تبني"],
  },
];

export const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");

