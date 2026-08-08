import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { Organization } from "../types/organization";

type Props = { organization: Organization; onOpen: () => void; onContact: () => void };

export default function OrganizationCard({ organization, onOpen, onContact }: Props) {
  return <Card padding={SPACING.md} radius={RADIUS.lg} borderWidth={1} shadow>
    <View style={styles.header}>
      <Image source={organization.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <AppText weight="bold" size={FONT_SIZES.title} numberOfLines={1} style={styles.title}>{organization.name}</AppText>
          <AppText size={FONT_SIZES.label} color={COLORS.primary}>★ {organization.rating}</AppText>
        </View>
        <View style={styles.metaRow}>
          {organization.verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.successDark} />}
          <AppText size={FONT_SIZES.label} color={COLORS.successDark}>جهة موثقة</AppText>
          <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>• {organization.city}</AppText>
        </View>
        <AppText color={COLORS.textSecondary} numberOfLines={2} style={styles.description}>{organization.description}</AppText>
      </View>
    </View>
    <View style={styles.chips}>{organization.services.slice(0,3).map((service) => <View key={service} style={styles.chip}><AppText size={FONT_SIZES.caption} color={COLORS.successDark}>{service}</AppText></View>)}</View>
    <View style={styles.actions}>
      <Button title="عرض الملف التعريفي" onPress={onOpen} size="medium" style={styles.action} />
      <Button title="تواصل" onPress={onContact} variant="outline" size="medium" icon="chatbubble-outline" style={styles.action} />
    </View>
  </Card>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", gap: SPACING.md },
  image: { width: 78, height: 92, borderRadius: RADIUS.sm, backgroundColor: COLORS.lightgray },
  info: { flex: 1 },
  titleRow: { flexDirection: "row-reverse", justifyContent: "space-between", gap: SPACING.sm },
  title: { flex: 1 },
  metaRow: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.xs, marginTop: SPACING.xs },
  description: { marginTop: SPACING.sm, lineHeight: 23 },
  chips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: SPACING.sm, marginVertical: SPACING.md },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm, backgroundColor: COLORS.successLight },
  actions: { flexDirection: "row-reverse", gap: SPACING.sm },
  action: { flex: 1 },
});
