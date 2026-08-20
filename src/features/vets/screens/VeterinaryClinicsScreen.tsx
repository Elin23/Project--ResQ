import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { getPlaceOpenState, type ServicePlace } from "@/src/domain/service-places";
import ServicePlacesMap from "@/src/features/map/components/ServicePlacesMap";
import { useSession } from "@/src/features/session/SessionContext";
import { veterinaryClinicDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useVeterinaryClinics } from "../hooks/useVeterinaryClinics";

type FilterKey = "all" | "open" | "24h";

function distanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function openDirections(clinic: ServicePlace) {
  const query = encodeURIComponent(`${clinic.latitude},${clinic.longitude}`);
  return Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
}

export default function VeterinaryClinicsScreen() {
  const router = useRouter();
  const { accountKind } = useSession();
  const state = useVeterinaryClinics();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    void (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      if (!permission.granted) return;
      try {
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      } catch {
        // Distance is optional and the list remains fully usable without location.
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    return state.clinics
      .filter((clinic) => {
        if (normalized && !`${clinic.name} ${clinic.address}`.toLocaleLowerCase("ar").includes(normalized)) {
          return false;
        }
        if (filter === "open" && !getPlaceOpenState(clinic).isOpen) return false;
        if (filter === "24h" && !clinic.emergency24h) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.verified !== b.verified) return Number(Boolean(b.verified)) - Number(Boolean(a.verified));
        if (!userLocation) return a.name.localeCompare(b.name, "ar");
        return distanceKm(userLocation, a) - distanceKm(userLocation, b);
      });
  }, [filter, query, state.clinics, userLocation]);

  const recommended = filtered.filter((clinic) => clinic.verified).slice(0, 3);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل العيادات..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;

  const openDetails = (clinic: ServicePlace) =>
    router.push(veterinaryClinicDetailsRoute(clinic.id, accountKind));

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="العيادات البيطرية" subtitle="اعثر على عيادة مناسبة بالقرب منك" onBack={() => router.back()} />
      <View style={styles.content}>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث عن عيادة أو منطقة..."
          icon="search-outline"
          returnKeyType="search"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="الكل" selected={filter === "all"} onPress={() => setFilter("all")} />
          <Chip label="مفتوحة الآن" icon="time-outline" selected={filter === "open"} onPress={() => setFilter("open")} />
          <Chip label="طوارئ 24 ساعة" icon="medical-outline" selected={filter === "24h"} onPress={() => setFilter("24h")} />
        </ScrollView>

        {recommended.length ? (
          <>
            <SectionTitle title="عيادات موصى بها" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedRow}>
              {recommended.map((clinic) => (
                <RecommendedClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  distance={userLocation ? distanceKm(userLocation, clinic) : undefined}
                  onPress={() => openDetails(clinic)}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        <SectionTitle title="على الخريطة" />
        {filtered.length ? (
          <View style={styles.mapCard}>
            <ServicePlacesMap
              places={filtered}
              selectedId={selectedId}
              onSelectPlace={setSelectedId}
              userCoordinate={userLocation}
              height={230}
            />
            {selectedId ? (
              <Button
                title="عرض العيادة المحددة"
                icon="eye-outline"
                variant="outline"
                onPress={() => {
                  const clinic = filtered.find((item) => item.id === selectedId);
                  if (clinic) openDetails(clinic);
                }}
              />
            ) : null}
          </View>
        ) : (
          <EmptyState title="لا توجد عيادات مطابقة" description="جرّب تغيير البحث أو الفلتر." />
        )}

        <SectionTitle title="جميع العيادات" />
        <View style={styles.list}>
          {filtered.map((clinic) => (
            <ClinicListCard
              key={clinic.id}
              clinic={clinic}
              distance={userLocation ? distanceKm(userLocation, clinic) : undefined}
              onDetails={() => openDetails(clinic)}
              onCall={() => void Linking.openURL(`tel:${clinic.phone}`)}
              onDirections={() => void openDirections(clinic)}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <AppText variant="h2" weight="bold">{title}</AppText>;
}

function RecommendedClinicCard({
  clinic,
  distance,
  onPress,
}: {
  clinic: ServicePlace;
  distance?: number;
  onPress: () => void;
}) {
  const openState = getPlaceOpenState(clinic);
  return (
    <Card onPress={onPress} style={styles.recommendedCard}>
      <View style={styles.recommendedIcon}>
        <Ionicons name="medkit-outline" size={28} color={COLORS.primaryStrong} />
      </View>
      <AppText variant="label" weight="bold" numberOfLines={2}>{clinic.name}</AppText>
      <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={2}>{clinic.address}</AppText>
      <View style={styles.inlineMeta}>
        <AppText variant="caption" color={openState.isOpen ? COLORS.success : COLORS.textMuted}>{openState.label}</AppText>
        {distance !== undefined ? <AppText variant="caption" color={COLORS.textMuted}>{distance.toFixed(1)} كم</AppText> : null}
      </View>
      {clinic.emergency24h ? (
        <View style={styles.emergencyBadge}>
          <Ionicons name="flash-outline" size={14} color={COLORS.danger} />
          <AppText variant="caption" weight="bold" color={COLORS.danger}>طوارئ 24 ساعة</AppText>
        </View>
      ) : null}
    </Card>
  );
}

function ClinicListCard({
  clinic,
  distance,
  onDetails,
  onCall,
  onDirections,
}: {
  clinic: ServicePlace;
  distance?: number;
  onDetails: () => void;
  onCall: () => void;
  onDirections: () => void;
}) {
  const openState = getPlaceOpenState(clinic);
  return (
    <Card disabled style={styles.clinicCard}>
      <View style={styles.clinicTop}>
        <View style={styles.clinicAvatar}>
          <Ionicons name="medkit-outline" size={25} color={COLORS.primaryStrong} />
        </View>
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <AppText variant="h3" weight="bold">{clinic.name}</AppText>
            {clinic.verified ? <Ionicons name="shield-checkmark" size={17} color={COLORS.success} /> : null}
          </View>
          <AppText variant="caption" color={COLORS.textSecondary}>{clinic.address}</AppText>
          <View style={styles.inlineMeta}>
            <AppText variant="caption" color={openState.isOpen ? COLORS.success : COLORS.textMuted}>{openState.label}</AppText>
            {openState.nextChangeLabel ? <AppText variant="caption" color={COLORS.textMuted}>• {openState.nextChangeLabel}</AppText> : null}
            {distance !== undefined ? <AppText variant="caption" color={COLORS.textMuted}>• {distance.toFixed(1)} كم</AppText> : null}
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="اتصال" icon="call-outline" size="small" fullWidth={false} onPress={onCall} />
        <Button title="الاتجاهات" icon="navigate-outline" variant="outline" size="small" fullWidth={false} onPress={onDirections} />
        <Button title="التفاصيل" icon="chevron-back-outline" variant="ghost" size="small" fullWidth={false} onPress={onDetails} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.lg },
  filters: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  recommendedRow: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  recommendedCard: { width: 220, gap: SPACING.sm },
  recommendedIcon: { width: 52, height: 52, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  inlineMeta: { flexDirection: "row", direction: "rtl", alignItems: "center", flexWrap: "wrap", gap: SPACING.xs },
  emergencyBadge: { alignSelf: "flex-start", flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerSoft },
  mapCard: { gap: SPACING.sm },
  list: { gap: SPACING.sm },
  clinicCard: { gap: SPACING.md },
  clinicTop: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  clinicAvatar: { width: 58, height: 58, borderRadius: RADIUS.lg, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  nameRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  actions: { flexDirection: "row", direction: "rtl", alignItems: "center", flexWrap: "wrap", gap: SPACING.sm },
  flex: { flex: 1 },
});