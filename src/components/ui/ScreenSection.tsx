import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { LAYOUT, SPACING } from "@/src/theme";
import SectionHeader from "./SectionHeader";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/** Canonical vertical section rhythm for Arabic product screens. */
export default function ScreenSection({
  children,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  gap = LAYOUT.cardGap,
  style,
}: Props) {
  return (
    <View style={[styles.section, { gap }, style]}>
      {title ? (
        <SectionHeader
          title={title}
          subtitle={subtitle}
          actionLabel={actionLabel}
          onActionPress={onActionPress}
          style={styles.header}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: "100%", alignItems: "stretch" },
  header: { marginBottom: SPACING.xs },
});
