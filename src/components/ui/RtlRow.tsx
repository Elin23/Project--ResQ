import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { ARABIC_LAYOUT, SPACING } from "@/src/theme";

type Props = ViewProps & {
  children: React.ReactNode;
  gap?: number;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Logical horizontal row for the Arabic UI.
 * The first child is placed at the visual start edge (right in RTL).
 */
export default function RtlRow({
  children,
  gap = SPACING.sm,
  align = "center",
  justify = "flex-start",
  wrap = false,
  style,
  ...props
}: Props) {
  return (
    <View
      {...props}
      style={[
        styles.row,
        { gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : "nowrap" },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    direction: ARABIC_LAYOUT.direction,
  },
});
