import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

type Props = { onOpenMap: () => void };

export default function OrganizationMapPreview({ onOpenMap }: Props) {
  return (
    <Card radius={RADIUS.lg} style={styles.card} onPress={onOpenMap} borderWidth={1} borderColor={COLORS.border}>
      <View style={styles.iconWrap}><Ionicons name="map-outline" size={34} color={COLORS.primaryStrong} /></View>
      <View style={styles.copy}>
        <AppText variant="h3" weight="bold">خريطة الحالات والخدمات</AppText>
        <AppText variant="body" color={COLORS.textSecondary}>افتح الخريطة لرؤية البيانات الحقيقية القادمة من الخادم والمواقع المتاحة حول الجمعية.</AppText>
      </View>
      <Button title="فتح الخريطة" onPress={onOpenMap} size="small" icon="navigate-outline" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: SPACING.md, alignItems: "stretch" },
  iconWrap: { width: 58, height: 58, alignSelf: "center", borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surfaceMuted },
  copy: { gap: SPACING.xs, alignItems: "stretch" },
});
