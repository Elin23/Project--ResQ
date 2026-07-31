import { Ionicons } from "@expo/vector-icons";

export type AccountType = "user" | "entity";
export type EntityType = "clinic" | "organization";
export type AccountStatus = "active" | "pending";
export type IoniconName = keyof typeof Ionicons.glyphMap;

export type Capability = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

export type RoleContent = {
  roleLabel: string;
  welcomeTitle: string;
  welcomeDescription: string;
  statusTitle: string;
  statusDescription: string;
  status: AccountStatus;
  heroIcon: IoniconName;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  capabilities: Capability[];
  primaryButtonTitle: string;
  primaryButtonPathname: string;
  secondaryButtonTitle?: string;
  secondaryButtonPathname?: string;
};

const USER_CAPABILITIES: Capability[] = [
  { id: "browse", title: "تصفح الحيوانات", description: "استكشاف الحيوانات والحالات المتاحة داخل التطبيق", icon: "paw-outline" },
  { id: "adoption", title: "تقديم طلبات التبني", description: "اختيار الحيوان المناسب ومتابعة حالة طلب التبني", icon: "home-outline" },
  { id: "reports", title: "إرسال البلاغات", description: "الإبلاغ عن حيوان ضال أو مصاب يحتاج إلى المساعدة", icon: "alert-circle-outline" },
  { id: "donations", title: "التبرع للحملات", description: "دعم حملات الإنقاذ والعلاج والرعاية", icon: "heart-outline" },
  { id: "map", title: "استخدام الخريطة التفاعلية", description: "العثور على الجمعيات والعيادات والخدمات القريبة", icon: "map-outline" },
];

const CLINIC_CAPABILITIES: Capability[] = [
  { id: "ads", title: "نشر وإدارة الإعلانات", description: "التعريف بخدمات العيادة وعروضها داخل التطبيق", icon: "megaphone-outline" },
  { id: "adoption", title: "عرض حيوانات للتبني", description: "إضافة حالات تبنٍ جديدة ومتابعة طلباتها", icon: "add-circle-outline" },
  { id: "map", title: "الظهور على الخريطة التفاعلية", description: "إظهار موقع العيادة وبيانات التواصل للمستخدمين", icon: "location-outline" },
  { id: "browse", title: "تصفح الحالات", description: "الاطلاع على الحيوانات والبلاغات المنشورة", icon: "search-outline" },
  { id: "donations", title: "التبرع للحملات", description: "المساهمة في دعم حالات الإنقاذ والعلاج", icon: "heart-outline" },
  { id: "profile", title: "إدارة ملف العيادة", description: "تحديث الخدمات وساعات العمل ومعلومات التواصل", icon: "business-outline" },
];

const ORGANIZATION_CAPABILITIES: Capability[] = [
  { id: "adoption", title: "عرض حيوانات للتبني", description: "إضافة الحالات ومتابعة طلبات التبني الواردة", icon: "paw-outline" },
  { id: "ads", title: "نشر وإدارة الإعلانات", description: "التعريف بأنشطة الجمعية وأخبارها وخدماتها", icon: "megaphone-outline" },
  { id: "campaigns", title: "إضافة حملات التبرع", description: "إنشاء الحملات ومتابعة المساهمات المالية", icon: "heart-circle-outline" },
  { id: "volunteers", title: "استقبال طلبات المتطوعين", description: "مراجعة الطلبات وتنظيم فريق المتطوعين", icon: "people-outline" },
  { id: "map", title: "الظهور على الخريطة التفاعلية", description: "إظهار موقع الجمعية وبيانات التواصل للمستخدمين", icon: "map-outline" },
];

export function createRoleContent(accountType: AccountType, entityType: EntityType | undefined, statusParam?: string): RoleContent {
  if (accountType === "user") return {
    roleLabel: "حساب مستخدم", welcomeTitle: "مرحبًا بك في ResQ",
    welcomeDescription: "تم تأكيد رقم هاتفك وإنشاء حسابك بنجاح. يمكنك الآن البدء بمساعدة الحيوانات.",
    statusTitle: "حسابك نشط", statusDescription: "جميع ميزات المستخدم متاحة الآن", status: "active", heroIcon: "paw",
    capabilitiesTitle: "ابدأ من هنا", capabilitiesDescription: "أهم الأشياء التي يمكنك القيام بها داخل التطبيق", capabilities: USER_CAPABILITIES,
    primaryButtonTitle: "الانتقال إلى الصفحة الرئيسية", primaryButtonPathname: "/(tabs)", secondaryButtonTitle: "إكمال الملف الشخصي", secondaryButtonPathname: "/profile",
  };

  const isActive = statusParam === "active";
  if (entityType === "clinic") return {
    roleLabel: "حساب عيادة", welcomeTitle: isActive ? "تم اعتماد العيادة" : "تم إرسال طلب تسجيل العيادة",
    welcomeDescription: isActive ? "أصبحت صفحة العيادة وخدماتها متاحة للمستخدمين داخل ResQ." : "تم تأكيد رقم هاتف مسؤول العيادة. سنراجع البيانات والوثائق قبل إظهار العيادة للمستخدمين.",
    statusTitle: isActive ? "العيادة معتمدة ونشطة" : "العيادة قيد المراجعة",
    statusDescription: isActive ? "تظهر العيادة على الخريطة ويمكنها إدارة الإعلانات" : "سيتم إشعارك عند اعتماد الطلب أو طلب معلومات إضافية",
    status: isActive ? "active" : "pending", heroIcon: "medkit", capabilitiesTitle: isActive ? "أدوات العيادة" : "الميزات بعد الاعتماد",
    capabilitiesDescription: "يمكن للعيادة إدارة ظهورها وخدماتها والمساهمة في حالات التبني", capabilities: CLINIC_CAPABILITIES,
    primaryButtonTitle: "فتح لوحة العيادة", primaryButtonPathname: "/(tabs)", secondaryButtonTitle: "معاينة الملف العام", secondaryButtonPathname: "/profile",
  };

  return {
    roleLabel: "حساب جمعية", welcomeTitle: isActive ? "تم اعتماد الجمعية" : "تم إرسال طلب تسجيل الجمعية",
    welcomeDescription: isActive ? "أصبحت الجمعية جاهزة لإدارة الحالات والمتطوعين والحملات داخل ResQ." : "تم تأكيد رقم هاتف مسؤول الجمعية. سنراجع البيانات والوثائق قبل تفعيل ميزات الجمعية.",
    statusTitle: isActive ? "الجمعية معتمدة ونشطة" : "الجمعية قيد المراجعة",
    statusDescription: isActive ? "يمكن للجمعية استقبال المتطوعين وإدارة الحملات" : "سيتم إشعارك فور اكتمال مراجعة الطلب",
    status: isActive ? "active" : "pending", heroIcon: "people", capabilitiesTitle: isActive ? "أدوات الجمعية" : "الميزات بعد الاعتماد",
    capabilitiesDescription: "كل ما تحتاجه الجمعية لإدارة التبني والتطوع والتبرعات", capabilities: ORGANIZATION_CAPABILITIES,
    primaryButtonTitle: "فتح لوحة الجمعية", primaryButtonPathname: "/(tabs)", secondaryButtonTitle: "معاينة الملف العام", secondaryButtonPathname: "/profile",
  };
}
