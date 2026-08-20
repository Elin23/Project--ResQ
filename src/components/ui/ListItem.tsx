import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, DENSITY, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};
export default function ListItem({ title, subtitle, leading, trailing, icon, onPress, accessibilityLabel, style }: Props) {
  return (
    <Pressable accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={accessibilityLabel ?? title} disabled={!onPress} onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}>
      {leading ?? (icon ? <View style={styles.icon}><Ionicons name={icon} size={ICON_SIZES.md} color={COLORS.primaryStrong} /></View> : null)}
      <View style={styles.content}><AppText variant="body" weight="medium" numberOfLines={2} style={styles.text}>{title}</AppText>{subtitle ? <AppText variant="bodySmall" color={COLORS.textSecondary} numberOfLines={2} style={styles.text}>{subtitle}</AppText> : null}</View>
      {trailing}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: { minHeight: DENSITY.touchTargetMin + 12, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md },
  pressed: { backgroundColor: COLORS.surfaceMuted },
  icon: { width: 38, height: 38, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, gap: SPACING.xs, minWidth: 0, alignItems: "stretch" },
  text: { width: "100%" },
});
