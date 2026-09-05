import { Ionicons } from "@expo/vector-icons";
import { Image, Linking, StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { FOOD_LEVEL_META, STATUS_META, WATER_META } from "../constants";
import type { FeedingPointSummary } from "../types";
import { formatDistance } from "../utils/format";
import { formatRelativeTime, getDisplayStatus } from "../utils/status";

type Props = {
  point: FeedingPointSummary;
  onPress: () => void;
};

/** شارة صغيرة توضّح حالة مرفق واحد (ماء/طعام) — محلية لهاي البطاقة بس */
function FacilityStat({
  label,
  icon,
  color,
  background,
  value,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background?: string;
  value: string;
}) {
  return (
    <View style={[styles.facilityBox, { backgroundColor: background ?? color + "1F" }]}>
      <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>
        {label}
      </AppText>
      <View style={styles.facilityValueRow}>
        <Ionicons name={icon} size={14} color={color} />
        <AppText size={FONT_SIZES.label} weight="bold" color={color}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

export default function FeedingPointCard({ point, onPress }: Props) {
  const display = getDisplayStatus(point.status, point.lastStatusUpdateAt);
  const meta = STATUS_META[display];
  const distance = formatDistance(point.distanceInMeters);
  const isStocked = display === "stocked";

  const waterMeta = point.hasWater ? WATER_META.available : WATER_META.unavailable;
  const foodMeta = FOOD_LEVEL_META[point.foodLevel];

  const openDirections = () => {
    const { latitude, longitude } = point.coordinate;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    );
  };

  return (
    <Card onPress={onPress} style={styles.card} padding={SPACING.sm + 4}>
      {point.isVerified && (
        <StatusBadge
          label="متحقق"
          color={COLORS.white}
          background={COLORS.successDarkFill}
          size="sm"
          style={styles.verifiedBadge}
        />
      )}

      <View style={styles.row}>
        <View style={styles.thumbnailWrap}>
          {point.thumbnailUrl ? (
            <Image source={{ uri: point.thumbnailUrl }} style={styles.image} />
          ) : (
            <View style={styles.thumbnailFallback}>
              <Ionicons name="restaurant-outline" size={24} color={COLORS.primary} />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <AppText weight="bold" size={FONT_SIZES.body} numberOfLines={2}>
            {point.name}
          </AppText>

          <View style={styles.metaRow}>
            {distance && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={12} color={COLORS.placeholder} />
                <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
                  {distance}
                </AppText>
              </View>
            )}

            {distance && (
              <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
                •
              </AppText>
            )}

            <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
              {formatRelativeTime(point.lastStatusUpdateAt)}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.facilitiesRow}>
        <FacilityStat
          label="الماء"
          icon={waterMeta.icon}
          color={waterMeta.color}
          value={waterMeta.label}
        />
        <FacilityStat
          label="الطعام"
          icon={foodMeta.icon}
          color={foodMeta.color}
          background={foodMeta.background}
          value={foodMeta.label}
        />
      </View>

      {isStocked ? (
        <View style={styles.actionsRow}>
          <Button
            title="الاتجاهات"
            onPress={openDirections}
            variant="custom"
            size="small"
            icon="navigate-outline"
            fullWidth={false}
            backgroundColor={COLORS.accent}
            borderColor={COLORS.accent}
            textColor={COLORS.white}
            style={styles.actionButton}
          />
          <Button
            title="عرض التفاصيل"
            onPress={onPress}
            variant="custom"
            size="small"
            fullWidth={false}
            backgroundColor={COLORS.surface}
            borderColor={COLORS.border}
            borderWidth={1}
            textColor={COLORS.text}
            style={styles.actionButton}
          />
        </View>
      ) : (
        <Button
          title="تحديث الحالة"
          onPress={onPress}
          variant="custom"
          size="small"
          backgroundColor={COLORS.surface}
          borderColor={meta.color}
          borderWidth={1}
          textColor={meta.color}
          style={styles.button}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0, // ← لحد ما تشيل marginBottom من Card نفسه
    gap: SPACING.sm,
  },
  verifiedBadge: {
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row", direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  thumbnailWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  thumbnailFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.lightgray,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    alignItems: "stretch",
    gap: 4,
    paddingTop: 2,
  },
  metaRow: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: 4,
  },
  facilitiesRow: {
    flexDirection: "row", direction: "rtl",
    gap: SPACING.sm,
  },
  facilityBox: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    gap: 2,
  },
  facilityValueRow: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: 4,
  },
  actionsRow: {
    flexDirection: "row", direction: "rtl",
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    marginTop: 0,
  },
  button: {
    marginTop: 0,
  },
});
