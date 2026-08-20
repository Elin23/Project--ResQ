import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

import { APP_DIRECTION } from "@/src/i18n";
import {
  ACCESSIBILITY,
  ARABIC_LAYOUT,
  COLORS,
  FONTS,
  TYPOGRAPHY,
  TypographyVariant,
} from "@/src/theme";

type Props = TextProps & {
  variant?: TypographyVariant;
  /** Escape hatch for legacy screens. Prefer variant in new code. */
  size?: number;
  color?: string;
  weight?: "regular" | "medium" | "bold";
  align?: "left" | "center" | "right" | "auto";
  direction?: "rtl" | "ltr" | "auto";
  style?: StyleProp<TextStyle>;
};

export default function AppText({
  variant = "body",
  size,
  color = COLORS.text,
  weight,
  align = ARABIC_LAYOUT.textAlign,
  direction = APP_DIRECTION,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = ACCESSIBILITY.textMaxFontSizeMultiplier,
  ...props
}: Props) {
  const preset = TYPOGRAPHY[variant];
  const fontFamily = weight
    ? weight === "bold"
      ? FONTS.bold
      : weight === "medium"
        ? FONTS.medium
        : FONTS.regular
    : preset.fontFamily;

  return (
    <Text
      {...props}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        styles.base,
        {
          fontFamily,
          fontSize: size ?? preset.fontSize,
          lineHeight: size ? Math.round(size * 1.45) : preset.lineHeight,
          color,
          textAlign: align,
          writingDirection: direction,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    flexShrink: 1,
    textAlignVertical: "center",
  },
});
