import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { MARKER_COLORS } from "../constants";
import type { FeedingPointSummary } from "../types";
import { getDisplayStatus } from "../utils/status";

export type FeedingPointsMapProps = {
  points: FeedingPointSummary[];
  selectedId: string | null;
  onSelectPoint: (id: string) => void;
  height?: number;
};

/** موقع تقريبي وثابت داخل حدود البطاقة، مشتق من id النقطة — للعرض الزخرفي فقط */
function pseudoPosition(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  const left = 12 + (hash % 76); // 12%..88%
  const top = 18 + ((hash * 7) % 58); // 18%..76%
  return { left: `${left}%` as const, top: `${top}%` as const };
}

/** Web fallback when the native map surface is unavailable. */
export default function FeedingPointsMap({
  points,
  selectedId,
  onSelectPoint,
  height = 200,
}: FeedingPointsMapProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.roadLine1} />
      <View style={styles.roadLine2} />

      {points.map((point) => {
        const display = getDisplayStatus(point.status, point.lastStatusUpdateAt);
        const color = MARKER_COLORS[display];
        const isSelected = point.id === selectedId;

        return (
          <Pressable
            key={point.id}
            accessibilityRole="button"
            accessibilityLabel={`نقطة الإطعام ${point.name}`}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelectPoint(point.id)}
            hitSlop={6}
            style={[styles.pin, pseudoPosition(point.id)]}
          >
            <View
              style={[
                styles.pinDot,
                { backgroundColor: color },
                isSelected && styles.pinDotSelected,
              ]}
            >
              <Ionicons name="paw" size={11} color={COLORS.white} />
            </View>
          </Pressable>
        );
      })}

      <View style={styles.badge}>
        <Ionicons name="map-outline" size={12} color={COLORS.textSecondary} />
        <AppText variant="caption" color={COLORS.textSecondary}>
          عرض تقريبي للمواقع
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.disabledSurface,
    overflow: "hidden",
  },
  roadLine1: {
    position: "absolute",
    top: "35%",
    left: -20,
    right: -20,
    height: 10,
    backgroundColor: COLORS.surface,
    opacity: 0.6,
    transform: [{ rotate: "-6deg" }],
  },
  roadLine2: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "68%",
    width: 10,
    backgroundColor: COLORS.surface,
    opacity: 0.5,
    transform: [{ rotate: "10deg" }],
  },
  pin: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  pinDotSelected: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.lg,
  },
  badge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surface + "CC",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
});
