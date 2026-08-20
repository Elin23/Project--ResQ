import { StyleSheet } from "react-native";

import { TYPOGRAPHY, RADIUS, COLORS, FONTS, PALETTE } from "@/src/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.neutral25,
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: PALETTE.neutral25,
  },
  pageHeader: { backgroundColor: "transparent" },
  topBar: {
    width: "100%",
    height: 58,
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  topBarSpacer: {
    width: 46,
    height: 46,
  },
  backButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS["2xl"],
    backgroundColor: COLORS.disabledSurface,
  },
  backButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    width: "100%",
    alignItems: "center",
  },
  content: {
    alignSelf: "center",
  },
  illustrationContainer: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  illustrationHalo: {
    position: "absolute",
    backgroundColor: COLORS.dangerSoft,
  },
  iconCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.neutral0,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    shadowColor: COLORS.iconMuted,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 13,
    elevation: 4,
  },
  shieldWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  keyIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },
  title: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 390,
    marginTop: 6,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  passwordInput: {
    marginBottom: 8,
  },
  confirmPasswordInput: {
    marginBottom: 4,
  },
  generalError: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
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
    textAlign: "right",
  },
  requirementsCard: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: RADIUS.lg,
    backgroundColor: PALETTE.neutral0,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.textMuted,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  requirementsHeader: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 7,
    marginBottom: 14,
  },
  requirementsTitleIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primarySoft,
  },
  requirementsTitle: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    color: COLORS.icon,
    textAlign: "right",
  },
  requirementsList: {
    width: "100%",
    gap: 11,
  },
  requirementRow: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
  },
  requirementText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    lineHeight: 21,
    color: COLORS.textMuted,
    textAlign: "right",
  },
  validRequirementText: {
    color: COLORS.secondaryStrong,
  },
  invalidRequirementText: {
    color: COLORS.primaryStrong,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
  },
  saveButton: {
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
  saveButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.icon,
    textAlign: "center",
  },
});

export default styles;
