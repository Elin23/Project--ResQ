import { Tabs } from "expo-router";

import FloatingGlassTabBar from "@/src/components/ui/FloatingGlassTabBar";
import { FloatingNavigationProvider } from "@/src/components/ui/FloatingNavigationContext";

const ORGANIZATION_TABS = {
  "(home)": { label: "الرئيسية", icon: "home-outline", iconFocused: "home" },
  "(tasks)": { label: "المهام", icon: "clipboard-outline", iconFocused: "clipboard" },
  "(map)": { label: "الخريطة", icon: "map-outline", iconFocused: "map" },
  "(notifications)": { label: "التنبيهات", icon: "notifications-outline", iconFocused: "notifications" },
  "(profile)": { label: "حسابي", icon: "person-outline", iconFocused: "person" },
} as const;

export default function OrganizationTabsLayout() {
  return (
    <FloatingNavigationProvider>
      <Tabs
        tabBar={(props) => <FloatingGlassTabBar {...props} tabs={ORGANIZATION_TABS} />}
        screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      >
        <Tabs.Screen name="(home)" options={{ title: "الرئيسية" }} />
        <Tabs.Screen name="(tasks)" options={{ title: "المهام" }} />
        <Tabs.Screen name="(map)" options={{ title: "الخريطة" }} />
        <Tabs.Screen name="(notifications)" options={{ title: "التنبيهات" }} />
        <Tabs.Screen name="(profile)" options={{ title: "حسابي" }} />
      </Tabs>
    </FloatingNavigationProvider>
  );
}
