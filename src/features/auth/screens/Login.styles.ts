import { StyleSheet } from "react-native";

import { TYPOGRAPHY, RADIUS, COLORS, FONTS } from "@/src/theme";

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: COLORS.surfaceSubtle,
  },
  topGlow: {
    position: "absolute",
    backgroundColor: COLORS.borderStrong,
  },
  bottomGlow: {
    position: "absolute",
    backgroundColor: COLORS.border,
  },
  pageHeader: {
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignSelf: "center",
  },
  header: {
    width: "100%",
    alignItems: "stretch",
    marginBottom: 24,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconHalo: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS["2xl"],
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryPressed,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    fontFamily: FONTS.bold,
    color: COLORS.icon,
    textAlign: "center",
  },
  subtitle: {
    width: "100%",
    maxWidth: "100%",
    marginTop: 6,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "auto",
    writingDirection: "rtl",
  },
  form: {
    width: "100%",
  },
  emailInput: {
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 4,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    minHeight: 36,
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: RADIUS.sm,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primaryStrong,
    textAlign: "auto",
  },
  generalError: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  generalErrorText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: 20,
    color: COLORS.warning,
    textAlign: "auto",
  },
  loginButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
    shadowColor: COLORS.primaryPressed,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 13,
    elevation: 7,
  },
  loginButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.icon,
    textAlign: "center",
  },
  footer: {
    width: "100%",
  },
  divider: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    marginVertical: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.placeholder,
    textAlign: "center",
  },
  guestButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  guestButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.secondaryStrong,
    textAlign: "center",
  },
  registerRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 24,
    paddingBottom: 4,
  },
  registerPrompt: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  registerButton: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: RADIUS.xs,
  },
  registerText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primaryStrong,
    textAlign: "center",
  },
  linkPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },
});
