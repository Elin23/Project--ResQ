import { ROUTES, type AppRoute } from "@/src/navigation/routes";
import { Ionicons } from "@expo/vector-icons";

export type AccountType = "user" | "organization";
export type AccountStatus = "active" | "pending";
export type IoniconName = keyof typeof Ionicons.glyphMap;
export type Capability = { id: string; title: string; description: string; icon: IoniconName };
export type RoleContent = {
  roleLabel: string; welcomeTitle: string; welcomeDescription: string;
  statusTitle: string; statusDescription: string; status: AccountStatus;
  heroIcon: IoniconName; capabilitiesTitle: string; capabilitiesDescription: string;
  capabilities: Capability[]; primaryButtonTitle: string; primaryButtonPathname: AppRoute;
  secondaryButtonTitle?: string; secondaryButtonPathname?: AppRoute;
};

const USER_CAPABILITIES: Capability[] = [
  { id: "browse", title: "تصفح الحيوانات", description: "استكشاف الحيوانات والحالات المتاحة داخل التطبيق", icon: "paw-outline" },
  { id: "reports", title: "إرسال البلاغات", description: "الإبلاغ عن حيوان يحتاج إلى المساعدة", icon: "alert-circle-outline" },
  { id: "map", title: "استكشاف الخريطة", description: "العثور على الجمعيات والعيادات والخدمات القريبة", icon: "map-outline" },
  { id: "place", title: "إضافة جهة إلى الخريطة", description: "يمكنك لاحقًا تقديم طلب اعتماد جهة تملكها وإدارة بياناتها بعد الموافقة", icon: "location-outline" },
];
const ORGANIZATION_CAPABILITIES: Capability[] = [
  { id: "rescue", title: "إدارة حالات الإنقاذ", description: "استقبال الحالات ومتابعة مهام الإنقاذ", icon: "medical-outline" },
  { id: "volunteers", title: "إدارة المتطوعين", description: "مراجعة طلبات الانضمام والتطوع", icon: "people-outline" },
  { id: "campaigns", title: "حملات التبرع", description: "إنشاء الحملات ومتابعتها بعد الاعتماد", icon: "heart-circle-outline" },
];

export function createRoleContent(accountType: AccountType): RoleContent {
  if (accountType === "user") return {
    roleLabel: "حساب مستخدم", welcomeTitle: "مرحبًا بك في ResQ",
    welcomeDescription: "تم تأكيد رقم هاتفك وإنشاء حسابك بنجاح.",
    statusTitle: "حسابك نشط", statusDescription: "ميزات المستخدم متاحة الآن", status: "active", heroIcon: "paw",
    capabilitiesTitle: "ابدأ من هنا", capabilitiesDescription: "أهم ما يمكنك القيام به", capabilities: USER_CAPABILITIES,
    primaryButtonTitle: "الانتقال إلى الصفحة الرئيسية", primaryButtonPathname: ROUTES.userHome,
    secondaryButtonTitle: "إكمال الملف الشخصي", secondaryButtonPathname: ROUTES.profile,
  };
  return {
    roleLabel: "حساب جمعية", welcomeTitle: "تم إرسال طلب تسجيل الجمعية",
    welcomeDescription: "تم تأكيد رقم هاتف مسؤول الجمعية. ستتم مراجعة البيانات والوثائق قبل تفعيل صلاحيات الجمعية.",
    statusTitle: "الجمعية قيد المراجعة", statusDescription: "يمكنك متابعة نتيجة المراجعة من مركز الإشعارات", status: "pending", heroIcon: "people",
    capabilitiesTitle: "الميزات بعد الاعتماد", capabilitiesDescription: "تُفعل صلاحيات الجمعية التشغيلية بعد الموافقة", capabilities: ORGANIZATION_CAPABILITIES,
    primaryButtonTitle: "عرض حالة الطلب", primaryButtonPathname: ROUTES.registrationPending,
    secondaryButtonTitle: "استعراض الجهات", secondaryButtonPathname: ROUTES.organizations,
  };
}
