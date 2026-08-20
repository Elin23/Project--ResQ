import { Children } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SPACING } from "@/src/theme";
type Props = { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle> };
export default function ActionRow({ children, gap = SPACING.sm, style }: Props) { return <View style={[styles.row, { gap }, style]}>{Children.toArray(children)}</View>; }
const styles = StyleSheet.create({ row: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center" } });
