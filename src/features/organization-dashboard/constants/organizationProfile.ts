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

/** Menu definitions contain only real routes backed by production APIs. */
export function organizationProfileSections(publicProfileId?: string): ProfileMenuSection[] {
  const settingsItems: ProfileMenuSection["items"] = [
    { id: "organization-data", label: "بيانات الجمعية", icon: "business-outline", color: COLORS.primaryStrong, route: ROUTES.organizationData },
    ...(publicProfileId ? [{ id: "public-profile", label: "الملف العام للجمعية", icon: "eye-outline" as const, color: COLORS.info, route: organizationDetailsRoute(publicProfileId) }] : []),
    { id: "security", label: "الأمان والخصوصية", icon: "shield-half-outline", color: COLORS.warning, route: ROUTES.organizationSecurity },
  ];
  return [
    { title: "إعدادات الجمعية", items: settingsItems },
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
