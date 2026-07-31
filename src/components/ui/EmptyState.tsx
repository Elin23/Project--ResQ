import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Button from "./Button";

type Props = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onActionPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function EmptyState({
  title,
  description,
  icon = "file-tray-outline",
  actionTitle,
  onActionPress,
  compact = false,
  style,
}: Props) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={compact ? 26 : 32} color={COLORS.primary} />
      </View>
      <AppText weight="bold" size={FONT_SIZES.title} align="center">
        {title}
      </AppText>
      {description ? (
        <AppText color={COLORS.textSecondary} align="center" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {actionTitle && onActionPress ? (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          size="medium"
          fullWidth={false}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.lightgray,
  },
  compact: {
    minHeight: 180,
    padding: SPACING.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    marginBottom: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}1A`,
  },
  description: {
    maxWidth: 320,
    marginTop: SPACING.sm,
    lineHeight: 23,
  },
  action: {
    marginTop: SPACING.lg,
  },
});
