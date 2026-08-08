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

import { COLORS, FONTS, FONT_SIZES, SPACING } from "@/src/theme";
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
};

const variantConfig: Record<
  Exclude<ButtonVariant, "custom">,
  {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textColor: string;
  }
> = {
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 0,
    textColor: COLORS.onColor,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
    borderWidth: 0,
    textColor: COLORS.onColor,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    textColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
    borderWidth: 0,
    textColor: COLORS.onColor,
  },
  text: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    textColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    textColor: COLORS.primary,
  },
};

const sizeConfig: Record<
  ButtonSize,
  {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: number;
    iconSize: number;
  }
> = {
  small: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.label,
    iconSize: 18,
  },
  medium: {
    minHeight: 48,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    fontSize: FONT_SIZES.body,
    iconSize: 20,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.title,
    iconSize: 22,
  },
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "large",
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
  radius = 16,
  style,
  textStyle,
  accessibilityLabel,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const isInactive = loading || disabled;
  const dimensions = sizeConfig[size] ?? sizeConfig.large;

  const selectedVariant =
    variant === "custom"
      ? {
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
          textColor: COLORS.text,
        }
      : (variantConfig[variant] ?? variantConfig.primary);

  const resolvedBackgroundColor =
    backgroundColor ?? selectedVariant.backgroundColor;

  const resolvedBorderColor = borderColor ?? selectedVariant.borderColor;

  const resolvedBorderWidth = borderWidth ?? selectedVariant.borderWidth;

  const resolvedTextColor = isInactive
    ? COLORS.textSecondary
    : (textColor ?? selectedVariant.textColor);

  const resolvedIconSize = iconSize ?? dimensions.iconSize;

  const content = (
    <>
      {loading && <ActivityIndicator size="small" color={resolvedTextColor} />}

      {!loading && icon && iconPosition === "start" && (
        <Ionicons
          name={icon}
          size={resolvedIconSize}
          color={resolvedTextColor}
        />
      )}

      <AppText
        numberOfLines={1}
        style={[
          styles.label,
          {
            color: resolvedTextColor,
            fontSize: dimensions.fontSize,
          },
          textStyle,
        ]}
      >
        {loading ? loadingText : title}
      </AppText>

      {!loading && icon && iconPosition === "end" && (
        <Ionicons
          name={icon}
          size={resolvedIconSize}
          color={resolvedTextColor}
        />
      )}
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        disabled: isInactive,
        busy: loading,
      }}
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
          paddingVertical: dimensions.paddingVertical,
          backgroundColor: isInactive
            ? COLORS.neutral
            : resolvedBackgroundColor,
          borderColor: isInactive ? COLORS.neutral : resolvedBorderColor,
          borderWidth: resolvedBorderWidth,
          borderRadius: radius,
        },
        Platform.OS === "web" && hovered && !isInactive && styles.hovered,
        pressed && !isInactive && styles.pressed,
        variant === "text" && styles.textButton,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    overflow: Platform.OS === "web" ? "visible" : "hidden",
  },
  label: {
    flexShrink: 1,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
  hovered: {
    opacity: 0.92,
    transform: [{ translateY: -2 }],
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  textButton: {
    minHeight: 0,
  },
});
