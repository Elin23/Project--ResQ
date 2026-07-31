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

type StatItem = {
  key: string;
  value: number;
  label: string;
};

type Props = {
  stats: StatItem[];
};

export default function CommunityStatsCard({ stats }: Props) {
  return (
    <Card
      disabled
      padding={SPACING.lg}
      radius={RADIUS.xl}
      backgroundColor={COLORS.brown}
      style={styles.card}
    >
      <AppText
        weight="bold"
        size={FONT_SIZES.title}
        color={COLORS.white}
        style={styles.title}
      >
        أثر المجتمع هذا الشهر
      </AppText>

      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View
            key={stat.key}
            style={[
              styles.statItem,
              index < stats.length - 1 && styles.statDivider,
            ]}
          >
            <AppText
              weight="bold"
              color={COLORS.white}
              align="center"
              style={styles.value}
            >
              {stat.value}
            </AppText>

            <AppText
              size={FONT_SIZES.label}
              color={`${COLORS.white}CC`}
              align="center"
            >
              {stat.label}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 170,
    marginBottom: 0,
  },
  title: {
    width: "100%",
    marginBottom: SPACING.lg,
    fontFamily: FONTS.bold,
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: `${COLORS.white}26`,
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    lineHeight: 38,
  },
});
