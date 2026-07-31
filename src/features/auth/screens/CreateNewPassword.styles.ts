import { StyleSheet } from "react-native";

import { FONTS } from "@/src/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FBFAFE",
  },
  topBar: {
    width: "100%",
    height: 58,
    flexDirection: "row-reverse",
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
    borderRadius: 23,
    backgroundColor: "#EFEFF1",
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
    backgroundColor: "#FFF3ED",
  },
  iconCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECC4B2",
    shadowColor: "#9B694E",
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
    color: "#232323",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 390,
    marginTop: 6,
    fontFamily: FONTS.regular,
    color: "#72645D",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: "#FFF0EA",
    borderWidth: 1,
    borderColor: "#F3C5B5",
  },
  generalErrorText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#9D3A20",
    textAlign: "right",
  },
  requirementsCard: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8E5",
    shadowColor: "#79675E",
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
    flexDirection: "row-reverse",
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
    borderRadius: 10,
    backgroundColor: "#FFF1E9",
  },
  requirementsTitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#342B27",
    textAlign: "right",
  },
  requirementsList: {
    width: "100%",
    gap: 11,
  },
  requirementRow: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
  },
  requirementText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 21,
    color: "#695A53",
    textAlign: "right",
  },
  validRequirementText: {
    color: "#13853A",
  },
  invalidRequirementText: {
    color: "#BE4E2C",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
  },
  saveButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
    shadowColor: "#E66F30",
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
    fontSize: 16,
    color: "#603016",
    textAlign: "center",
  },
});

export default styles;
