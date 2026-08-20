import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { COLORS, ICON_SIZES, RADIUS, SHADOWS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import { useResponsiveLayout } from "./useResponsiveLayout";

type SelectionOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: SelectionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function SelectionSheet({ visible, title, options, selectedValue, onSelect, onClose }: Props) {
  const { isNarrow } = useResponsiveLayout();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={onClose} />
        <View accessibilityViewIsModal style={[styles.sheet, isNarrow && styles.sheetNarrow]}>
          <View style={styles.header}>
            <AppText accessibilityRole="header" variant="h3" weight="bold">{title}</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="إغلاق" onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={ICON_SIZES.md} color={COLORS.icon} />
            </Pressable>
          </View>
          <View style={styles.options}>
            {options.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityLabel={option.description ? `${option.label}، ${option.description}` : option.label}
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
                >
                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={ICON_SIZES.md}
                    color={selected ? COLORS.primaryStrong : COLORS.iconMuted}
                  />
                  <View style={styles.copy}>
                    <AppText variant="body" weight={selected ? "bold" : "medium"}>{option.label}</AppText>
                    {option.description ? <AppText variant="caption" color={COLORS.textSecondary}>{option.description}</AppText> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.backdrop,
  },
  sheet: {
    width: "100%",
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  sheetNarrow: { padding: SPACING.md },
  header: {
    minHeight: 44,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  closeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  options: { gap: SPACING.xs },
  option: {
    minHeight: 52,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  optionSelected: { borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft },
  copy: { flex: 1, minWidth: 0, gap: SPACING.xxs },
  pressed: { opacity: 0.72 },
});
