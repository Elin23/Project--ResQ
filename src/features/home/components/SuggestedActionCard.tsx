import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import {
    COLORS,
    FONTS,
    FONT_SIZES,
    RADIUS,
    SPACING,
} from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconBackgroundColor: string;
  onPress: () => void;
};

export default function SuggestedActionCard({
  title,
  icon,
  color,
  iconBackgroundColor,
  onPress,
}: Props) {
  return (
    <Card
      onPress={onPress}
      padding={SPACING.md}
      radius={RADIUS.xl}
      backgroundColor={COLORS.lightgray}
      style={styles.card}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBackgroundColor,
          },
        ]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <AppText
        weight="bold"
        size={FONT_SIZES.body}
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </AppText>

      <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 78,
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.medium,
  },
});
