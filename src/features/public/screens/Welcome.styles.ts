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
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: COLORS.borderStrong,
  },
  sideGlow: {
    position: "absolute",
    backgroundColor: COLORS.primary,
  },
  heroSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoHalo: {
    position: "absolute",
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.primaryPressed,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  logoImage: {
    zIndex: 2,
  },
  sloganRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 8,
  },
  slogan: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    lineHeight: 24,
    color: COLORS.primaryStrong,
    textAlign: "center",
  },
  panel: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    borderTopLeftRadius: RADIUS["2xl"],
    borderTopRightRadius: RADIUS["2xl"],
    backgroundColor: COLORS.surfaceSubtle,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.textSecondary,
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    direction: "ltr",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  welcomeTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.icon,
    textAlign: "center",
    writingDirection: "rtl",
  },
  brandRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  brandNameRow: {
    flexDirection: "row",
    direction: "rtl",
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
    color: COLORS.primary,
    textAlign: "center",
    includeFontPadding: false,
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  description: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  actions: {
    alignItems: "center",
    gap: 16,
  },
  fullWidth: {
    width: "100%",
  },
  primaryButtonWrapper: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primaryPressed,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23,
    shadowRadius: 14,
    elevation: 7,
  },
  primaryButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  buttonShimmer: {
    position: "absolute",
    top: "-45%",
    width: 70,
    height: "190%",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  secondaryButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  primaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.icon,
    textAlign: "center",
  },
  secondaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.primary,
    textAlign: "center",
  },
  guestContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  guestButton: {
    direction: "ltr",
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  guestText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  termsContainer: {
    marginTop: 30,
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4,
    rowGap: 2,
  },
  termsText: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 19,
    color: COLORS.iconMuted,
    textAlign: "center",
  },
  termsLink: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 19,
    color: COLORS.primaryStrong,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inlineLink: {
    borderRadius: RADIUS.xs,
  },
  inlineLinkHovered: {
    backgroundColor: COLORS.primarySoft,
  },
  inlineLinkPressed: {
    opacity: 0.55,
  },
});
