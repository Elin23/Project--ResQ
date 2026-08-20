import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Card from "./Card";

export type WorkspaceMetric = {
  key: string;
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
};

type Props = {
  metrics: WorkspaceMetric[];
  columns?: 2 | 3;
};

export default function WorkspaceMetricGrid({ metrics, columns = 2 }: Props) {
  const width: `${number}%` = columns === 3 ? "31%" : "48%";

  return (
    <View style={styles.grid}>
      {metrics.map((metric) => {
        const color = metric.color ?? COLORS.primaryStrong;
        return (
          <Card
            key={metric.key}
            disabled
            padding={SPACING.md}
            backgroundColor={metric.backgroundColor ?? COLORS.surfaceElevated}
            style={[styles.card, { width }]}
          >
            <View style={styles.topRow}>
              {metric.icon ? (
                <View style={[styles.icon, { backgroundColor: `${color}18` }]}>
                  <Ionicons name={metric.icon} size={ICON_SIZES.sm} color={color} />
                </View>
              ) : null}
              <AppText variant="h2" weight="bold" color={color}>{metric.value}</AppText>
            </View>
            <AppText variant="bodySmall" color={COLORS.textMuted}>{metric.label}</AppText>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  card: {
    minHeight: 88,
    justifyContent: "space-between",
    gap: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  topRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
