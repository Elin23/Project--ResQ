import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = {
  onHome: () => void;
  onTasks: () => void;
  onMap: () => void;
  onNotifications: () => void;
  onProfile: () => void;
};

const ITEMS = [
  { id: "home", label: "الرئيسية", icon: "home" as const },
  { id: "tasks", label: "المهام", icon: "clipboard-outline" as const },
  { id: "map", label: "الخريطة", icon: "map-outline" as const },
  { id: "notifications", label: "التنبيهات", icon: "notifications-outline" as const },
  { id: "profile", label: "حسابي", icon: "person-outline" as const },
];

export default function OrganizationBottomNavigation({ onHome, onTasks, onMap, onNotifications, onProfile }: Props) {
  const handlers = { home: onHome, tasks: onTasks, map: onMap, notifications: onNotifications, profile: onProfile };
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const active = item.id === "home";
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={handlers[item.id as keyof typeof handlers]}
            style={({ pressed }) => [styles.item, active && styles.activeItem, pressed && styles.pressed]}
          >
            <Ionicons name={item.icon} size={21} color={active ? COLORS.brownDark : COLORS.brownMuted} />
            <AppText size={FONT_SIZES.caption} color={active ? COLORS.brownDark : COLORS.brownMuted} weight={active ? "bold" : "regular"}>
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.tan,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.white,
  },
  item: {
    minWidth: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  activeItem: { backgroundColor: COLORS.primary },
  pressed: { opacity: 0.72 },
});
