import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = {
  onIncomingReportsPress: () => void;
  onRescueTasksPress: () => void;
  onFeedingPointsPress: () => void;
  onAdoptionListingsPress: () => void;
  onCreateCampaignPress: () => void;
  onCampaignsPress: () => void;
  onVeterinaryClinicsPress: () => void;
};

const ACTIONS = [
  { id: "incoming", label: "البلاغات الواردة", icon: "notifications-outline" as const },
  { id: "missions", label: "مهام الإنقاذ", icon: "clipboard-outline" as const },
  { id: "feeding", label: "نقاط الإطعام", icon: "restaurant-outline" as const },
  { id: "adoption", label: "إعلانات التبني", icon: "paw-outline" as const },
  { id: "campaign", label: "فتح حملة", icon: "megaphone-outline" as const },
  { id: "campaigns", label: "حملاتي", icon: "folder-open-outline" as const },
  { id: "vets", label: "العيادات", icon: "medkit-outline" as const },
];

export default function OrganizationQuickActions({ onIncomingReportsPress, onRescueTasksPress, onFeedingPointsPress, onAdoptionListingsPress, onCreateCampaignPress, onCampaignsPress, onVeterinaryClinicsPress }: Props) {
  const { isNarrow } = useResponsiveLayout();
  const handlers = { incoming: onIncomingReportsPress, missions: onRescueTasksPress, feeding: onFeedingPointsPress, adoption: onAdoptionListingsPress, campaign: onCreateCampaignPress, campaigns: onCampaignsPress, vets: onVeterinaryClinicsPress };
  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={handlers[action.id as keyof typeof handlers]}
          style={({ pressed }) => [styles.item, isNarrow && styles.itemNarrow, pressed && styles.pressed]}
        >
          <View style={[styles.iconTile, isNarrow && styles.iconTileNarrow]}>
            <Ionicons name={action.icon} size={isNarrow ? 22 : 26} color={COLORS.brown} />
          </View>
          <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted} numberOfLines={2} style={styles.label}>{action.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm, marginVertical: SPACING.sm },
  item: { width: "31%", flexGrow: 1, alignItems: "center", gap: SPACING.sm },
  itemNarrow: { width: "47%" },
  iconTile: { width: "100%", minHeight: 78, borderRadius: RADIUS.lg, backgroundColor: COLORS.darkgray, alignItems: "center", justifyContent: "center" },
  iconTileNarrow: { minHeight: 64 },
  label: { textAlign: "center" },
  pressed: { opacity: 0.75 },
});
