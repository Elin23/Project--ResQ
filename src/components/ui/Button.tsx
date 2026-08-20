import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

import {
  COLORS,
  CONTROL_SIZES,
  ICON_SIZES,
  RADIUS,
  SHADOWS,
  SPACING,
} from "@/src/theme";
import AppText from "./AppText";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "text"
  | "ghost"
  | "custom";
type ButtonSize = "small" | "medium" | "large";
type IconPosition = "start" | "end";

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: IconPosition;
  iconSize?: number;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  numberOfLines?: number;
};

const variantConfig: Record<
  Exclude<ButtonVariant, "custom">,
  { backgroundColor: string; borderColor: string; borderWidth: number; textColor: string }
> = {
  primary: { backgroundColor: COLORS.primaryStrong, borderColor: COLORS.primaryStrong, borderWidth: 0, textColor: COLORS.textInverse },
  secondary: { backgroundColor: COLORS.secondaryStrong, borderColor: COLORS.secondaryStrong, borderWidth: 0, textColor: COLORS.textInverse },
  outline: { backgroundColor: COLORS.transparent, borderColor: COLORS.primary, borderWidth: 1, textColor: COLORS.primaryStrong },
  danger: { backgroundColor: COLORS.danger, borderColor: COLORS.danger, borderWidth: 0, textColor: COLORS.textInverse },
  text: { backgroundColor: COLORS.transparent, borderColor: COLORS.transparent, borderWidth: 0, textColor: COLORS.primaryStrong },
  ghost: { backgroundColor: COLORS.transparent, borderColor: COLORS.transparent, borderWidth: 0, textColor: COLORS.textSecondary },
};

const sizeConfig: Record<ButtonSize, { minHeight: number; paddingHorizontal: number; fontVariant: "label" | "body"; iconSize: number }> = {
  small: { minHeight: CONTROL_SIZES.buttonSmall, paddingHorizontal: SPACING.md, fontVariant: "label", iconSize: ICON_SIZES.sm },
  medium: { minHeight: CONTROL_SIZES.buttonMedium, paddingHorizontal: SPACING.lg, fontVariant: "label", iconSize: ICON_SIZES.md },
  large: { minHeight: CONTROL_SIZES.buttonLarge, paddingHorizontal: SPACING.xl, fontVariant: "body", iconSize: ICON_SIZES.md },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "start",
  iconSize,
  loading = false,
  loadingText = "جاري المعالجة...",
  disabled = false,
  fullWidth = true,
  backgroundColor,
  borderColor,
  borderWidth,
  textColor,
  radius = RADIUS.md,
  style,
  textStyle,
  accessibilityLabel,
  numberOfLines = 2,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const isInactive = loading || disabled;
  const dimensions = sizeConfig[size];
  const selectedVariant = variant === "custom"
    ? { backgroundColor: COLORS.transparent, borderColor: COLORS.transparent, borderWidth: 0, textColor: COLORS.text }
    : variantConfig[variant];

  const resolvedBackgroundColor = backgroundColor ?? selectedVariant.backgroundColor;
  const resolvedBorderColor = borderColor ?? selectedVariant.borderColor;
  const resolvedBorderWidth = borderWidth ?? selectedVariant.borderWidth;
  const resolvedTextColor = isInactive ? COLORS.textMuted : (textColor ?? selectedVariant.textColor);
  const resolvedIconSize = iconSize ?? dimensions.iconSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      onHoverIn={Platform.OS === "web" ? () => setHovered(true) : undefined}
      onHoverOut={Platform.OS === "web" ? () => setHovered(false) : undefined}
      style={({ pressed }) => [
        styles.base,
        {
          width: fullWidth ? "100%" : undefined,
          minHeight: dimensions.minHeight,
          paddingHorizontal: dimensions.paddingHorizontal,
          backgroundColor: isInactive ? COLORS.disabledSurface : resolvedBackgroundColor,
          borderColor: isInactive ? COLORS.border : resolvedBorderColor,
          borderWidth: resolvedBorderWidth,
          borderRadius: radius,
        },
        Platform.OS === "web" && hovered && !isInactive && styles.hovered,
        pressed && !isInactive && styles.pressed,
        (variant === "text" || variant === "ghost") && styles.inlineButton,
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={resolvedTextColor} /> : null}
      {!loading && icon && iconPosition === "start" ? <Ionicons name={icon} size={resolvedIconSize} color={resolvedTextColor} /> : null}
      <AppText variant={dimensions.fontVariant} weight="medium" numberOfLines={numberOfLines} align="center" color={resolvedTextColor} style={[styles.label, textStyle]}>
        {loading ? loadingText : title}
      </AppText>
      {!loading && icon && iconPosition === "end" ? <Ionicons name={icon} size={resolvedIconSize} color={resolvedTextColor} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "center",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    overflow: Platform.OS === "web" ? "visible" : "hidden",
  },
  hovered: { opacity: 0.96, transform: [{ translateY: -1 }], ...SHADOWS.sm },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  inlineButton: { minHeight: CONTROL_SIZES.buttonSmall },
  label: { flexShrink: 1, minWidth: 0, textAlign: "center", writingDirection: "rtl" },
});
