import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationDashboardMetric } from "../types/organizationDashboard";

type Props = { metrics: OrganizationDashboardMetric[] };

export default function OrganizationMetricCards({ metrics }: Props) {
  const { isNarrow } = useResponsiveLayout();
  return (
    <View style={styles.row}>
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          disabled
          padding={isNarrow ? SPACING.sm : SPACING.md}
          radius={RADIUS.lg}
          style={[styles.card, isNarrow && styles.cardNarrow]}
        >
          <View style={styles.labelRow}>
            {metric.dotColor ? <View style={[styles.dot, { backgroundColor: metric.dotColor }]} /> : null}
            <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={2} style={styles.label}>{metric.label}</AppText>
          </View>
          <AppText variant={isNarrow ? "h2" : "h1"} weight="bold" color={COLORS.text}>{metric.value}</AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  card: { width: "48%", flexGrow: 1, minHeight: 82, alignItems: "center", justifyContent: "center" },
  cardNarrow: { width: "47%", minHeight: 76 },
  labelRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "center", gap: SPACING.xs },
  label: { flexShrink: 1, textAlign: "center" },
  dot: { width: 6, height: 6, borderRadius: RADIUS.full, flexShrink: 0 },
});
