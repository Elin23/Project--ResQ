import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import RemoteImage from "@/src/components/ui/RemoteImage";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import type { PublicContent } from "@/src/domain/content/content";
import { COLORS, SPACING } from "@/src/theme";

type Props = { item: PublicContent; onPress: () => void; compact?: boolean };

export default function ContentCard({ item, onPress, compact = false }: Props) {
  return (
    <Card onPress={onPress} padding={0} elevation="sm" style={compact ? styles.compactCard : undefined}>
      <RemoteImage uri={item.coverImageUrl} style={[styles.image, compact && styles.compactImage]} accessibilityLabel={item.title} />
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>{item.category}</AppText>
          <View style={styles.readingRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.iconMuted} />
            <AppText variant="caption" color={COLORS.textMuted}>{item.readingMinutes} دقائق</AppText>
          </View>
        </View>
        <AppText variant={compact ? "body" : "h3"} weight="bold" numberOfLines={2}>{item.title}</AppText>
        {!compact ? <AppText variant="bodySmall" color={COLORS.textSecondary} numberOfLines={3} style={styles.excerpt}>{item.excerpt}</AppText> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  compactCard: { width: 250 },
  image: { width: "100%", height: 175, backgroundColor: COLORS.surfaceMuted },
  compactImage: { height: 128 },
  body: { padding: SPACING.md, gap: SPACING.xs },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  readingRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: 4 },
  excerpt: { marginTop: 2 },
});
