import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { COLORS, DENSITY, ICON_SIZES, LAYOUT, RADIUS, SHADOWS, SPACING } from "@/src/theme";
import { useFloatingNavigation } from "./FloatingNavigationContext";

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/**
 * Shell-aware quick-report action.
 *
 * The FAB lives at the screen layer (not inside ScrollView content) and derives
 * its vertical position from the floating navigation metrics. This guarantees
 * a stable gap above the glass tab bar across safe-area sizes and devices.
 */
export default function QuickReportFab({ onPress, accessibilityLabel = "إنشاء بلاغ جديد" }: Props) {
  const { overlay, quickActionBottomOffset } = useFloatingNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.fab,
        { bottom: overlay ? quickActionBottomOffset : SPACING.xl },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="add" size={ICON_SIZES.xl} color={COLORS.textInverse} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    left: LAYOUT.screenPadding,
    zIndex: 70,
    width: 54,
    height: 54,
    minWidth: DENSITY.touchTargetMin,
    minHeight: DENSITY.touchTargetMin,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.52)",
    ...SHADOWS.md,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
