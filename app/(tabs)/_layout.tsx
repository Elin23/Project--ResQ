import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import TopBar from "@/src/components/ui/TopBar";
import { COLORS, FONT_SIZES, RADIUS } from "@/src/theme";

type IconName = keyof typeof Ionicons.glyphMap;

type TabIconProps = {
  focused: boolean;
  color: string;
  name: IconName;
};

type TabLabelProps = {
  focused: boolean;
  color: string;
  children: string;
};

function TabIcon({ focused, color, name }: TabIconProps) {
  return (
    <View style={focused ? styles.activeIconPill : styles.iconWrap}>
      <Ionicons name={name} size={22} color={focused ? COLORS.white : color} />
    </View>
  );
}

function TabLabel({ focused, color, children }: TabLabelProps) {
  return (
    <AppText
      weight={focused ? "bold" : "regular"}
      size={FONT_SIZES.caption}
      color={color}
      style={styles.label}
    >
      {children}
    </AppText>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleNotificationsPress = () => {
    Alert.alert("الإشعارات", "صفحة الإشعارات ستتم إضافتها وربطها لاحقاً.");
  };

  return (
    <Tabs
      screenOptions={{
        header: () => (
          <TopBar
            onSearchPress={handleSearchPress}
            onNotificationsPress={handleNotificationsPress}
          />
        ),
        tabBarActiveTintColor: COLORS.brownDark,
        tabBarInactiveTintColor: COLORS.text,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: "#DDC1B3",
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          height: 73 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,
        },
        tabBarIconStyle: {
          width: 44,
          height: 36,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              الرئيسية
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="adoption"
        options={{
          title: "استكشاف",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? "compass" : "compass-outline"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              استكشاف
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "الخريطة",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? "map" : "map-outline"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              الخريطة
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "المزيد",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={
                focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"
              }
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              المزيد
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          href: null,
          title: "البلاغات",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null,
          headerShown: false,
          title: "البحث",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingVertical: 6,
  },
  activeIconPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  label: {
    marginTop: 4,
  },
});
