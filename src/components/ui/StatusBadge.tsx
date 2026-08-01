import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  label: string;
  /** لون النص والأيقونة — بيجي من خريطة حالات الفيتشر */
  color?: string;
  /** خلفية مخصصة، وإلا بتنشتق من color بشفافية */
  background?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** نقطة ملونة صغيرة بدل الأيقونة */
  dot?: boolean;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
};

const ALPHA_SOFT = "22";

export default function StatusBadge({
  label,
  color = COLORS.text,
  background,
  icon,
  dot = false,
  size = "md",
  style,
}: Props) {
  const isSmall = size === "sm";
  const backgroundColor = background ?? color + ALPHA_SOFT;

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.sm : styles.md,
        { backgroundColor },
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: color }]} />}
      {icon && !dot && (
        <Ionicons name={icon} size={isSmall ? 12 : 14} color={color} />
      )}
      <AppText
        weight="medium"
        size={isSmall ? FONT_SIZES.caption : FONT_SIZES.label}
        color={color}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
  },
  md: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
