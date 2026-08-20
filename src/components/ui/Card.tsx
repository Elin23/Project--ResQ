import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { COLORS, DENSITY, RADIUS, SHADOWS } from "@/src/theme";

type Elevation = "none" | "sm" | "md";
type Props = PressableProps & {
  children: React.ReactNode;
  padding?: number;
  radius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean;
  elevation?: Elevation;
  style?: StyleProp<ViewStyle>;
};

export default function Card({
  children,
  padding = DENSITY.cardPadding,
  radius = RADIUS.lg,
  backgroundColor = COLORS.surfaceElevated,
  borderColor = COLORS.border,
  borderWidth = 1,
  shadow = false,
  elevation,
  style,
  disabled,
  ...props
}: Props) {
  const resolvedElevation: Elevation = elevation ?? (shadow ? "sm" : "none");
  const interactive = typeof props.onPress === "function" && !disabled;

  return (
    <Pressable
      accessibilityRole={interactive ? (props.accessibilityRole ?? "button") : props.accessibilityRole}
      accessibilityState={interactive || disabled ? { ...(props.accessibilityState ?? {}), disabled: Boolean(disabled) } : props.accessibilityState}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        resolvedElevation === "sm" && SHADOWS.sm,
        resolvedElevation === "md" && SHADOWS.md,
        { padding, borderRadius: radius, backgroundColor, borderColor, borderWidth },
        pressed && interactive && styles.pressed,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", overflow: "hidden", direction: "rtl" },
  pressed: { opacity: 0.94, transform: [{ scale: 0.995 }] },
});
