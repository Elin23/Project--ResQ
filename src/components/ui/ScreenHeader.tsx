import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { COLORS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "../ui/AppText";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}

      <View style={styles.titles}>
        <AppText weight="bold" size={FONT_SIZES.title} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText
            size={FONT_SIZES.caption}
            color={COLORS.textSecondary}
            numberOfLines={1}
          >
            {subtitle}
          </AppText>
        )}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  right: {
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
