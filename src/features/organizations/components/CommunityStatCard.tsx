import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { value: string; label: string; icon: keyof typeof Ionicons.glyphMap; tone: "orange" | "green" | "blue" | "yellow" };

const toneMap = {
  orange: { background: COLORS.orgStatOrangeBg, border: COLORS.orgStatOrangeBorder, color: COLORS.brown },
  green: { background: COLORS.orgStatGreenBg, border: COLORS.orgStatGreenBorder, color: COLORS.successDark },
  blue: { background: COLORS.orgStatBlueBg, border: COLORS.orgStatBlueBorder, color: COLORS.bgblue },
  yellow: { background: COLORS.orgStatYellowBg, border: COLORS.orgStatYellowBorder, color: COLORS.primary },
};

export default function CommunityStatCard({ value, label, icon, tone }: Props) {
  const palette = toneMap[tone];
  return <View style={[styles.card, { backgroundColor: palette.background, borderColor: palette.border }]}>
    <Ionicons name={icon} size={24} color={palette.color} />
    <AppText weight="bold" size={26} color={palette.color}>{value}</AppText>
    <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>{label}</AppText>
  </View>;
}

const styles = StyleSheet.create({
  card: { width: "48%", minHeight: 106, borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: "flex-end", justifyContent: "center" },
});
