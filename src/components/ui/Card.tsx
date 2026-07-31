import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";

type Props = PressableProps & {
  children: React.ReactNode;
  padding?: number;
  radius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Card({
  children,
  padding = SPACING.md,
  radius = RADIUS.lg,
  backgroundColor = COLORS.background,
  borderColor = COLORS.border,
  borderWidth = 0,
  shadow = true,
  style,
  disabled,
  ...props
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        shadow && styles.shadow,
        {
          padding,
          borderRadius: radius,
          backgroundColor,
          borderColor,
          borderWidth,
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
});
