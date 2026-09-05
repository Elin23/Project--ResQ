import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import MetaRow from "@/src/components/ui/MetaRow";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { NotificationItem } from "../constants/notifications";

type Props = { item: NotificationItem; onPress: () => void };
const categoryStyle = {
  reports: { backgroundColor: COLORS.contactPhoneBg, color: COLORS.brown },
  volunteering: { backgroundColor: COLORS.orgStatBlueBg, color: COLORS.bgblue },
  adoption: { backgroundColor: COLORS.orgStatGreenBg, color: COLORS.successDark },
} as const;

export default function NotificationCard({ item, onPress }: Props) {
  const palette = categoryStyle[item.category];
  return (
    <Card accessibilityLabel={item.title} onPress={onPress} padding={SPACING.md} backgroundColor={item.unread ? COLORS.contactPhoneBg : COLORS.surfaceElevated} borderColor={item.unread ? COLORS.orgStatOrangeBorder : COLORS.border} style={styles.card}>
      {item.unread ? <View style={styles.unreadBar} /> : null}
      <View style={[styles.iconWrap, { backgroundColor: palette.backgroundColor }]}><Ionicons name={item.icon} size={22} color={palette.color} /></View>
      <View style={styles.content}><AppText weight="medium" variant="body" numberOfLines={2}>{item.title}</AppText><MetaRow icon="time-outline" text={item.time} color={COLORS.textMuted} /></View>
      {item.unread ? <View style={styles.dot} /> : null}
    </Card>
  );
}
const styles = StyleSheet.create({
  card: { position: "relative", flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.sm },
  unreadBar: { position: "absolute", start: 0, top: 0, bottom: 0, width: 4, backgroundColor: COLORS.successDarkFill },
  iconWrap: { width: 44, height: 44, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, gap: SPACING.xs, minWidth: 0 },
  dot: { width: 8, height: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.successDarkFill },
});
