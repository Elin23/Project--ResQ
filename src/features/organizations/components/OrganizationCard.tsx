import { Image, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import ActionRow from "@/src/components/ui/ActionRow";
import MetaRow from "@/src/components/ui/MetaRow";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { Organization } from "../types/organization";

type Props = { organization: Organization; onOpen: () => void; onContact: () => void };

export default function OrganizationCard({ organization, onOpen, onContact }: Props) {
  const { isNarrow } = useResponsiveLayout();
  return <Card padding={SPACING.md} radius={RADIUS.lg} borderWidth={1} shadow>
    <View style={[styles.header, isNarrow && styles.headerNarrow]}>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <AppText weight="bold" size={FONT_SIZES.title} numberOfLines={2} style={styles.title}>{organization.name}</AppText>
          <AppText size={FONT_SIZES.label} color={COLORS.primary}>★ {organization.rating}</AppText>
        </View>
        <View style={styles.metaRow}>
          {organization.verified ? <StatusBadge label="جهة موثقة" color={COLORS.successDark} icon="checkmark-circle" size="sm" /> : null}
          <MetaRow icon="location-outline" text={organization.city} />
        </View>
        <AppText color={COLORS.textSecondary} numberOfLines={2} style={styles.description}>{organization.description}</AppText>
      </View>
      <Image source={organization.image} style={[styles.image, isNarrow && styles.imageNarrow]} resizeMode="cover" />
    </View>
    <View style={styles.chips}>{organization.services.slice(0,3).map((service) => <View key={service} style={styles.chip}><AppText size={FONT_SIZES.caption} color={COLORS.successDark}>{service}</AppText></View>)}</View>
    <ActionRow style={isNarrow ? styles.actionsNarrow : undefined}>
      <Button title="عرض الملف التعريفي" onPress={onOpen} size="medium" style={styles.action} />
      <Button title="تواصل" onPress={onContact} variant="outline" size="medium" icon="chatbubble-outline" style={styles.action} />
    </ActionRow>
  </Card>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", direction: "rtl", gap: SPACING.md },
  headerNarrow: { gap: SPACING.sm },
  image: { width: 78, height: 92, borderRadius: RADIUS.sm, backgroundColor: COLORS.lightgray },
  imageNarrow: { width: 64, height: 76 },
  info: { flex: 1, minWidth: 0, alignItems: "stretch" },
  titleRow: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", gap: SPACING.sm },
  title: { flex: 1, width: "100%" },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, marginTop: SPACING.xs },
  description: { width: "100%", marginTop: SPACING.sm, lineHeight: 23 },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm, marginVertical: SPACING.md },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm, backgroundColor: COLORS.successLight },
  actionsNarrow: { flexDirection: "column" },
  action: { flex: 1 },
});
