import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Card from "./Card";

export type QuickAction = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconBackgroundColor?: string;
  onPress: () => void;
};

type Props = {
  actions: QuickAction[];
  columns?: 2 | 3;
};

export default function QuickActionGrid({ actions, columns = 2 }: Props) {
  const cellWidth: `${number}%` = columns === 3 ? "30.5%" : "47%";

  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Card
          key={action.key}
          onPress={action.onPress}
          padding={SPACING.md}
          backgroundColor={COLORS.lightgray}
          style={[
            styles.cell,
            {
              width: cellWidth,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor:
                  action.iconBackgroundColor ?? `${action.color}22`,
              },
            ]}
          >
            <Ionicons name={action.icon} size={24} color={action.color} />
          </View>

          <AppText style={styles.label} numberOfLines={2} align="center">
            {action.label}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: SPACING.md,
  },
  cell: {
    minHeight: 108,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    minHeight: 38,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.label,
    lineHeight: 19,
    textAlign: "center",
  },
});
