import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: "default" | "soft";
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Compact label/value pair tuned for Arabic detail pages. */
export default function DetailRow({ label, value, icon, tone = "default", valueColor, style }: Props) {
  return (
    <View style={[styles.row, tone === "soft" && styles.soft, style]}>
      {icon ? (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={COLORS.iconMuted} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <AppText variant="caption" color={COLORS.textMuted}>{label}</AppText>
        <AppText variant="body" weight="medium" color={valueColor ?? COLORS.text}>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  soft: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
    gap: SPACING.xxs,
  },
});
