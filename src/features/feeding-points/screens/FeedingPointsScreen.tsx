import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";
import IconButton from "../../../components/ui/IconButton";
import Input from "../../../components/ui/Input";
import Screen from "../../../components/ui/Screen";
import SectionHeader from "../../../components/ui/SectionHeader";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";
import { feedingPointDetailsRoute } from "../../../navigation/routes";

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

  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, error, refetch } = useFeedingPoints({
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
  const openDetails = (id: string) => router.push(feedingPointDetailsRoute(id));

  const handleFiltersPress = () =>
    Alert.alert("خيارات إضافية", "فلاتر متقدمة رح تنضاف قريباً.");

  const handleAddPoint = () =>
    Alert.alert("إضافة نقطة", "إضافة نقطة إطعام جديدة رح تنضاف قريباً.");

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <IconButton
          icon="arrow-forward-outline"
          accessibilityLabel="عرض كل النقاط"
          onPress={handleFiltersPress}
        />
        <AppText weight="bold" size={FONT_SIZES.title}>
          نقاط الإطعام
        </AppText>
        <IconButton
          icon="options-outline"
          accessibilityLabel="خيارات إضافية"
          onPress={handleFiltersPress}
        />
      </View>

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
        <Chip
          label="يتوفر طعام"
          icon="location"
          selected={filter === "near"}
          onPress={() => setFilter("near")}
        />
        <Chip
          label="يتوفر  ماء"
          icon="location"
          selected={filter === "near"}
          onPress={() => setFilter("near")}
        />
        <Chip
          label="يحتاج لإعاجة تعبئة"
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

      <SectionHeader title="النقاط القريبة" actionLabel="رؤية الكل" />
    </View>
  );

  return (
    // بدون "top": TopBar تبع التابات عم يتعامل مع الـ inset العلوي
    <Screen padded={false} keyboardAware={false} safeAreaEdges={["right", "left"]}>
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
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : error ? (
            <View style={styles.stateBox}>
              <Ionicons name="cloud-offline-outline" size={40} color={COLORS.placeholder} />
              <AppText color={COLORS.textSecondary}>{error}</AppText>
              <Button title="إعادة المحاولة" onPress={refetch} />
            </View>
          ) : (
            <View style={styles.stateBox}>
              <Ionicons name="search-outline" size={40} color={COLORS.placeholder} />
              <AppText color={COLORS.textSecondary}>ما في نقاط مطابقة</AppText>
            </View>
          )
        }
      />

      <Button
        title="إضافة نقطة"
        onPress={handleAddPoint}
        variant="custom"
        size="medium"
        icon="add-circle"
        fullWidth={false}
        backgroundColor={COLORS.primary}
        borderColor={COLORS.primary}
        textColor={COLORS.white}
        radius={RADIUS.full}
        style={styles.addButton}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
  stateBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
  },
  addButton: {
    position: "absolute",
    bottom: SPACING.lg,
    end: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
