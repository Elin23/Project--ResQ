import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

type TableItem = {
  id: string;
  title: string;
};

type InformationItem = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

export const SUPPORT_EMAIL = "support@resq.app";

export const TABLE_ITEMS: TableItem[] = [
  { id: "introduction", title: "مقدمة" },
  { id: "information", title: "المعلومات التي نجمعها" },
  { id: "usage", title: "كيفية استخدام المعلومات" },
  { id: "sharing", title: "مشاركة البيانات" },
  { id: "protection", title: "حماية المعلومات" },
  { id: "rights", title: "حقوق المستخدم" },
];

export const INFORMATION_ITEMS: InformationItem[] = [
  {
    id: "account",
    title: "بيانات الحساب",
    description: "الاسم، البريد الإلكتروني، ورقم الهاتف لتوثيق الهوية.",
    icon: "person-outline",
  },
  {
    id: "location",
    title: "الموقع الجغرافي",
    description: "نحتاج لموقعك عند تقديم بلاغ إنقاذ لتحديد مكان الحيوان بدقة.",
    icon: "location-outline",
  },
  {
    id: "volunteering",
    title: "بيانات التبرع والتطوع",
    description: "تُستخدم مساهماتك لتعزيز ملفك الشخصي كعضو فعّال في المجتمع.",
    icon: "hand-left-outline",
  },
];

export const PRIVACY_LAST_UPDATED = "15 مايو 2026";
