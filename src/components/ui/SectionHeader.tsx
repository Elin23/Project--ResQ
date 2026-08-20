import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="h3" weight="bold">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={COLORS.textSecondary}>{subtitle}</AppText>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onActionPress} hitSlop={8} style={styles.action}>
          <AppText variant="bodySmall" weight="medium" color={COLORS.primaryStrong}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  copy: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xxs },
  action: { flexShrink: 0, alignSelf: "flex-start" },
});
