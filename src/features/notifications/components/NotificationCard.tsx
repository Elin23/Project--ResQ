import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { NotificationItem } from "../constants/notifications";

type Props = {
  item: NotificationItem;
  onPress: () => void;
};

const categoryStyle = {
  reports: { backgroundColor: COLORS.contactPhoneBg, color: COLORS.brown },
  volunteering: { backgroundColor: COLORS.orgStatBlueBg, color: COLORS.bgblue },
  adoption: { backgroundColor: COLORS.orgStatGreenBg, color: COLORS.successDark },
} as const;

export default function NotificationCard({ item, onPress }: Props) {
  const palette = categoryStyle[item.category];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        item.unread ? styles.unreadCard : styles.readCard,
        pressed && styles.pressed,
      ]}
    >
      {item.unread ? <View style={styles.unreadBar} /> : null}
      <View style={[styles.iconWrap, { backgroundColor: palette.backgroundColor }]}>
        <Ionicons name={item.icon} size={22} color={palette.color} />
      </View>
      <View style={styles.content}>
        <AppText weight="medium" size={FONT_SIZES.body} style={styles.title}>
          {item.title}
        </AppText>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
          <AppText size={FONT_SIZES.caption} color={COLORS.textMuted}>
            {item.time}
          </AppText>
        </View>
      </View>
      {item.unread ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    overflow: "hidden",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  unreadCard: { backgroundColor: COLORS.contactPhoneBg, borderColor: COLORS.orgStatOrangeBorder },
  readCard: { backgroundColor: COLORS.white, borderColor: COLORS.border },
  pressed: { opacity: 0.82 },
  unreadBar: { position: "absolute", right: 0, top: 0, bottom: 0, width: 5, backgroundColor: COLORS.successDark },
  iconWrap: { width: 46, height: 46, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, alignItems: "flex-end", gap: SPACING.xs },
  title: { textAlign: "right", lineHeight: 23 },
  timeRow: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.xs },
  dot: { width: 8, height: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.successDark },
});
