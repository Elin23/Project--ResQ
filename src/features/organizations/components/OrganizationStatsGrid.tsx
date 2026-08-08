import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { Organization } from "../types/organization";

export default function OrganizationStatsGrid({ organization }: { organization: Organization }) {
  const stats = [
    { value: organization.successfulCases.toLocaleString("en-US"), label: "عمليات الإنقاذ", color: COLORS.brown },
    { value: organization.animalsTreated.toLocaleString("en-US"), label: "حيوانات متبناة", color: COLORS.successDark },
    { value: organization.volunteers.toLocaleString("en-US"), label: "متطوع نشط", color: COLORS.bgblue },
    { value: organization.activeRescues.toLocaleString("en-US"), label: "حملة نشطة", color: COLORS.primary },
  ];
  return <View style={styles.grid}>{stats.map((stat) => <View key={stat.label} style={styles.card}><AppText weight="bold" size={28} color={stat.color}>{stat.value}</AppText><AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>{stat.label}</AppText></View>)}</View>;
}
const styles = StyleSheet.create({
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", justifyContent: "space-between", gap: SPACING.md },
  card: { width: "47.5%", minHeight: 90, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
});
