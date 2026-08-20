import { Tabs } from "expo-router";

import FloatingGlassTabBar from "@/src/components/ui/FloatingGlassTabBar";
import { FloatingNavigationProvider } from "@/src/components/ui/FloatingNavigationContext";
import { useSession } from "@/src/features/session/SessionContext";

const USER_TABS = {
  "(home)": { label: "الرئيسية", icon: "home-outline", iconFocused: "home" },
  "(adoption)": { label: "استكشاف", icon: "compass-outline", iconFocused: "compass" },
  "(map)": { label: "الخريطة", icon: "map-outline", iconFocused: "map" },
  "(notifications)": { label: "التنبيهات", icon: "notifications-outline", iconFocused: "notifications" },
  "(profile)": { label: "حسابي", icon: "person-outline", iconFocused: "person" },
} as const;

const GUEST_TABS = {
  "(home)": USER_TABS["(home)"],
  "(adoption)": USER_TABS["(adoption)"],
  "(map)": USER_TABS["(map)"],
} as const;

export default function UserTabsLayout() {
  const { isGuest, account } = useSession();
  const isPendingOrganization = account?.kind === "organization" && account.status === "pending";
  const tabs = isPendingOrganization
    ? { "(home)": USER_TABS["(home)"], "(map)": USER_TABS["(map)"], "(notifications)": USER_TABS["(notifications)"] }
    : isGuest ? GUEST_TABS : USER_TABS;

  return (
    <FloatingNavigationProvider>
      <Tabs
        tabBar={(props) => <FloatingGlassTabBar {...props} tabs={tabs} />}
        screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      >
        <Tabs.Screen name="(home)" options={{ title: "الرئيسية" }} />
        <Tabs.Screen name="(adoption)" options={{ href: isPendingOrganization ? null : undefined, title: "استكشاف" }} />
        <Tabs.Screen name="(map)" options={{ title: "الخريطة" }} />
        <Tabs.Screen name="(notifications)" options={{ href: isGuest ? null : undefined, title: "التنبيهات" }} />
        <Tabs.Screen name="(profile)" options={{ href: isGuest || isPendingOrganization ? null : undefined, title: "حسابي" }} />
      </Tabs>
    </FloatingNavigationProvider>
  );
}
