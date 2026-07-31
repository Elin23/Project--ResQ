import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  searchBox: { flex: 1, minHeight: 48, flexDirection: "row-reverse", alignItems: "center", gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, backgroundColor: COLORS.lightgray },
  searchInput: { flex: 1, height: 48, paddingVertical: 0, fontFamily: FONTS.regular, fontSize: FONT_SIZES.body, color: COLORS.text, textAlign: "right", writingDirection: "rtl" },
  clearButton: { alignItems: "center", justifyContent: "center" }, pressed: { opacity: 0.65, transform: [{ scale: 0.94 }] },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: 120 },
  sectionHeader: { width: "100%", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", gap: SPACING.md, marginBottom: SPACING.md },
  emptyState: { marginBottom: SPACING.md },
});
