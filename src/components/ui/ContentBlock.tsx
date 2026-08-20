import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { SPACING } from "@/src/theme";

type Props = ViewProps & {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/** Full-width content column anchored to the Arabic start edge (right). */
export default function ContentBlock({ children, gap = SPACING.xs, style, ...props }: Props) {
  return (
    <View {...props} style={[styles.block, { gap }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
    alignItems: "stretch",
  },
});
