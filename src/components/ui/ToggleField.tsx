import { StyleSheet, Switch, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/** Canonical binary control with an unmistakable ON/OFF state. */
export default function ToggleField({ label, description, value, onValueChange, disabled = false }: Props) {
  return (
    <View style={[styles.container, value && styles.containerOn, disabled && styles.disabled]}>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <AppText variant="body" weight="bold">{label}</AppText>
          <View style={[styles.statePill, value ? styles.statePillOn : styles.statePillOff]}>
            <AppText variant="caption" weight="bold" color={value ? COLORS.successDark : COLORS.textMuted}>
              {value ? "مفعّل" : "غير مفعّل"}
            </AppText>
          </View>
        </View>
        {description ? <AppText variant="bodySmall" color={COLORS.textSecondary}>{description}</AppText> : null}
      </View>
      <Switch
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value, disabled }}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.borderStrong, true: COLORS.success }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.borderStrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
  },
  containerOn: { borderColor: COLORS.success, backgroundColor: COLORS.successSoft },
  copy: { flex: 1, minWidth: 0, gap: SPACING.xxs },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  statePill: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xxs, borderRadius: RADIUS.full },
  statePillOn: { backgroundColor: COLORS.successLight },
  statePillOff: { backgroundColor: COLORS.surfaceMuted },
  disabled: { opacity: 0.5 },
});
