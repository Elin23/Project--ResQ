import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import ActionRow from "../../../components/ui/ActionRow";
import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";
import Input from "../../../components/ui/Input";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import RefreshStatus from "../../../components/ui/RefreshStatus";
import { SkeletonList } from "../../../components/ui/Skeleton";
import Screen from "../../../components/ui/Screen";
import ScreenHeader from "../../../components/ui/ScreenHeader";
import SectionHeader from "../../../components/ui/SectionHeader";
import { COLORS, SPACING } from "../../../theme/index";
import { feedingPointDetailsRoute, feedingPointSubmissionsRoute, ROUTES } from "../../../navigation/routes";
import { useSession } from "../../session/SessionContext";

import FeedingPointCard from "../components/FeedingPointCard";
import FeedingPointsMap from "../components/FeedingPointsMap";
import MapPinPreviewCard from "../components/MapPinPreviewCard";
import UrgentRefillCard from "../components/UrgentRefillCard";
import { STATUS_META } from "../constants";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useFeedingPoints } from "../hooks/useFeedingPoints";
import { formatDistance } from "../utils/format";
import { getDisplayStatus } from "../utils/status";

type FilterKey = "all" | "needsFood" | "near";

export default function FeedingPointsScreen() {
  const router = useRouter();
  const { accountKind, can } = useSession();
  const canCreate = can("create-feeding-point");
  const canViewOwn = can("view-own-submissions");

  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isRefreshing, refreshError, isStale, lastUpdatedAt, error, refetch } = useFeedingPoints({
    status: filter === "needsFood" ? "needsFood" : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const points = useMemo(() => {
    if (filter !== "near") return data;
    return [...data].sort(
      (a, b) =>
        (a.distanceInMeters ?? Infinity) - (b.distanceInMeters ?? Infinity),
    );
  }, [data, filter]);

  const selectedIndex = points.findIndex((p) => p.id === selectedId);
  const selectedPoint = selectedIndex >= 0 ? points[selectedIndex] : null;

  const urgentPoint = useMemo(() => {
    const candidates = points
      .filter((p) => getDisplayStatus(p.status, p.lastStatusUpdateAt) === "needsFood")
      .sort((a, b) => (a.distanceInMeters ?? Infinity) - (b.distanceInMeters ?? Infinity));
    return candidates[0] ?? null;
  }, [points]);

  // مسار مطلق — الشاشة جذر تاب، فالمسار النسبي بيطلع غلط
  const openDetails = (id: string) => router.push(feedingPointDetailsRoute(id, accountKind));

  const listHeader = (
    <View style={styles.header}>
<AppText variant="bodySmall" color={COLORS.textSecondary}>تابع حالة الطعام والماء في النقاط القريبة منك.</AppText>

      {(canCreate || canViewOwn) && (
        <ActionRow>
          {canCreate ? (
            <Button
              title="إضافة نقطة"
              icon="add-circle-outline"
              size="small"
              onPress={() => router.push(ROUTES.createFeedingPoint)}
              style={styles.headerAction}
            />
          ) : null}
          {canViewOwn ? (
            <Button
              title="طلباتي"
              icon="time-outline"
              size="small"
              variant="outline"
              onPress={() => router.push(feedingPointSubmissionsRoute(accountKind))}
              style={styles.headerAction}
            />
          ) : null}
        </ActionRow>
      )}

      <Input
        value={search}
        onChangeText={setSearch}
        placeholder="ابحث عن مدينة أو منطقة.."
        icon={search ? "close-circle" : "search-outline"}
        iconSize={20}
        onIconPress={search ? () => setSearch("") : undefined}
        returnKeyType="search"
        containerStyle={styles.searchContainer}
        fieldStyle={styles.searchField}
      />


      <View style={styles.mapWrap}>
        <FeedingPointsMap
          points={points}
          selectedId={selectedId}
          onSelectPoint={setSelectedId}
          height={190}
        />

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <Chip
          label="الكل"
          selected={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <Chip
          label={STATUS_META.needsFood.label}
          color={STATUS_META.needsFood.color}
          icon={STATUS_META.needsFood.icon}
          selected={filter === "needsFood"}
          onPress={() => setFilter("needsFood")}
        />
        <Chip
          label="الأقرب لي"
          icon="location"
          selected={filter === "near"}
          onPress={() => setFilter("near")}
        />
      </ScrollView>

        {selectedPoint && (
          <MapPinPreviewCard
            point={selectedPoint}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < points.length - 1}
            onPrev={() => setSelectedId(points[selectedIndex - 1].id)}
            onNext={() => setSelectedId(points[selectedIndex + 1].id)}
            onPress={() => openDetails(selectedPoint.id)}
          />
        )}
      </View>

      {urgentPoint && (
        <UrgentRefillCard
          point={urgentPoint}
          distanceLabel={formatDistance(urgentPoint.distanceInMeters)}
          onPress={() => openDetails(urgentPoint.id)}
        />
      )}

      <RefreshStatus refreshing={isRefreshing} error={refreshError} stale={isStale} lastUpdatedAt={lastUpdatedAt} onRetry={() => void refetch()} />
      <SectionHeader title="النقاط القريبة" />
    </View>
  );

  return (
    <Screen padded={false} keyboardAware={false} safeAreaEdges={["top", "right", "left"]}>
      <ScreenHeader title="نقاط الإطعام" onBack={() => router.back()} />
      <FlatList
        data={isLoading || error ? [] : points}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedingPointCard point={item} onPress={() => openDetails(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refetch()} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          isLoading ? (
            <SkeletonList count={3} compact />
          ) : error ? (
            <ErrorState description={error} onRetry={refetch} />
          ) : (
            <EmptyState
              title="لا توجد نقاط مطابقة"
              description="جرّب تغيير البحث أو الفلتر لعرض نقاط أخرى."
              icon="search-outline"
            />
          )
        }
      />

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerAction: { flex: 1 },
  searchContainer: {
    marginBottom: 0,
  },
  searchField: {
    height: 48,
    borderWidth: 0,
    backgroundColor: COLORS.lightgray,
  },
  filters: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  mapWrap: {
    width: "100%",
    position: "relative",
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
});
