import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconBackgroundColor: string;
  onPress: () => void;
};

export default function SuggestedActionCard({ title, icon, color, iconBackgroundColor, onPress }: Props) {
  const { isNarrow } = useResponsiveLayout();
  return (
    <Card
      onPress={onPress}
      padding={isNarrow ? SPACING.sm : SPACING.md}
      radius={RADIUS.xl}
      backgroundColor={COLORS.surfaceMuted}
      style={[styles.card, isNarrow && styles.cardNarrow]}
    >
      <View style={[styles.iconContainer, isNarrow && styles.iconContainerNarrow, { backgroundColor: iconBackgroundColor }]}> 
        <Ionicons name={icon} size={isNarrow ? ICON_SIZES.md : ICON_SIZES.lg} color={color} />
      </View>
      <AppText weight="bold" variant="body" style={styles.title} numberOfLines={2}>{title}</AppText>
      <Ionicons name="chevron-back" size={ICON_SIZES.sm} color={COLORS.textSecondary} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 78, marginBottom: 0, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  cardNarrow: { minHeight: 68, gap: SPACING.sm },
  iconContainer: { width: 48, height: 48, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: RADIUS.full },
  iconContainerNarrow: { width: 40, height: 40 },
  title: { flex: 1, minWidth: 0 },
});
