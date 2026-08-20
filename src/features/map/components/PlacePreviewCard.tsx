import { Linking, StyleSheet, View } from "react-native";

import ActionRow from "@/src/components/ui/ActionRow";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import { getPlaceOpenState, SERVICE_PLACE_TYPE_META, type ServicePlace } from "@/src/domain/service-places";
import { RADIUS, COLORS, SPACING } from "@/src/theme";

function directionsUrl(place: ServicePlace) {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
}

export default function PlacePreviewCard({ place, onDetails }: { place: ServicePlace; onDetails: () => void }) {
  const openState = getPlaceOpenState(place);
  const meta = SERVICE_PLACE_TYPE_META[place.type];
  const callNow = () => void Linking.openURL(`tel:${place.phone.replace(/\s/g, "")}`);
  const openDirections = () => void Linking.openURL(directionsUrl(place));

  return (
    <Card disabled elevation="md" style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <AppText variant="h3" weight="bold">{place.name}</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>{place.address}</AppText>
        </View>
        <Chip label={meta.label} soft color={COLORS.secondaryStrong} />
      </View>
      <View style={styles.quickInfo}>
        <AppText variant="bodySmall" color={COLORS.textSecondary}>الهاتف: {place.phone}</AppText>
        {typeof place.acceptsFreeCases === "boolean" ? (
          <AppText variant="bodySmall" color={place.acceptsFreeCases ? COLORS.successDark : COLORS.textMuted}>
            {place.acceptsFreeCases ? "تستقبل بعض الحالات مجانًا" : "لا يوجد استقبال مجاني معلن"}
          </AppText>
        ) : null}
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: openState.isOpen ? COLORS.success : COLORS.danger }]} />
        <AppText variant="label" color={openState.isOpen ? COLORS.success : COLORS.danger}>{openState.label}</AppText>
        {openState.nextChangeLabel ? <AppText variant="caption" color={COLORS.textMuted}>• {openState.nextChangeLabel}</AppText> : null}
      </View>
      <ActionRow style={styles.actions}>
        <Button title="اتصل الآن" icon="call-outline" size="small" fullWidth={false} onPress={callNow} />
        <Button title="الاتجاهات" icon="navigate-outline" variant="outline" size="small" fullWidth={false} onPress={openDirections} />
        <Button title="التفاصيل" variant="text" size="small" fullWidth={false} onPress={onDetails} />
      </ActionRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: SPACING.sm },
  topRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.sm },
  titleBlock: { flex: 1, alignItems: "stretch", gap: SPACING.xs },
  quickInfo: { width: "100%", alignItems: "stretch", gap: SPACING.xxs },
  statusRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  statusDot: { width: 8, height: 8, borderRadius: RADIUS.xs },
  actions: { flexWrap: "wrap" },
});
