import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function LoadingState({ label = "جاري التحميل...", style }: Props) {
  return (
    <View accessibilityRole="progressbar" style={[styles.container, style]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <AppText color={COLORS.textSecondary} align="center" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  label: {
    marginTop: SPACING.md,
  },
});
