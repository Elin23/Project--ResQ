import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { SPACING } from "@/src/theme";
import SectionHeader from "./SectionHeader";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Arabic-first reading section for long detail screens. */
export default function ReadingSection({
  title,
  subtitle,
  children,
  actionLabel,
  onActionPress,
  style,
}: Props) {
  return (
    <View style={[styles.section, style]}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
        style={styles.header}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
  header: {
    marginBottom: SPACING.sm,
  },
  content: {
    width: "100%",
    gap: SPACING.sm,
  },
});
