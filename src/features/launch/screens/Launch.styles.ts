import { StyleSheet } from "react-native";
import { TYPOGRAPHY, RADIUS, COLORS, FONTS } from "@/src/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: COLORS.surfaceSubtle,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  leftGlow: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    opacity: 0.12,
    shadowColor: COLORS.primaryPressed,
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
    backgroundColor: COLORS.border,
    opacity: 0.18,
  },
  particle: {
    position: "absolute",
    backgroundColor: COLORS.primary,
  },
  particleOne: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.xs,
    top: "23%",
    right: "20%",
  },
  particleTwo: {
    width: 5,
    height: 5,
    borderRadius: RADIUS.xs,
    top: "34%",
    left: "18%",
  },
  particleThree: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.xs,
    top: "46%",
    right: "13%",
  },
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    backgroundColor: COLORS.primary,
  },
  softCircle: {
    position: "absolute",
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.divider,
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
    direction: "ltr",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  pawContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  brandNameRow: {
    flexDirection: "row",
    direction: "ltr",
    alignItems: "center",
  },
  brandText: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: "center",
    includeFontPadding: false,
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    color: COLORS.primaryPressed,
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
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  subtitleDecoration: {
    flexDirection: "row",
    direction: "ltr",
    alignItems: "center",
    marginTop: 7,
    gap: 5,
  },
  decorationDot: {
    width: 4,
    height: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
  },
  decorationLine: {
    width: 25,
    height: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.border,
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
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.divider,
  },
  loaderFill: {
    height: "100%",
    overflow: "hidden",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryPressed,
  },
  loaderGlow: {
    position: "absolute",
    width: 28,
    height: "100%",
    right: 0,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderStrong,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.placeholder,
    textAlign: "center",
  },
});
