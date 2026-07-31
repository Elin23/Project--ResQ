import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "@/src/theme";

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  state: {
    margin: SPACING.lg,
  },
});
