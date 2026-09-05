import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import IconButton from "../../../components/ui/IconButton";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";

import { STATUS_META } from "../constants";
import type { FeedingPointSummary } from "../types";
import { getDisplayStatus } from "../utils/status";

type Props = {
  point: FeedingPointSummary;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPress: () => void;
};

/** بطاقة معاينة تطفو فوق حافة الخريطة لما تنكبس دبوس */
export default function MapPinPreviewCard({
  point,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onPress,
}: Props) {
  const display = getDisplayStatus(point.status, point.lastStatusUpdateAt);
  const meta = STATUS_META[display];

  return (
    <View style={styles.row}>
      <IconButton
        icon="chevron-back"
        accessibilityLabel="النقطة السابقة"
        onPress={onPrev}
        disabled={!hasPrev}
        size={16}
        color={COLORS.text}
        style={styles.navButton}
      />

      <Pressable accessibilityRole="button" accessibilityLabel={`فتح تفاصيل نقطة الإطعام ${point.name}، الحالة ${meta.label}`} onPress={onPress} style={styles.card}>
        <View style={styles.thumbnail}>
          {point.thumbnailUrl ? (
            <Image source={{ uri: point.thumbnailUrl }} style={styles.image} />
          ) : (
            <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} />
          )}
        </View>

        <View style={styles.info}>
          <AppText weight="bold" size={FONT_SIZES.label} numberOfLines={2}>
            {point.name}
          </AppText>
          <View style={styles.statusRow}>
            <Ionicons name={meta.icon} size={12} color={meta.color} />
            <AppText size={FONT_SIZES.caption} color={meta.color}>
              {meta.label}
            </AppText>
          </View>
        </View>
      </Pressable>

      <IconButton
        icon="chevron-forward"
        accessibilityLabel="النقطة التالية"
        onPress={onNext}
        disabled={!hasNext}
        size={16}
        color={COLORS.text}
        style={styles.navButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "absolute",
    left: SPACING.sm,
    right: SPACING.sm,
    bottom: SPACING.sm,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xs + 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lightgray,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: 4,
  },
});
