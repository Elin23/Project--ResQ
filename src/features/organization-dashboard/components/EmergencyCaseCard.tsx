import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { EmergencyRescueCase } from "../types/organizationDashboard";

type Props = {
  item: EmergencyRescueCase;
  accepted: boolean;
  onOpen: () => void;
  onAccept: () => void;
};

export default function EmergencyCaseCard({ item, accepted, onOpen, onAccept }: Props) {
  return (
    <Card disabled padding={0} radius={RADIUS.lg} style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`عرض تفاصيل ${item.title}`} onPress={onOpen}>
        <View>
          <Image source={item.image} style={styles.image} />
        {item.urgent ? (
          <View style={styles.urgentBadge}>
            <View style={styles.urgentDot} />
            <AppText size={FONT_SIZES.caption} color={COLORS.white}>حالة حرجة</AppText>
          </View>
          ) : null}
        </View>
        <View style={styles.bodyText}>
          <AppText weight="medium" size={FONT_SIZES.body} style={styles.title}>{item.title}</AppText>
          <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary} style={styles.meta}>
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
  card: { width: 280, marginBottom: 0 },
  image: { width: "100%", height: 150, resizeMode: "cover" },
  urgentBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.danger,
  },
  urgentDot: { width: 6, height: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.white },
  bodyText: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, gap: SPACING.xs },
  buttonArea: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  title: { textAlign: "right", writingDirection: "rtl" },
  meta: { textAlign: "right", writingDirection: "rtl", marginBottom: SPACING.sm },
});
