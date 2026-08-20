import { StyleSheet } from "react-native";
import { TYPOGRAPHY, RADIUS, COLORS, FONTS, PALETTE } from "@/src/theme";

export const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: 10, marginBottom: 16 },
  spacedSection: { marginTop: 28 },
  sectionMarker: { width: 4, height: 24, borderRadius: RADIUS.xs, backgroundColor: COLORS.primary },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: TYPOGRAPHY.h3.fontSize, color: COLORS.icon },
  progressContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: PALETTE.neutral0 },
  progressLabels: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", marginBottom: 10 },
  progressTitle: { fontFamily: FONTS.medium, fontSize: TYPOGRAPHY.body.fontSize, color: COLORS.icon },
  stepText: { fontFamily: FONTS.regular, fontSize: TYPOGRAPHY.bodySmall.fontSize, color: COLORS.iconMuted },
  progressTrack: { height: 6, borderRadius: RADIUS.xs, backgroundColor: COLORS.surfaceMuted, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: RADIUS.xs, backgroundColor: COLORS.primary },
  errorText: { marginTop: 6, fontFamily: FONTS.regular, fontSize: TYPOGRAPHY.label.fontSize, color: COLORS.danger, textAlign: "right" },
});
