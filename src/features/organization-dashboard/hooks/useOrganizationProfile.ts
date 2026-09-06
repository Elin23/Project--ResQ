import { useMemo } from "react";
import { useRouter, type Href } from "expo-router";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { organizationDetailsRoute, ROUTES } from "@/src/navigation/routes";
import {
  ORGANIZATION_PROFILE_STATS,
  ORGANIZATION_PUBLIC_PROFILE_ID,
  organizationProfileSections,
} from "../constants/organizationProfile";

export function useOrganizationProfile() {
  const router = useRouter();
  const { account, signOut } = useSession();
  const { showFeedback } = useFeedback();

  const sections = useMemo(() => organizationProfileSections(ORGANIZATION_PUBLIC_PROFILE_ID), []);

  const handleItemPress = (route?: Href, label?: string) => {
    if (route) return router.push(route);
    showFeedback({
      title: label ?? "إعدادات الجمعية",
      message: "ستتوفر إعدادات الفريق والبيانات التنظيمية من هذه المساحة.",
      tone: "info",
    });
  };

  return {
    name: account?.displayName ?? "جمعية الرفق بالحيوان",
    stats: ORGANIZATION_PROFILE_STATS,
    sections,
    handleItemPress,
    openPublicProfile: () => router.push(organizationDetailsRoute(ORGANIZATION_PUBLIC_PROFILE_ID)),
    logout: async () => {
      await signOut();
      router.replace(ROUTES.login);
    },
  };
}
