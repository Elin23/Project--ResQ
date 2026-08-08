import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationDashboardMetric } from "../types/organizationDashboard";

type Props = { metrics: OrganizationDashboardMetric[] };

export default function OrganizationMetricCards({ metrics }: Props) {
  return (
    <View style={styles.row}>
      {metrics.map((metric) => (
        <Card key={metric.id} disabled padding={SPACING.md} radius={RADIUS.lg} style={styles.card}>
          <View style={styles.labelRow}>
            {metric.dotColor ? <View style={[styles.dot, { backgroundColor: metric.dotColor }]} /> : null}
            <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{metric.label}</AppText>
          </View>
          <AppText size={27} weight="bold" color={COLORS.text}>{metric.value}</AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: SPACING.md },
  card: { flex: 1, minHeight: 82, alignItems: "center", justifyContent: "center" },
  labelRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  dot: { width: 6, height: 6, borderRadius: RADIUS.full },
});
