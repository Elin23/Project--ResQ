import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import ListItem from "@/src/components/ui/ListItem";
import DirectionalIcon from "@/src/components/ui/DirectionalIcon";
import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { ProfileMenuSection as Section } from "../types/profile";

export default function ProfileMenuSection({ section, onPress }: { section: Section; onPress: (route?: import("expo-router").Href, label?: string) => void }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" weight="bold" color={COLORS.textSecondary}>{section.title}</AppText>
      <View style={styles.card}>
        {section.items.map((item, index) => (
          <ListItem
            key={item.id}
            title={item.label}
            onPress={() => onPress(item.route, item.label)}
            style={index < section.items.length - 1 ? styles.border : undefined}
            leading={<View style={styles.leading}><Ionicons name={item.icon} size={ICON_SIZES.md} color={item.color} /></View>}
            trailing={<View style={styles.trailing}>{item.value ? <AppText variant="label" color={COLORS.warning}>{item.value}</AppText> : null}<DirectionalIcon direction="next" size={ICON_SIZES.sm} color={COLORS.brownMuted} /></View>}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm, marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  border: { borderBottomWidth: 1, borderBottomColor: COLORS.divider, borderRadius: RADIUS.xs },
  leading: { width: 32, alignItems: "center", justifyContent: "center" },
  trailing: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
});
