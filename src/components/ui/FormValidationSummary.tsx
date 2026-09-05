import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  errors: string[];
  title?: string;
};

export default function FormValidationSummary({ errors, title = "راجع البيانات التالية" }: Props) {
  if (!errors.length) return null;

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
        <AppText variant="label" weight="bold" color={COLORS.danger}>{title}</AppText>
      </View>
      <View style={styles.list}>
        {errors.map((error) => (
          <View key={error} style={styles.item}>
            <View style={styles.dot} />
            <AppText variant="caption" color={COLORS.danger} style={styles.copy}>{error}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerSoft,
    gap: SPACING.sm,
  },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  list: { gap: SPACING.xs },
  item: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.sm },
  dot: { width: 5, height: 5, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerFill, marginTop: SPACING.sm },
  copy: { flex: 1, minWidth: 0 },
});
