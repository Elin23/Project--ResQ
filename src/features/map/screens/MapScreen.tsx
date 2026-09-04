import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import RefreshStatus from "@/src/components/ui/RefreshStatus";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import ScreenSection from "@/src/components/ui/ScreenSection";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import type { ServicePlaceType } from "@/src/domain/service-places";
import { useSession } from "@/src/features/session/SessionContext";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { ROUTES, servicePlaceDetailsRoute } from "@/src/navigation/routes";
import { COLORS, LAYOUT, SPACING } from "@/src/theme";
import PlaceListCard from "../components/PlaceListCard";
import PlacePreviewCard from "../components/PlacePreviewCard";
import ServicePlacesMap from "../components/ServicePlacesMap";
import { useServicePlaces } from "../hooks/useServicePlaces";

const FILTERS: { label: string; value?: ServicePlaceType }[] = [
  { label: "الكل" },
  { label: "عيادات", value: "clinic" },
  { label: "جمعيات", value: "organization" },
  { label: "ملاجئ", value: "shelter" },
  { label: "مستلزمات", value: "pet_store" },
  { label: "فنادق", value: "pet_hotel" },
  { label: "مقاهي قطط", value: "cat_cafe" },
];

export default function MapScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const browseKind = account?.kind === "organization" && account.status === "pending" ? "user" : accountKind;
  const { handlePermission } = usePermissionFeedback();
  const { showFeedback } = useFeedback();
  const [type, setType] = useState<ServicePlaceType | undefined>();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userCoordinate, setUserCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const query = useMemo(() => ({ type, search }), [search, type]);
  const { data: places, isLoading, isRefreshing, refreshError, isStale, lastUpdatedAt, error, refetch } = useServicePlaces(query);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) ?? null,
    [places, selectedId],
  );

  const openDetails = (id: string) => router.push(servicePlaceDetailsRoute(id, browseKind));

  const locateMe = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!handlePermission(permission, { title: "صلاحية الموقع مطلوبة", message: "اسمح بالوصول إلى الموقع لعرض موقعك الحالي على الخريطة." })) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserCoordinate({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    } catch {
      showFeedback({ title: "تعذر تحديد موقعك", message: "يمكنك تصفح الخريطة واختيار الجهات يدويًا.", tone: "warning" });
    } finally {
      setLocating(false);
    }
  };

  return (
    <Screen
      scroll
      padded={false}
      safeAreaEdges={["top", "right", "left"]}
      contentContainerStyle={styles.content}
      scrollProps={{
        refreshControl: <RefreshControl refreshing={isRefreshing} onRefresh={() => void refetch()} tintColor={COLORS.primary} colors={[COLORS.primary]} />,
      }}
    >
      <ScreenHeader title="الخريطة" subtitle="الخدمات الحيوانية القريبة منك" />

      <View style={styles.controls}>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث باسم الجهة أو العنوان"
          icon="search-outline"
          returnKeyType="search"
          containerStyle={styles.searchInput}
        />
        <View style={styles.filters}>
          {FILTERS.map((filter) => (
            <Chip
              key={filter.label}
              label={filter.label}
              selected={type === filter.value}
              onPress={() => {
                setType(filter.value);
                setSelectedId(null);
              }}
            />
          ))}
        </View>
      </View>

      <RefreshStatus refreshing={isRefreshing} error={refreshError} stale={isStale} lastUpdatedAt={lastUpdatedAt} onRetry={() => void refetch()} style={styles.refreshStatus} />
      {accountKind === "user" ? (
        <View style={styles.joinMapWrap}>
          <Card disabled style={styles.joinMapCard}>
            <View style={styles.joinMapCopy}>
              <AppText variant="h3" weight="bold" align="center">هل لديك جهة تهم محبي الحيوانات؟</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary} align="center">
                إذا كنت تدير عيادة، متجر حيوانات، فندقًا، مأوى أو خدمة مشابهة، قدّم طلبك للظهور على الخريطة مجانًا.
              </AppText>
            </View>
            <Button title="تقديم طلب ظهور" icon="location-outline" size="small" fullWidth={false} onPress={() => router.push(ROUTES.mapPlaceApply)} />
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <SkeletonList count={3} compact style={styles.skeletons} />
      ) : error ? (
        <ErrorState description={error} onRetry={() => void refetch()} style={styles.stateBox} />
      ) : places.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="جرّب تغيير نوع الجهة أو عبارة البحث." style={styles.stateBox} />
      ) : (
        <>
          <View style={styles.mapWrap}>
            <ServicePlacesMap
              places={places}
              selectedId={selectedId}
              onSelectPlace={setSelectedId}
              userCoordinate={userCoordinate}
              height={390}
            />
            <Button
              title={locating ? "جاري تحديد موقعك…" : "موقعي الحالي"}
              icon="locate-outline"
              variant="outline"
              size="small"
              fullWidth={false}
              disabled={locating}
              onPress={() => void locateMe()}
              style={styles.locateButton}
            />
            {selectedPlace ? <PlacePreviewCard place={selectedPlace} onDetails={() => openDetails(selectedPlace.id)} /> : null}
          </View>

          <ScreenSection
            title="الخدمات المتاحة"
            subtitle={`${places.length} مواقع ضمن النتائج الحالية`}
            style={styles.nearbySection}
          >
            <View style={styles.cards}>
              {places.slice(0, 6).map((place) => (
                <PlaceListCard key={place.id} place={place} onPress={() => openDetails(place.id)} />
              ))}
            </View>
          </ScreenSection>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: SPACING.xl },
  joinMapWrap: { width: "100%", paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  joinMapCard: { alignSelf: "stretch", alignItems: "center", gap: SPACING.md },
  joinMapCopy: { width: "100%", alignItems: "center", gap: SPACING.xs },
  controls: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  searchInput: { marginBottom: SPACING.sm },
  filters: { width: "100%", flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.xs },
  mapWrap: { paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.sm },
  locateButton: { alignSelf: "flex-start" },
  nearbySection: { gap: SPACING.sm },
  cards: { paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.sm },
  stateBox: { minHeight: 320, paddingHorizontal: LAYOUT.screenPadding, alignItems: "center", justifyContent: "center", gap: SPACING.md },
  refreshStatus: { marginHorizontal: LAYOUT.screenPadding, marginTop: SPACING.sm },
  skeletons: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.md },
});
