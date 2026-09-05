import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { COLORS, CONTROL_SIZES, DENSITY, ICON_SIZES, RADIUS } from "@/src/theme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  color?: string;
  disabled?: boolean;
  /** لأزرار التبديل (مفضلة، حفظ…) — بتنقال لقارئ الشاشة كحالة مختارة */
  selected?: boolean;
  hitSlop?: number;
  contained?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = ICON_SIZES.md,
  color = COLORS.icon,
  disabled = false,
  selected,
  hitSlop = 8,
  contained = false,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      hitSlop={hitSlop}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        contained && styles.contained,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: CONTROL_SIZES.iconButton,
    height: CONTROL_SIZES.iconButton,
    minWidth: DENSITY.touchTargetMin,
    minHeight: DENSITY.touchTargetMin,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  contained: { backgroundColor: COLORS.surfaceMuted },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.4 },
});
