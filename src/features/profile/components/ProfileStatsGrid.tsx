import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { ProfileStat } from "../types/profile";

export default function ProfileStatsGrid({ stats }: { stats: ProfileStat[] }) {
  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.card}>
          <AppText variant="h3" weight="bold" align="center" style={{ color: stat.color }}>{stat.value}</AppText>
          <AppText variant="caption" align="center" color={COLORS.textSecondary}>{stat.label}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  card: { flexGrow: 1, flexBasis: "46%", minHeight: 70, alignItems: "center", justifyContent: "center", gap: SPACING.xs, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg },
});
