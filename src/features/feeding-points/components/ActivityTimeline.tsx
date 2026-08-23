import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { STATUS_META } from "../constants";
import type { StatusUpdate } from "../types";
import { formatRelativeTime } from "../utils/status";

type Props = {
  updates: StatusUpdate[];
};

export default function ActivityTimeline({ updates }: Props) {
  if (updates.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
          ما في تحديثات بعد — كن أول من يحدّث حالة هالنقطة
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {updates.map((update, index) => {
        const meta = STATUS_META[update.reportedStatus];
        const isLast = index === updates.length - 1;

        return (
          <View key={update.id} style={styles.row}>
            <View style={styles.railColumn}>
              <View style={[styles.dot, { backgroundColor: meta.color }]} />
              {!isLast && <View style={styles.line} />}
            </View>

            <View style={styles.content}>
              <View style={styles.headerRow}>
                <AppText weight="medium" size={FONT_SIZES.label}>
                  {update.userName}
                </AppText>
                <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
                  {formatRelativeTime(update.createdAt)}
                </AppText>
              </View>

              <StatusBadge
                label={meta.label}
                color={meta.color}
                background={meta.background}
                icon={meta.icon}
                size="sm"
              />

              {update.note && (
                <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
                  {update.note}
                </AppText>
              )}

              {update.photoUrl && (
                <Image source={{ uri: update.photoUrl }} style={styles.photo} />
              )}

              {update.reviewState === "pending" && (
                <View style={styles.pendingRow}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={COLORS.statusPending}
                  />
                  <AppText
                    size={FONT_SIZES.caption}
                    color={COLORS.statusPending}
                  >
                    بانتظار مراجعة الإدارة
                  </AppText>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  row: {
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
  },
  railColumn: {
    width: 12,
    alignItems: "center",
    paddingTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.xs,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
    backgroundColor: COLORS.border,
  },
  content: {
    flex: 1,
    gap: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
  },
  photo: {
    width: "100%",
    height: 140,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lightgray,
  },
  empty: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  pendingRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
  },
});
