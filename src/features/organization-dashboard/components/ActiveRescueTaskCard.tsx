import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationRescueTask } from "../types/organizationDashboard";

type Props = {
  task: OrganizationRescueTask;
  onOpen: () => void;
  onUpdate: () => void;
};

export default function ActiveRescueTaskCard({ task, onOpen, onUpdate }: Props) {
  const { isNarrow } = useResponsiveLayout();
  return (
    <Card padding={isNarrow ? SPACING.sm : SPACING.md} radius={RADIUS.lg}>
      <View style={[styles.headerRow, isNarrow && styles.headerRowNarrow]}>
        <AppText variant="caption" color={COLORS.textMuted}>{task.code}</AppText>
        <View style={styles.identity}>
          <View style={styles.textWrap}>
            <AppText variant="h3" weight="bold" numberOfLines={2}>{task.title}</AppText>
            <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={2}>
              {task.location} • {task.distance}
            </AppText>
          </View>
          <Image source={task.image} style={[styles.image, isNarrow && styles.imageNarrow]} />
        </View>
      </View>

      <View style={styles.progressHeader}>
        <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>{task.progress}%</AppText>
        <AppText variant="caption" color={COLORS.textMuted}>نسبة الإنجاز</AppText>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${task.progress}%` as `${number}%` }]} />
      </View>

      <View style={[styles.actions, isNarrow && styles.actionsNarrow]}>
        <Button
          title="عرض المهمة"
          onPress={onOpen}
          variant="outline"
          size="small"
          fullWidth={false}
          style={styles.actionButton}
        />
        <Button
          title={task.progress >= 100 ? "مكتملة" : "تحديث الحالة"}
          onPress={onUpdate}
          size="small"
          fullWidth={false}
          backgroundColor={COLORS.primary}
          borderColor={COLORS.primary}
          textColor={COLORS.textInverse}
          icon="refresh-outline"
          disabled={task.progress >= 100}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row", direction: "rtl",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.md,
  },
  headerRowNarrow: { alignItems: "flex-start", gap: SPACING.sm },
  identity: { flex: 1, flexDirection: "row", direction: "rtl", justifyContent: "flex-end", gap: SPACING.sm },
  textWrap: { flex: 1, alignItems: "stretch" },
  image: { width: 58, height: 58, borderRadius: RADIUS.md, resizeMode: "cover" },
  imageNarrow: { width: 48, height: 48 },
  progressHeader: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  track: {
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    overflow: "hidden",
    marginTop: SPACING.xs,
  },
  progress: { height: "100%", borderRadius: RADIUS.full, backgroundColor: COLORS.primary },
  actions: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, marginTop: SPACING.md },
  actionsNarrow: { flexDirection: "column" },
  actionButton: { flex: 1 },
});
