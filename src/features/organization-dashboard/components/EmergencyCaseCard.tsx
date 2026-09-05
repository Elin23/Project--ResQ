import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { useResponsiveCardWidth } from "@/src/hooks/useResponsiveCardWidth";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { EmergencyRescueCase } from "../types/organizationDashboard";

type Props = {
  item: EmergencyRescueCase;
  accepted: boolean;
  onOpen: () => void;
  onAccept: () => void;
};

export default function EmergencyCaseCard({ item, accepted, onOpen, onAccept }: Props) {
  const cardWidth = useResponsiveCardWidth({ maxWidth: 292, minWidth: 232 });

  return (
    <Card disabled padding={0} radius={RADIUS.lg} style={[styles.card, { width: cardWidth }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`عرض تفاصيل ${item.title}`} onPress={onOpen}>
        <View>
          <Image source={item.image} style={styles.image} />
        {item.urgent ? (
          <View style={styles.urgentBadge}>
            <View style={styles.urgentDot} />
            <AppText variant="caption" color={COLORS.white}>حالة حرجة</AppText>
          </View>
          ) : null}
        </View>
        <View style={styles.bodyText}>
          <AppText variant="body" weight="medium" style={styles.title}>{item.title}</AppText>
          <AppText variant="caption" color={COLORS.textSecondary} style={styles.meta}>
            {item.reportedAgo} • {item.location} • {item.distance}
          </AppText>
        </View>
      </Pressable>
      <View style={styles.buttonArea}>
        <Button
          title={accepted ? "تم استلام الحالة" : "استلام الحالة"}
          onPress={onAccept}
          size="medium"
          backgroundColor={accepted ? COLORS.secondary : COLORS.primary}
          borderColor={accepted ? COLORS.secondary : COLORS.primary}
          textColor={COLORS.brownDark}
          disabled={accepted}
          radius={RADIUS.md}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 0 },
  image: { width: "100%", height: 150, resizeMode: "cover" },
  urgentBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.dangerFill,
  },
  urgentDot: { width: 6, height: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.surface },
  bodyText: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, gap: SPACING.xs },
  buttonArea: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  title: { textAlign: "auto", writingDirection: "rtl" },
  meta: { textAlign: "auto", writingDirection: "rtl", marginBottom: SPACING.sm },
});
