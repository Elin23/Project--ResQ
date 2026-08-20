import { Children } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { SPACING } from "@/src/theme";

type Props = {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/** Vertical action group with a consistent tappable-control gap. */
export default function ActionStack({ children, gap = SPACING.sm, style }: Props) {
  return <View style={[styles.stack, { gap }, style]}>{Children.toArray(children)}</View>;
}

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    alignItems: "stretch",
  },
});
