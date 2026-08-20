import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { DENSITY } from "@/src/theme";

type Props = {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/** Canonical full-width vertical stack used by screen bodies. */
export default function ScreenStack({ children, gap = DENSITY.sectionGap, style }: Props) {
  return <View style={[styles.stack, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  stack: { width: "100%", alignItems: "stretch" },
});
