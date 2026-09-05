import { Ionicons } from "@expo/vector-icons";
import { Image, Share, StyleSheet, View } from "react-native";

import ActionRow from "@/src/components/ui/ActionRow";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import IconButton from "@/src/components/ui/IconButton";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { MyReport } from "../types/myReport";

const labels = {
  review: { text: "قيد المراجعة", color: COLORS.warning, bg: COLORS.warningSoft },
  rescue: { text: "قيد الإنقاذ", color: COLORS.info, bg: COLORS.infoSoft },
  rescued: { text: "تم الإنقاذ", color: COLORS.success, bg: COLORS.successSoft },
} as const;

const steps = ["بلاغ", "استجابة", "علاج", "تم"];

type Props = {
  report: MyReport;
  onDetailsPress: () => void;
};

export default function MyReportCard({ report, onDetailsPress }: Props) {
  const label = labels[report.status];

  return (
    <Card disabled padding={SPACING.md} style={styles.card}>
      <View style={styles.head}>
        {report.imageUrl ? (
          <Image source={{ uri: report.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={ICON_SIZES.lg} color={COLORS.primaryStrong} />
          </View>
        )}

        <View style={styles.info}>
          <AppText variant="h3" weight="bold" numberOfLines={2}>{report.title}</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>{report.code}</AppText>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={ICON_SIZES.xs} color={COLORS.textSecondary} />
            <AppText variant="label" color={COLORS.textSecondary} numberOfLines={2}>{report.location}</AppText>
          </View>
        </View>

        <StatusBadge label={label.text} color={label.color} background={label.bg} size="sm" style={styles.status} />
      </View>

      <View style={styles.progress}>
        {steps.map((step, index) => {
          const active = index <= report.activeStep;
          return (
            <View key={step} style={styles.step}>
              <View style={[styles.dot, active && styles.dotActive]}>
                {active ? (
                  <Ionicons
                    name={index === report.activeStep && report.status !== "rescued" ? "alert" : "checkmark"}
                    size={12}
                    color={COLORS.textInverse}
                  />
                ) : null}
              </View>
              <AppText variant="caption" color={active ? COLORS.primaryStrong : COLORS.textMuted}>{step}</AppText>
            </View>
          );
        })}
      </View>

      <ActionRow style={styles.actions}>
        <Button title="عرض التفاصيل" onPress={onDetailsPress} style={styles.detailsButton} />
        <IconButton
          icon="share-social-outline"
          accessibilityLabel="مشاركة البلاغ"
          onPress={() => void Share.share({ message: `${report.title} - ${report.code}` })}
          style={styles.shareButton}
        />
      </ActionRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: SPACING.md },
  head: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
    alignItems: "flex-start",
  },
  image: { width: 64, height: 64, borderRadius: RADIUS.md },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },
  info: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  locationRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  status: { alignSelf: "flex-start" },
  progress: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
    paddingBottom: SPACING.md,
  },
  step: { minWidth: 46, alignItems: "center", gap: SPACING.xs },
  dot: {
    width: 23,
    height: 23,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: { backgroundColor: COLORS.primaryStrongFill },
  actions: { width: "100%" },
  detailsButton: { flex: 1 },
  shareButton: { borderWidth: StyleSheet.hairlineWidth, borderColor: COLORS.borderStrong },
});
