import { StyleSheet, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
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
      backgroundColor={COLORS.primaryStrongFill}
      style={styles.card}
    >
      <AppText
        weight="bold"
        variant="h3"
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
              variant="h1"
              weight="bold"
              color={COLORS.white}
              align="center"
            >
              {stat.value}
            </AppText>

            <AppText
              variant="label"
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
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
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
});
