import { StyleSheet } from "react-native";
import { SPACING } from "@/src/theme";
export const styles = StyleSheet.create({
  container: { width: "100%", gap: SPACING.xl, paddingBottom: SPACING.xl },
  section: { width: "100%" },
  horizontalList: { flexDirection: "row", gap: SPACING.md, paddingBottom: SPACING.xs },
  suggestions: { width: "100%", gap: SPACING.md },
});
