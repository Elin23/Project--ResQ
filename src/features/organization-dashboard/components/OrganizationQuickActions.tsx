import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { onReportsPress: () => void };

const ACTIONS = [
  { id: "incoming", label: "البلاغات الواردة", icon: "notifications-outline" as const },
  { id: "missions", label: "مهام الإنقاذ", icon: "clipboard-outline" as const },
];

export default function OrganizationQuickActions({ onReportsPress }: Props) {
  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={onReportsPress}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          <View style={styles.iconTile}>
            <Ionicons name={action.icon} size={26} color={COLORS.brown} />
          </View>
          <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted}>{action.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: SPACING.sm, marginVertical: SPACING.sm },
  item: { flex: 1, alignItems: "center", gap: SPACING.sm },
  iconTile: {
    width: "100%",
    minHeight: 78,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.darkgray,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
});
