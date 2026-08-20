import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, ICON_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = { text: string; icon?: keyof typeof Ionicons.glyphMap; color?: string; numberOfLines?: number; style?: StyleProp<ViewStyle>; };
export default function MetaRow({ text, icon, color = COLORS.textSecondary, numberOfLines = 1, style }: Props) {
  return <View style={[styles.row, style]}>{icon ? <Ionicons name={icon} size={ICON_SIZES.xs} color={color} /> : null}<AppText variant="label" color={color} numberOfLines={numberOfLines} style={styles.text}>{text}</AppText></View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "flex-start", gap: SPACING.xs, minWidth: 0, alignSelf: "stretch" },
  text: { flexShrink: 1 },
});
