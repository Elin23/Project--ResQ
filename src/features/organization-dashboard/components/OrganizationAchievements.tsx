import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationAchievement } from "../types/organizationDashboard";

type Props = { items: OrganizationAchievement[] };

const TONES = {
  green: { backgroundColor: COLORS.orgAchievementGreenBg, borderColor: COLORS.orgAchievementGreenBorder, color: COLORS.secondary },
  orange: { backgroundColor: COLORS.orgAchievementOrangeBg, borderColor: COLORS.orgAchievementOrangeBorder, color: COLORS.primary },
  blue: { backgroundColor: COLORS.orgAchievementBlueBg, borderColor: COLORS.orgAchievementBlueBorder, color: COLORS.bgblue },
  locked: { backgroundColor: COLORS.orgAchievementLockedBg, borderColor: COLORS.orgAchievementLockedBorder, color: COLORS.disabled },
} as const;

export default function OrganizationAchievements({ items }: Props) {
  return (
    <View style={styles.row}>
      {items.map((item) => {
        const tone = TONES[item.tone];
        return (
          <View key={item.id} style={styles.item}>
            <View style={[styles.circle, { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }]}>
              <Ionicons name={item.icon} size={24} color={tone.color} />
              {item.tone !== "locked" ? (
                <AppText size={FONT_SIZES.label} weight="bold" color={tone.color}>{item.value}</AppText>
              ) : null}
            </View>
            <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted} style={styles.label}>{item.label}</AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: SPACING.xs },
  item: { flex: 1, alignItems: "center", gap: SPACING.xs },
  circle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { textAlign: "center", lineHeight: 17 },
});
