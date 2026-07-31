import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

import { COLORS, FONT_SIZES, FONTS } from "@/src/theme";

type Props = TextProps & {
  size?: number;
  color?: string;
  weight?: "regular" | "medium" | "bold";
  align?: "left" | "center" | "right" | "auto";
  style?: StyleProp<TextStyle>;
};

export default function AppText({
  size = FONT_SIZES.body,
  color = COLORS.text,
  weight = "regular",
  align = "right",
  style,
  ...props
}: Props) {
  const fontFamily =
    weight === "bold"
      ? FONTS.bold
      : weight === "medium"
        ? FONTS.medium
        : FONTS.regular;

  return (
    <Text
      {...props}
      style={[
        styles.base,
        {
          fontFamily,
          fontSize: size,
          color,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
