import { StyleSheet } from "react-native";
import { FONTS } from "@/src/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFE",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FAFAFE",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  leftGlow: {
    position: "absolute",
    backgroundColor: "#FF7946",
    opacity: 0.12,
    shadowColor: "#FF6F3C",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 45,
    elevation: 2,
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFD9CA",
    opacity: 0.18,
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FF7946",
  },
  particleOne: {
    width: 7,
    height: 7,
    borderRadius: 4,
    top: "23%",
    right: "20%",
  },
  particleTwo: {
    width: 5,
    height: 5,
    borderRadius: 3,
    top: "34%",
    left: "18%",
  },
  particleThree: {
    width: 6,
    height: 6,
    borderRadius: 3,
    top: "46%",
    right: "13%",
  },
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    backgroundColor: "#FF8050",
  },
  softCircle: {
    position: "absolute",
    backgroundColor: "#FFF0E9",
    borderWidth: 1,
    borderColor: "#FFE1D4",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  pawContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1EB",
    borderWidth: 1,
    borderColor: "#FFE0D3",
  },
  brandNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontFamily: FONTS.bold,
    color: "#222222",
    textAlign: "center",
    includeFontPadding: false,
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    color: "#FF7442",
    textAlign: "center",
    includeFontPadding: false,
  },
  subtitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    color: "#62524B",
    textAlign: "center",
  },
  subtitleDecoration: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 5,
  },
  decorationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF8253",
  },
  decorationLine: {
    width: 25,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFD5C5",
  },
  loaderSection: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
  },
  loaderTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#EBEBEF",
  },
  loaderFill: {
    height: "100%",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#FF7442",
  },
  loaderGlow: {
    position: "absolute",
    width: 28,
    height: "100%",
    right: 0,
    borderRadius: 999,
    backgroundColor: "#FFB08C",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#9B918C",
    textAlign: "center",
  },
});
