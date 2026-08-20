import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { Organization } from "../types/organization";

export default function OrganizationStatsGrid({ organization }: { organization: Organization }) {
  const { isNarrow } = useResponsiveLayout();
  const stats = [
    { value: organization.successfulCases.toLocaleString("en-US"), label: "عمليات الإنقاذ", color: COLORS.brown },
    { value: organization.animalsTreated.toLocaleString("en-US"), label: "حيوانات متبناة", color: COLORS.successDark },
    { value: organization.volunteers.toLocaleString("en-US"), label: "متطوع نشط", color: COLORS.bgblue },
    { value: organization.activeRescues.toLocaleString("en-US"), label: "حملة نشطة", color: COLORS.primary },
  ];
  return <View style={styles.grid}>{stats.map((stat) => <View key={stat.label} style={[styles.card, isNarrow && styles.cardNarrow]}><AppText variant="h1" weight="bold" color={stat.color}>{stat.value}</AppText><AppText variant="label" color={COLORS.textSecondary} numberOfLines={2} style={styles.label}>{stat.label}</AppText></View>)}</View>;
}
const styles = StyleSheet.create({
  grid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", justifyContent: "space-between", gap: SPACING.md },
  card: { width: "47.5%", minHeight: 90, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
  cardNarrow: { minHeight: 82 },
  label: { textAlign: "center", paddingHorizontal: SPACING.xs },
});
