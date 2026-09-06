import type {
  SecurityPrivacyContent,
  SecurityPrivacySettings,
  SecurityPrivacyVariant,
} from "../types/securityPrivacy";

/**
 * الحالة الابتدائية للمفاتيح إلى حين ربط تفضيلات الحساب بالخلفية.
 * تقابل DEFAULT_PROFILE في constants/profile.ts: بيانات عرض محلية لا أكثر.
 */
export const DEFAULT_SECURITY_SETTINGS: SecurityPrivacySettings = {
  twoFactor: false,
  loginAlerts: true,
  publicProfile: true,
  showPhone: false,
  shareLocation: true,
  allowMessages: true,
};

const USER_CONTENT: SecurityPrivacyContent = {
  title: "الأمان والخصوصية",
  subtitle: "تحكّم بكلمة المرور وبما يظهر من بياناتك للآخرين",
  passwordSectionTitle: "كلمة المرور",
  passwordSectionSubtitle: "اختر كلمة مرور قوية ولا تشاركها مع أحد",
  protectionSectionTitle: "طبقات حماية إضافية",
  protectionSectionSubtitle: "تنبيهات وإجراءات تحمي حسابك من الدخول غير المصرّح به",
  protectionToggles: [
    { id: "twoFactor", label: "التحقق بخطوتين", description: "نرسل رمزاً إلى رقم هاتفك عند كل تسجيل دخول جديد." },
    { id: "loginAlerts", label: "تنبيه عند تسجيل دخول جديد", description: "يصلك إشعار فور تسجيل الدخول من جهاز لم تستخدمه سابقاً." },
  ],
  privacySectionTitle: "خصوصية بياناتي",
  privacySectionSubtitle: "أنت من يقرّر ما الذي يراه بقية المستخدمين",
  privacyToggles: [
    { id: "publicProfile", label: "إظهار ملفي الشخصي", description: "يستطيع المستخدمون رؤية اسمك وصورتك ونشاطك في الإنقاذ." },
    { id: "showPhone", label: "إظهار رقم هاتفي على بلاغاتي", description: "يظهر رقمك لمن يريد التواصل معك حول بلاغ نشرته." },
    { id: "shareLocation", label: "مشاركة موقعي مع البلاغ", description: "يُرفق موقعك الحالي تلقائياً عند إنشاء بلاغ جديد." },
    { id: "allowMessages", label: "السماح للجمعيات بمراسلتي", description: "تستطيع الجمعيات مراسلتك بخصوص طلبات التبنّي والتطوع." },
  ],
  sessionsSectionTitle: "الجلسات والأجهزة",
  sessionsSectionSubtitle: "إذا فقدت جهازك أو شككت بدخول غريب، أنهِ كل الجلسات",
  signOutAllMessage: "سيتم إنهاء جلستك على كل الأجهزة، وستحتاج إلى تسجيل الدخول من جديد.",
  dataSectionTitle: "بياناتي",
  dataSectionSubtitle: "اطّلع على كيفية تعاملنا مع بياناتك",
  privacyPolicyLabel: "سياسة الخصوصية",
  privacyPolicyIcon: "shield-checkmark-outline",
};

const ORGANIZATION_CONTENT: SecurityPrivacyContent = {
  title: "الأمان والخصوصية",
  subtitle: "تحكّم بأمان حساب الجمعية وبما يظهر في ملفها العام",
  passwordSectionTitle: "كلمة مرور الحساب",
  passwordSectionSubtitle: "حساب الجمعية مشترك بين أعضاء الفريق، فاحرص على تحديث كلمة المرور دورياً",
  protectionSectionTitle: "طبقات حماية إضافية",
  protectionSectionSubtitle: "تنبيهات وإجراءات تحمي حساب الجمعية من الدخول غير المصرّح به",
  protectionToggles: [
    { id: "twoFactor", label: "التحقق بخطوتين", description: "نرسل رمزاً إلى رقم الجمعية الموثّق عند كل تسجيل دخول جديد." },
    { id: "loginAlerts", label: "تنبيه عند تسجيل دخول جديد", description: "يصل الإشعار إلى الجمعية فور الدخول من جهاز غير معروف." },
  ],
  privacySectionTitle: "خصوصية الملف العام",
  privacySectionSubtitle: "أنت من يقرّر ما الذي يظهر للمستخدمين في ملف الجمعية",
  privacyToggles: [
    { id: "publicProfile", label: "ظهور الجمعية في نتائج البحث", description: "تظهر الجمعية للمستخدمين ضمن نتائج البحث وقوائم الجمعيات." },
    { id: "showPhone", label: "إظهار رقم التواصل", description: "يظهر رقم الجمعية في الملف العام لمن يريد التواصل المباشر." },
    { id: "shareLocation", label: "إظهار العنوان التفصيلي", description: "يظهر عنوان مقرّ الجمعية على الخريطة وفي الملف العام." },
    { id: "allowMessages", label: "استقبال رسائل المتطوعين", description: "يستطيع المستخدمون مراسلة الجمعية بخصوص التطوع والمساعدة." },
  ],
  sessionsSectionTitle: "الجلسات والأجهزة",
  sessionsSectionSubtitle: "إذا غادر أحد أعضاء الفريق أو شككت بدخول غريب، أنهِ كل الجلسات",
  signOutAllMessage: "سيتم إنهاء جلسة الجمعية على كل الأجهزة، وسيحتاج الفريق إلى تسجيل الدخول من جديد.",
  dataSectionTitle: "بيانات الجمعية",
  dataSectionSubtitle: "اطّلع على كيفية تعاملنا مع بيانات الجمعية",
  privacyPolicyLabel: "سياسة الخصوصية",
  privacyPolicyIcon: "shield-checkmark-outline",
};

export const SECURITY_PRIVACY_CONTENT: Record<SecurityPrivacyVariant, SecurityPrivacyContent> = {
  user: USER_CONTENT,
  organization: ORGANIZATION_CONTENT,
};
