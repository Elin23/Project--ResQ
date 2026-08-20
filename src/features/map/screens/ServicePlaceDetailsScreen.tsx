import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ActionRow from "@/src/components/ui/ActionRow";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { formatOpeningHours, getPlaceOpenState, SERVICE_PLACE_TYPE_META } from "@/src/domain/service-places";
import { RADIUS, COLORS, ICON_SIZES, LAYOUT, SPACING } from "@/src/theme";
import ServicePlacesMap from "../components/ServicePlacesMap";
import { useServicePlaceDetails } from "../hooks/useServicePlaceDetails";

export default function ServicePlaceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: place, isLoading, error, refetch } = useServicePlaceDetails(id);

  if (isLoading) {
    return (
      <Screen scroll={false} padded={false}>
        <ScreenHeader title="تفاصيل الجهة" onBack={() => router.back()} />
        <View style={styles.state}><AppText variant="bodySmall" color={COLORS.textSecondary}>جاري تحميل التفاصيل…</AppText></View>
      </Screen>
    );
  }

  if (error || !place) {
    return (
      <Screen scroll={false} padded={false}>
        <ScreenHeader title="تفاصيل الجهة" onBack={() => router.back()} />
        <View style={styles.state}>
          <EmptyState title="تعذر عرض الجهة" description={error ?? "هذه الجهة غير متاحة."} />
          {error ? <Button title="إعادة المحاولة" onPress={() => void refetch()} /> : null}
        </View>
      </Screen>
    );
  }

  const meta = SERVICE_PLACE_TYPE_META[place.type];
  const openState = getPlaceOpenState(place);
  const callNow = () => void Linking.openURL(`tel:${place.phone.replace(/\s/g, "")}`);
  const directions = () => void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`);

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <ScreenHeader title="تفاصيل الجهة" onBack={() => router.back()} />

      <View style={styles.body}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={ICON_SIZES.xl} color={COLORS.primaryStrong} />
        </View>
        <View style={styles.heroText}>
          <AppText variant="h2" weight="bold">{place.name}</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>{place.address}</AppText>
          <View style={styles.badges}>
            <Chip label={meta.label} soft color={COLORS.secondaryStrong} />
            {place.verified ? <Chip label="موثقة" icon="checkmark-circle" soft color={COLORS.info} /> : null}
          </View>
        </View>
      </View>

      <Card disabled style={styles.statusCard}>
        <View style={[styles.statusDot, { backgroundColor: openState.isOpen ? COLORS.success : COLORS.danger }]} />
        <View style={styles.statusText}>
          <AppText variant="body" weight="bold" color={openState.isOpen ? COLORS.success : COLORS.danger}>{openState.label}</AppText>
          {openState.nextChangeLabel ? <AppText variant="bodySmall" color={COLORS.textSecondary}>{openState.nextChangeLabel}</AppText> : null}
        </View>
      </Card>

      <ActionRow>
        <Button title="اتصل الآن" icon="call-outline" fullWidth={false} onPress={callNow} />
        <Button title="الاتجاهات" icon="navigate-outline" variant="outline" fullWidth={false} onPress={directions} />
      </ActionRow>

      {place.description ? (
        <Card disabled style={styles.sectionCard}>
          <AppText variant="h3" weight="bold">عن الجهة</AppText>
          <AppText variant="body" color={COLORS.textSecondary}>{place.description}</AppText>
        </Card>
      ) : null}

      <Card disabled style={styles.sectionCard}>
        <AppText variant="h3" weight="bold">معلومات التواصل</AppText>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={ICON_SIZES.md} color={COLORS.textSecondary} />
          <AppText variant="body" direction="ltr" align="left">{place.phone}</AppText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={ICON_SIZES.md} color={COLORS.textSecondary} />
          <AppText variant="body">{place.address}</AppText>
        </View>
        {typeof place.acceptsFreeCases === "boolean" ? (
          <View style={styles.infoRow}>
            <Ionicons name={place.acceptsFreeCases ? "heart-circle-outline" : "information-circle-outline"} size={ICON_SIZES.md} color={place.acceptsFreeCases ? COLORS.successDark : COLORS.textSecondary} />
            <AppText variant="body" color={place.acceptsFreeCases ? COLORS.successDark : COLORS.textSecondary}>
              {place.acceptsFreeCases ? "تستقبل بعض الحالات مجانًا" : "لا يوجد استقبال مجاني معلن حاليًا"}
            </AppText>
          </View>
        ) : null}
      </Card>

      <Card disabled style={styles.sectionCard}>
        <AppText variant="h3" weight="bold">ساعات العمل</AppText>
        <View style={styles.hours}>
          {place.openingHours.map((item) => (
            <AppText key={item.day} variant="bodySmall" color={COLORS.textSecondary}>{formatOpeningHours(item)}</AppText>
          ))}
        </View>
      </Card>

      <Card disabled padding={0} style={styles.mapCard}>
        <ServicePlacesMap places={[place]} selectedId={place.id} onSelectPlace={() => undefined} height={240} />
      </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: SPACING.md },
  body: { paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.md },
  state: { flex: 1, paddingHorizontal: LAYOUT.screenPadding, alignItems: "center", justifyContent: "center", gap: SPACING.md },
  hero: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  iconWrap: { width: 64, height: 64, borderRadius: RADIUS["2xl"], alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primarySoft },
  heroText: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  badges: { width: "100%", flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.xs },
  statusCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  statusDot: { width: 10, height: 10, borderRadius: RADIUS.xs },
  statusText: { flex: 1, alignItems: "stretch" },
  sectionCard: { gap: SPACING.sm },
  infoRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  hours: { gap: SPACING.xs },
  mapCard: { overflow: "hidden" },
});
