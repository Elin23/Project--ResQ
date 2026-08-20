import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { getPlaceOpenState, SERVICE_PLACE_TYPE_META, type ServicePlace } from "@/src/domain/service-places";
import { RADIUS, COLORS, ICON_SIZES, SPACING } from "@/src/theme";

export default function PlaceListCard({ place, onPress }: { place: ServicePlace; onPress: () => void }) {
  const status = getPlaceOpenState(place);
  const meta = SERVICE_PLACE_TYPE_META[place.type];
  const { isNarrow } = useResponsiveLayout();
  return (
    <Card onPress={onPress} accessibilityRole="button" accessibilityLabel={`عرض ${place.name}`} style={[styles.card, isNarrow && styles.cardNarrow]} padding={isNarrow ? SPACING.sm : undefined}>
      <View style={[styles.iconWrap, isNarrow && styles.iconWrapNarrow]}>
        <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={isNarrow ? ICON_SIZES.md : ICON_SIZES.lg} color={COLORS.primaryStrong} />
      </View>
      <View style={styles.content}>
        <View style={[styles.titleRow, isNarrow && styles.titleRowNarrow]}>
          <AppText variant="body" weight="bold" style={styles.title} numberOfLines={2}>{place.name}</AppText>
          <StatusBadge label={status.label} color={status.isOpen ? COLORS.success : COLORS.danger} dot style={styles.badge} />
        </View>
        <AppText variant="bodySmall" color={COLORS.textSecondary} numberOfLines={2}>{place.address}</AppText>
        <AppText variant="caption" color={COLORS.textMuted} numberOfLines={2}>{meta.label}{status.nextChangeLabel ? ` • ${status.nextChangeLabel}` : ""}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  cardNarrow: { alignItems: "flex-start", gap: SPACING.sm },
  iconWrap: { width: 42, height: 42, borderRadius: RADIUS.xl, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  iconWrapNarrow: { width: 36, height: 36 },
  content: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  titleRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  titleRowNarrow: { alignItems: "flex-start" },
  title: { flex: 1, minWidth: 0 },
  badge: { alignSelf: "flex-start", flexShrink: 0 },
});
