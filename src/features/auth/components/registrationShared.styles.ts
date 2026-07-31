import { StyleSheet } from "react-native";
import { FONTS } from "@/src/theme";

export const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  spacedSection: { marginTop: 28 },
  sectionMarker: { width: 4, height: 24, borderRadius: 2, backgroundColor: "#FF7A45" },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 18, color: "#172B4D" },
  progressContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#FFFFFF" },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressTitle: { fontFamily: FONTS.medium, fontSize: 14, color: "#172B4D" },
  stepText: { fontFamily: FONTS.regular, fontSize: 13, color: "#6B778C" },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: "#F1F3F5", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: "#FF7A45" },
  errorText: { marginTop: 6, fontFamily: FONTS.regular, fontSize: 12, color: "#C92335", textAlign: "right" },
});
