import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationRescueTask } from "../types/organizationDashboard";

type Props = {
  task: OrganizationRescueTask;
  onOpen: () => void;
  onUpdate: () => void;
};

export default function ActiveRescueTaskCard({ task, onOpen, onUpdate }: Props) {
  return (
    <Card padding={SPACING.md} radius={RADIUS.lg}>
      <View style={styles.headerRow}>
        <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted}>{task.code}</AppText>
        <View style={styles.identity}>
          <View style={styles.textWrap}>
            <AppText weight="medium" size={FONT_SIZES.body}>{task.title}</AppText>
            <AppText size={FONT_SIZES.caption} color={COLORS.successDark}>
              {task.location} • {task.distance}
            </AppText>
          </View>
          <Image source={task.image} style={styles.image} />
        </View>
      </View>

      <View style={styles.progressHeader}>
        <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted}>{task.progress}%</AppText>
        <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted}>التقدم</AppText>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${task.progress}%` as `${number}%` }]} />
      </View>

      <View style={styles.actions}>
        <Button
          title="عرض المهمة"
          onPress={onOpen}
          variant="custom"
          size="small"
          fullWidth={false}
          backgroundColor={COLORS.darkgray}
          borderColor={COLORS.darkgray}
          textColor={COLORS.text}
          style={styles.actionButton}
        />
        <Button
          title={task.progress >= 100 ? "مكتملة" : "تحديث الحالة"}
          onPress={onUpdate}
          size="small"
          fullWidth={false}
          backgroundColor={COLORS.secondary}
          borderColor={COLORS.secondary}
          textColor={COLORS.white}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  identity: { flex: 1, flexDirection: "row", justifyContent: "flex-end", gap: SPACING.sm },
  textWrap: { flex: 1, alignItems: "flex-end" },
  image: { width: 58, height: 58, borderRadius: RADIUS.md, resizeMode: "cover" },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  track: {
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.darkgray,
    overflow: "hidden",
    marginTop: SPACING.xs,
  },
  progress: { height: "100%", borderRadius: RADIUS.full, backgroundColor: COLORS.secondary },
  actions: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.md },
  actionButton: { flex: 1 },
});
