import { I18nManager, TextInputProps, TextStyle, ViewStyle } from "react-native";

export const APP_DIRECTION = "rtl" as const;
export const IS_RTL = true;

export const RTL_TEXT: TextStyle = {
  textAlign: "right",
  writingDirection: "rtl",
};

export const LTR_TEXT: TextStyle = {
  textAlign: "left",
  writingDirection: "ltr",
};

export const RTL_ROW: ViewStyle = {
  flexDirection: "row",
  direction: "rtl",
};

export const LOGICAL = {
  marginStart: (value: number): ViewStyle => ({ marginStart: value }),
  marginEnd: (value: number): ViewStyle => ({ marginEnd: value }),
  paddingStart: (value: number): ViewStyle => ({ paddingStart: value }),
  paddingEnd: (value: number): ViewStyle => ({ paddingEnd: value }),
} as const;

export type ContentDirection = "auto" | "rtl" | "ltr";

const LTR_KEYBOARDS = new Set<NonNullable<TextInputProps["keyboardType"]>>([
  "email-address",
  "phone-pad",
  "numeric",
  "decimal-pad",
  "number-pad",
  "numbers-and-punctuation",
  "url",
]);

export function resolveInputDirection(
  direction: ContentDirection,
  keyboardType?: TextInputProps["keyboardType"],
  textContentType?: TextInputProps["textContentType"],
): "rtl" | "ltr" {
  if (direction !== "auto") return direction;

  if (keyboardType && LTR_KEYBOARDS.has(keyboardType)) return "ltr";
  if (
    textContentType === "emailAddress" ||
    textContentType === "telephoneNumber" ||
    textContentType === "URL" ||
    textContentType === "username"
  ) {
    return "ltr";
  }

  return "rtl";
}

export function directionalIcon(
  rtlIcon: string,
  ltrIcon: string,
): string {
  return I18nManager.isRTL || IS_RTL ? rtlIcon : ltrIcon;
}
