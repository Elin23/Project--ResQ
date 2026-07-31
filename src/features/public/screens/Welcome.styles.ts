import { StyleSheet } from "react-native";

import { FONTS } from "@/src/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9F6",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FFF9F6",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFB38D",
  },
  sideGlow: {
    position: "absolute",
    backgroundColor: "#FF8A52",
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
    backgroundColor: "#FFF0E8",
    borderWidth: 1,
    borderColor: "#FFE3D6",
    shadowColor: "#D77844",
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
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 8,
  },
  slogan: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 24,
    color: "#B35418",
    textAlign: "center",
  },
  panel: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    backgroundColor: "#FAFAFE",
    borderTopWidth: 1,
    borderColor: "#F4E8E1",
    shadowColor: "#7D5540",
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
    direction: "ltr",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  welcomeTitle: {
    fontFamily: FONTS.bold,
    color: "#252525",
    textAlign: "center",
    writingDirection: "rtl",
  },
  brandRow: {
    direction: "ltr",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  brandNameRow: {
    direction: "ltr",
    flexDirection: "row-reverse",
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
    color: "#FF7E47",
    textAlign: "center",
    includeFontPadding: false,
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  description: {
    fontFamily: FONTS.regular,
    color: "#675A54",
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
    borderRadius: 17,
    shadowColor: "#E66F30",
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
    fontSize: 17,
    color: "#5F2B12",
    textAlign: "center",
  },
  secondaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: "#FF7945",
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
    fontSize: 14,
    color: "#554842",
    textAlign: "center",
  },
  termsContainer: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4,
    rowGap: 2,
  },
  termsText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 19,
    color: "#958882",
    textAlign: "center",
  },
  termsLink: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    lineHeight: 19,
    color: "#A94D17",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inlineLink: {
    borderRadius: 5,
  },
  inlineLinkHovered: {
    backgroundColor: "#FFF0E8",
  },
  inlineLinkPressed: {
    opacity: 0.55,
  },
});
