import type { WorkspaceMetric } from "@/src/components/ui/WorkspaceMetricGrid";
import type { ProfileMenuSection } from "@/src/features/profile/types/profile";
import {
  adoptionMyListingsRoute,
  feedingPointsRoute,
  helpCenterRoute,
  myCampaignsRoute,
  organizationDetailsRoute,
  privacyPolicyRoute,
  termsAndConditionsRoute,
  ROUTES,
} from "@/src/navigation/routes";
import { COLORS } from "@/src/theme";

/** الملف العام المعروض للجمعية إلى حين ربط بيانات الحساب بالخلفية. */
export const ORGANIZATION_PUBLIC_PROFILE_ID = "resq-syria";

/** مؤشرات تشغيلية للجمعية، مقابل الإحصاءات الشخصية في حساب المستخدم. */
export const ORGANIZATION_PROFILE_STATS: WorkspaceMetric[] = [
  { key: "rescues", label: "عمليات إنقاذ مكتملة", value: 146, icon: "paw-outline", color: COLORS.primaryStrong },
  { key: "team", label: "أعضاء الفريق", value: 12, icon: "people-outline", color: COLORS.info },
  { key: "campaigns", label: "حملات تبرع نشطة", value: 4, icon: "heart-outline", color: COLORS.secondaryStrong },
  { key: "rating", label: "تقييم المجتمع", value: "4.9", icon: "star-outline", color: COLORS.warning },
];

/**
 * أقسام حساب الجمعية. تقابل أقسام الحساب الشخصي بنفس البنية، وتختلف في المحتوى:
 * لا مفضلة ولا جهات على الخريطة (غير مصرّح بهما للجمعية في accessPolicy)،
 * والنشاط هنا تشغيلي على مستوى مساحة عمل الجمعية.
 */
export function organizationProfileSections(publicProfileId: string): ProfileMenuSection[] {
  return [
    { title: "إعدادات الجمعية", items: [
      { id: "organization-data", label: "بيانات الجمعية", icon: "business-outline", color: COLORS.primaryStrong },
      { id: "public-profile", label: "الملف العام للجمعية", icon: "eye-outline", color: COLORS.info, route: organizationDetailsRoute(publicProfileId) },
      { id: "security", label: "الأمان والخصوصية", icon: "shield-half-outline", color: COLORS.warning, route: ROUTES.organizationSecurity },
    ]},
    { title: "عمليات الجمعية", items: [
      { id: "reports", label: "البلاغات الواردة", icon: "alert-circle-outline", color: COLORS.danger, route: ROUTES.organizationReports },
      { id: "tasks", label: "مهام الإنقاذ", icon: "navigate-outline", color: COLORS.primaryStrong, route: ROUTES.organizationTasks },
      { id: "adoption-listings", label: "إعلانات التبني", icon: "paw", color: COLORS.success, route: adoptionMyListingsRoute("organization") },
      { id: "campaigns", label: "حملات التبرع", icon: "heart-outline", color: COLORS.secondaryStrong, route: myCampaignsRoute("organization") },
      { id: "feeding-points", label: "نقاط الإطعام", icon: "restaurant-outline", color: COLORS.info, route: feedingPointsRoute("organization") },
    ]},
    { title: "تطبيق ResQ", items: [
      { id: "notifications", label: "الإشعارات", icon: "notifications-outline", color: COLORS.info, route: ROUTES.organizationNotifications },
    ]},
    { title: "الدعم والمساعدة", items: [
      { id: "help", label: "مركز المساعدة", icon: "help-circle-outline", color: COLORS.textMuted, route: helpCenterRoute("organization") },
      { id: "privacy", label: "سياسة الخصوصية", icon: "shield-checkmark-outline", color: COLORS.textMuted, route: privacyPolicyRoute("organization") },
      { id: "terms", label: "الشروط والأحكام", icon: "hammer-outline", color: COLORS.textMuted, route: termsAndConditionsRoute("organization") },
    ]},
  ];
}
