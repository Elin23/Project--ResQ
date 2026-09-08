import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import SelectionSheet from "@/src/components/ui/SelectionSheet";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

type LookupOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  placeholder: string;
  value?: string;
  selectedLabel?: string;
  options: LookupOption[];
  visible: boolean;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export default function LocationLookupSelect({
  label,
  placeholder,
  value,
  selectedLabel,
  options,
  visible,
  required = false,
  disabled = false,
  loading = false,
  error,
  onOpen,
  onClose,
  onSelect,
}: Props) {
  const display = selectedLabel || (loading ? "جاري التحميل..." : placeholder);
  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <AppText variant="label" weight="medium">{label}</AppText>
        {required ? <AppText variant="caption" color={COLORS.danger}>*</AppText> : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel || placeholder}`}
        accessibilityState={{ disabled, expanded: visible }}
        disabled={disabled || loading}
        onPress={onOpen}
        style={({ pressed }) => [
          styles.control,
          error && styles.controlError,
          (disabled || loading) && styles.controlDisabled,
          pressed && !(disabled || loading) && styles.pressed,
        ]}
      >
        <Ionicons name="location-outline" size={20} color={disabled ? COLORS.placeholder : COLORS.iconMuted} />
        <AppText style={[styles.value, !selectedLabel && styles.placeholder]} numberOfLines={1}>
          {display}
        </AppText>
        <Ionicons name="chevron-down-outline" size={18} color={disabled ? COLORS.placeholder : COLORS.iconMuted} />
      </Pressable>

      {error ? <AppText variant="caption" color={COLORS.danger}>{error}</AppText> : null}

      <SelectionSheet
        visible={visible}
        title={`اختيار ${label}`}
        options={options}
        selectedValue={value}
        onSelect={onSelect}
        onClose={onClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: SPACING.xs },
  labelRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: 4 },
  control: {
    minHeight: 52,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
  },
  controlError: { borderColor: COLORS.danger },
  controlDisabled: { opacity: 0.62, backgroundColor: COLORS.surfaceSubtle },
  value: { flex: 1, minWidth: 0, textAlign: "right", color: COLORS.textPrimary },
  placeholder: { color: COLORS.placeholder },
  pressed: { opacity: 0.78 },
});
