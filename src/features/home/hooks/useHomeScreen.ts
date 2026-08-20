import { useRouter } from "expo-router";
import { COLORS } from "@/src/theme";
import { donationsRoute, feedingPointsRoute, veterinaryClinicsRoute, ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import type { HomeQuickAction } from "../constants/home";

export function useHomeScreen() {
  const router = useRouter();
  const { isGuest, account, accountKind } = useSession();
  const isPendingOrganization = account?.kind === "organization" && account.status === "pending";
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
  const quickActions: HomeQuickAction[] = isGuest || isPendingOrganization
    ? [common[0], common[1], adoptionAction, ...common.slice(2), donationAction]
    : [common[0], { key: "my-reports", label: "بلاغاتي", icon: "clipboard", color: COLORS.success, iconBackgroundColor: `${COLORS.success}2A`, onPress: () => router.push(ROUTES.reports) }, common[1], adoptionAction, ...common.slice(2), donationAction];
  return { router, quickActions, isGuest, isPendingOrganization };
}
