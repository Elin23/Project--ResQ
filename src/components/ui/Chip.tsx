import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { COLORS, DENSITY, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";


function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function luminance(hex: string) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const raw = match[1];
  const r = channel(Number.parseInt(raw.slice(0, 2), 16));
  const g = channel(Number.parseInt(raw.slice(2, 4), 16));
  const b = channel(Number.parseInt(raw.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(first: string, second: string) {
  const a = luminance(first);
  const b = luminance(second);
  if (a == null || b == null) return null;
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableContentColor(background: string) {
  const inverseRatio = contrastRatio(background, COLORS.textInverse);
  const textRatio = contrastRatio(background, COLORS.text);
  if (inverseRatio == null || textRatio == null) return COLORS.textInverse;
  return textRatio > inverseRatio ? COLORS.text : COLORS.textInverse;
}

type Props = {
  label: string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  soft?: boolean;
  selected?: boolean;
  onPress?: () => void;
};

export default function Chip({ label, color = COLORS.primaryStrong, icon, soft = false, selected, onPress }: Props) {
  const isFilled = onPress ? selected : !soft;
  const backgroundColor = isFilled ? color : `${color}16`;
  const contentColor = isFilled ? readableContentColor(color) : color;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={label}
      accessibilityState={onPress ? { selected: Boolean(selected) } : undefined}
      accessibilityHint={onPress ? (selected ? "محدد حاليًا" : "اضغط للتحديد") : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.chip, onPress && styles.interactive, { backgroundColor }, pressed && onPress && styles.pressed]}
    >
      {icon ? <Ionicons name={icon} size={ICON_SIZES.xs} color={contentColor} /> : null}
      <AppText variant="label" color={contentColor}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: SPACING.xs,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  interactive: { minHeight: DENSITY.touchTargetMin },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
});
