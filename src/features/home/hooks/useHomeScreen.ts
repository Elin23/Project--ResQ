import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { COLORS } from "@/src/theme";
import { articlesRoute, donationsRoute, feedingPointsRoute, successStoriesRoute, veterinaryClinicsRoute, ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import type { HomeQuickAction } from "../constants/home";
import type { WorkspaceMetric } from "@/src/components/ui/WorkspaceMetricGrid";
import { repositories } from "@/src/services/domain/repositories";

export function useHomeScreen() {
  const router = useRouter();
  const { isGuest, account, accountKind } = useSession();
  const isPendingOrganization = account?.kind === "organization" && account.status === "pending";

  const [memberCounts, setMemberCounts] = useState({ activeReports: 0, resolvedReports: 0, adoptionApplications: 0 });
  useEffect(() => {
    let active = true;
    if (!account || isGuest || account.kind !== "user") {
      setMemberCounts({ activeReports: 0, resolvedReports: 0, adoptionApplications: 0 });
      return () => { active = false; };
    }
    Promise.all([
      repositories.reports.listByUser(account.id),
      repositories.adoptionApplications.listByApplicant(account.id),
    ]).then(([reports, applications]) => {
      if (!active) return;
      setMemberCounts({
        activeReports: reports.filter((item) => item.status !== "closed").length,
        resolvedReports: reports.filter((item) => item.status === "closed").length,
        adoptionApplications: applications.filter((item) => !["withdrawn", "rejected", "not_selected"].includes(item.status)).length,
      });
    }).catch(() => {
      if (active) setMemberCounts({ activeReports: 0, resolvedReports: 0, adoptionApplications: 0 });
    });
    return () => { active = false; };
  }, [account, isGuest]);

  const memberMetrics = useMemo<WorkspaceMetric[]>(() => [
    { key: "my-reports", label: "بلاغاتي النشطة", value: memberCounts.activeReports, icon: "megaphone-outline", color: COLORS.primaryStrong },
    { key: "resolved", label: "بلاغات مغلقة", value: memberCounts.resolvedReports, icon: "checkmark-circle-outline", color: COLORS.success },
    { key: "adoption-apps", label: "طلبات تبني جارية", value: memberCounts.adoptionApplications, icon: "heart-outline", color: COLORS.danger },
  ], [memberCounts]);
  const browseKind = isPendingOrganization ? "user" : accountKind;
  const common: HomeQuickAction[] = [
    { key: "create-report", label: "إرسال بلاغ", icon: "megaphone", color: COLORS.brown, iconBackgroundColor: COLORS.peach, onPress: () => router.push(ROUTES.createReport) },
    { key: "organizations", label: "الجمعيات", icon: "people", color: COLORS.text, iconBackgroundColor: COLORS.neutral, onPress: () => router.push(ROUTES.organizations) },
    { key: "clinics", label: "العيادات", icon: "medkit", color: COLORS.text, iconBackgroundColor: COLORS.neutral, onPress: () => router.push(veterinaryClinicsRoute(browseKind)) },
    { key: "feeding", label: "نقاط الإطعام", icon: "restaurant", color: COLORS.text, iconBackgroundColor: COLORS.lightgray, onPress: () => router.push(feedingPointsRoute(browseKind)) },
  ];
  const adoptionAction: HomeQuickAction = { key: "adoption", label: "التبني", icon: "heart", color: COLORS.text, iconBackgroundColor: `${COLORS.primary}24`, onPress: () => router.push(ROUTES.adoptionList) };
  const donationAction: HomeQuickAction = {
    key: "donations",
    label: "التبرعات",
    icon: "hand-left",
    color: COLORS.brown,
    iconBackgroundColor: COLORS.tan,
    onPress: () => router.push(donationsRoute(browseKind)),
  };
  const guestCommon = common.filter((action) => action.key !== "create-report");
  const quickActions: HomeQuickAction[] = isGuest
    ? [
        guestCommon[0],
        adoptionAction,
        { key: "articles", label: "المقالات", icon: "newspaper", color: COLORS.text, iconBackgroundColor: COLORS.neutral, onPress: () => router.push(articlesRoute(null)) },
        { key: "success-stories", label: "قصص النجاح", icon: "sparkles", color: COLORS.text, iconBackgroundColor: COLORS.primarySoft, onPress: () => router.push(successStoriesRoute(null)) },
        ...guestCommon.slice(1),
        donationAction,
      ]
    : isPendingOrganization
      ? [common[0], common[1], adoptionAction, ...common.slice(2), donationAction]
      : [common[0], { key: "my-reports", label: "بلاغاتي", icon: "clipboard", color: COLORS.success, iconBackgroundColor: `${COLORS.success}2A`, onPress: () => router.push(ROUTES.reports) }, common[1], adoptionAction, ...common.slice(2), donationAction];
  return { router, quickActions, isGuest, isPendingOrganization, memberMetrics };
}
