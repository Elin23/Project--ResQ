import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, DENSITY, LAYOUT, SPACING } from "@/src/theme";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Persistent bottom action surface for long forms and task workflows. */
export default function StickyActionBar({ children, style }: Props) {
  return (
    <View style={[styles.shell, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.sm,
  },
  content: {
    width: "100%",
    maxWidth: LAYOUT.contentMaxWidth,
    minHeight: DENSITY.touchTargetMin,
    alignSelf: "center",
    justifyContent: "center",
  },
});
