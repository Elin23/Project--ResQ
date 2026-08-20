import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationTaskChecklistKey } from "../types/organizationTask";

const ITEMS: { key: OrganizationTaskChecklistKey; label: string }[] = [
  { key: "arrived", label: "الوصول للموقع" },
  { key: "assessed", label: "تقييم الحالة الميداني" },
  { key: "secured", label: "تأمين الحيوان" },
];

type Props = { value: Record<OrganizationTaskChecklistKey, boolean>; onToggle: (key: OrganizationTaskChecklistKey) => void };

export default function TaskChecklist({ value, onToggle }: Props) {
  return <View style={styles.list}>{ITEMS.map((item) => (
    <Pressable key={item.key} accessibilityRole="checkbox" accessibilityState={{ checked: value[item.key] }} onPress={() => onToggle(item.key)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <AppText color={value[item.key] ? COLORS.text : COLORS.textSecondary}>{item.label}</AppText>
      <View style={[styles.box, value[item.key] && styles.boxChecked]}>{value[item.key] ? <Ionicons name="checkmark" size={16} color={COLORS.white} /> : null}</View>
    </Pressable>
  ))}</View>;
}

const styles = StyleSheet.create({
  list: { gap: SPACING.sm },
  row: { minHeight: 52, flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.rescueInput },
  box: { width: 23, height: 23, borderWidth: 1.5, borderColor: COLORS.tan, borderRadius: RADIUS.xs, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white },
  boxChecked: { borderColor: COLORS.secondary, backgroundColor: COLORS.secondary },
  pressed: { opacity: 0.75 },
});
