import { useRouter } from "expo-router";
import { COLORS } from "@/src/theme";
import { ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import type { HomeQuickAction } from "../constants/home";

export function useHomeScreen() {
  const router = useRouter();
  const { isGuest } = useSession();
  const common: HomeQuickAction[] = [
    { key: "create-report", label: "إرسال بلاغ", icon: "megaphone", color: COLORS.brown, iconBackgroundColor: COLORS.peach, onPress: () => router.push(ROUTES.createReport) },
    { key: "organizations", label: "الجمعيات", icon: "people", color: COLORS.text, iconBackgroundColor: COLORS.neutral, onPress: () => router.push(ROUTES.organizations) },
    { key: "adoption", label: "التبني", icon: "heart", color: COLORS.text, iconBackgroundColor: `${COLORS.primary}24`, onPress: () => router.push(ROUTES.adoptionList) },
    { key: "clinics", label: "العيادات", icon: "medkit", color: COLORS.text, iconBackgroundColor: COLORS.neutral, onPress: () => router.push(ROUTES.search) },
    { key: "feeding", label: "نقاط الإطعام", icon: "restaurant", color: COLORS.text, iconBackgroundColor: COLORS.lightgray, onPress: () => router.push(ROUTES.map) },
  ];
  const quickActions: HomeQuickAction[] = isGuest
    ? [...common, { key: "donations", label: "التبرعات", icon: "hand-left", color: COLORS.brown, iconBackgroundColor: COLORS.tan, onPress: () => router.push(ROUTES.donations) }]
    : [common[0], { key: "my-reports", label: "بلاغاتي", icon: "clipboard", color: COLORS.success, iconBackgroundColor: `${COLORS.success}2A`, onPress: () => router.push(ROUTES.reports) }, ...common.slice(1, 5)];
  return { router, quickActions, isGuest };
}
