import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { Report, ReportStatus } from "@/src/types";
import { formatRelativeTimeAr } from "@/src/utils/relativeTime";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string }> = {
  pending: { label: "قيد المعالجة", color: COLORS.textgreen },
  approved: { label: "بلاغ جديد", color: COLORS.primary },
  closed: { label: "تم الإنقاذ", color: COLORS.textblue },
};

type Props = {
  report: Report;
  onPress: () => void;
};

export default function ReportPreviewCard({ report, onPress }: Props) {
  const status = STATUS_CONFIG[report.status];

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: report.imageUrl }} style={styles.image} />

        <View style={styles.body}>
          <Chip label={status.label} color={status.color} soft />

          <AppText weight="bold" numberOfLines={1}>
            {report.description}
          </AppText>

          <AppText
            size={FONT_SIZES.label}
            color={COLORS.textSecondary}
            numberOfLines={1}
          >
            {report.subtitle}
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={14}
                color={COLORS.textSecondary}
              />
              <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
                {report.locationName}
              </AppText>
            </View>

            <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
              {formatRelativeTimeAr(report.createdAt)}
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    gap: SPACING.md,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
  },
  body: {
    flex: 1,
    alignItems: "flex-start",
    gap: SPACING.xs,
  },
  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
});
