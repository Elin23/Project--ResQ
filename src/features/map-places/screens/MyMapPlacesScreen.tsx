import { RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import RefreshStatus from "@/src/components/ui/RefreshStatus";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ScreenSection from "@/src/components/ui/ScreenSection";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { SERVICE_PLACE_TYPE_META, type MapPlaceApplicationStatus } from "@/src/domain/service-places";
import { COLORS, SPACING } from "@/src/theme";
import { mapPlaceApplicationDetailsRoute, mapPlaceEditRoute, ROUTES } from "@/src/navigation/routes";
import { useMyMapPlaces } from "../hooks/useMyMapPlaces";

const APPLICATION_STATUS: Record<MapPlaceApplicationStatus, { label: string; color: string }> = {
  draft: { label: "مسودة", color: COLORS.textSecondary },
  pending: { label: "قيد المراجعة", color: COLORS.warning },
  approved: { label: "تمت الموافقة", color: COLORS.successDark },
  rejected: { label: "بحاجة لتعديل", color: COLORS.danger },
  cancelled: { label: "ملغي", color: COLORS.textSecondary },
};

export default function MyMapPlacesScreen() {
  const router = useRouter();
  const { account } = useSession();
  const userId = account?.kind === "user" ? account.id : "";
  const { places, applications, loading, refreshing, refreshError, isStale, lastUpdatedAt, error, reload } = useMyMapPlaces(userId);

  return (
    <Screen
      scroll
      padded={false}
      surface="app"
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={() => void reload()} tintColor={COLORS.primary} colors={[COLORS.primary]} />,
      }}
    >
      <ScreenHeader title="جهاتي على الخريطة" subtitle="طلبات الظهور والجهات التي تديرها" onBack={() => router.back()} />
      <View style={styles.content}>
        <Button title="إضافة جهة إلى الخريطة" icon="add-circle-outline" onPress={() => router.push(ROUTES.mapPlaceApply)} />

        <RefreshStatus refreshing={refreshing} error={refreshError} stale={isStale} lastUpdatedAt={lastUpdatedAt} onRetry={() => void reload()} />
        {loading ? <SkeletonList count={3} compact /> : null}
        {error ? <ErrorState description={error} onRetry={reload} /> : null}

        {!loading && !error ? (
          <>
            <ScreenSection title="الجهات المعتمدة">
              {places.length === 0 ? (
                <EmptyState compact icon="location-outline" title="لا توجد جهة معتمدة بعد" description="بعد الموافقة على طلبك ستظهر الجهة هنا ويمكنك تعديل معلوماتها." />
              ) : places.map((place) => (
                <Card key={place.id} onPress={() => router.push(mapPlaceEditRoute(place.id))}>
                  <View style={styles.row}>
                    <View style={styles.flex}>
                      <AppText weight="bold">{place.name}</AppText>
                      <AppText variant="caption" color={COLORS.textSecondary}>{SERVICE_PLACE_TYPE_META[place.type].label} · {place.address}</AppText>
                    </View>
                    <StatusBadge label="معتمدة" color={COLORS.successDark} icon="checkmark-circle-outline" size="sm" />
                  </View>
                  <AppText variant="caption" color={COLORS.primaryStrong} style={styles.link}>تعديل معلومات الجهة</AppText>
                </Card>
              ))}
            </ScreenSection>

            <ScreenSection title="طلبات الظهور">
              {applications.length === 0 ? (
                <EmptyState compact icon="document-text-outline" title="لا توجد طلبات" description="يمكنك تقديم طلب لعيادة أو متجر أو فندق حيوانات أو أي جهة خدمية مناسبة." />
              ) : applications.map((application) => {
                const meta = APPLICATION_STATUS[application.status];
                return (
                  <Card key={application.id} onPress={() => router.push(mapPlaceApplicationDetailsRoute(application.id))}>
                    <View style={styles.row}>
                      <View style={styles.flex}>
                        <AppText weight="bold">{application.name}</AppText>
                        <AppText variant="caption" color={COLORS.textSecondary}>{SERVICE_PLACE_TYPE_META[application.requestedType].label} · {application.address}</AppText>
                      </View>
                      <StatusBadge label={meta.label} color={meta.color} size="sm" />
                    </View>
                  </Card>
                );
              })}
            </ScreenSection>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.lg },
  row: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  flex: { flex: 1, gap: SPACING.xxs },
  link: { marginTop: SPACING.sm },
});
