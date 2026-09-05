import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import IconButton from "@/src/components/ui/IconButton";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import {
  adoptionDetailsRoute,
  donationCampaignDetailsRoute,
  feedingPointDetailsRoute,
  feedingPointsRoute,
  organizationDetailsRoute,
} from "@/src/navigation/routes";
import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";

import { FAVORITE_KIND_META, FAVORITE_KIND_ORDER } from "../constants";
import { useFavorites } from "../FavoritesContext";
import type { FavoriteItem, FavoriteKind } from "../types";

type FavoriteFilter = FavoriteKind | "all";

function savedAtLabel(value: string) {
  return new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { accountKind } = useSession();
  const { showFeedback } = useFeedback();
  const { items, isReady, removeFavorite } = useFavorites();
  const [filter, setFilter] = useState<FavoriteFilter>("all");

  const sorted = useMemo(
    () => [...items].sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt)),
    [items],
  );

  // الفلاتر بتظهر بس للأنواع اللي عندها عناصر محفوظة فعلاً.
  const availableKinds = useMemo(
    () => FAVORITE_KIND_ORDER.filter((kind) => items.some((item) => item.kind === kind)),
    [items],
  );

  // لو انشال آخر عنصر من النوع المفلتر منرجع تلقائياً على "الكل".
  const activeFilter: FavoriteFilter =
    filter !== "all" && !availableKinds.includes(filter) ? "all" : filter;
  const visible = activeFilter === "all"
    ? sorted
    : sorted.filter((item) => item.kind === activeFilter);

  const openFavorite = (item: FavoriteItem) => {
    if (item.kind === "feeding-point") {
      router.push(feedingPointDetailsRoute(item.id, accountKind));
      return;
    }
    if (item.kind === "campaign") {
      router.push(donationCampaignDetailsRoute(item.id, accountKind));
      return;
    }
    if (item.kind === "organization") {
      router.push(organizationDetailsRoute(item.id));
      return;
    }
    router.push(adoptionDetailsRoute(item.id, accountKind));
  };

  const handleRemove = (item: FavoriteItem) => {
    removeFavorite(item.kind, item.id);
    showFeedback({
      title: "تمت الإزالة من المفضلة",
      message: `${item.title} انشالت من المفضلة.`,
      tone: "info",
    });
  };

  if (!isReady) {
    return (
      <Screen centered>
        <LoadingState label="جاري تحميل المفضلة..." />
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false} surface="app">
      <ScreenHeader
        title="المفضلة"
        subtitle={items.length > 0 ? `${items.length} عنصر محفوظ` : "كل ما تحفظه يظهر هنا"}
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        {items.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="لا يوجد شيء في المفضلة بعد"
            description="اضغط على أيقونة القلب في أي نقطة إطعام أو حملة أو جمعية ليظهر العنصر هنا."
            actionTitle="تصفح نقاط الإطعام"
            onActionPress={() => router.push(feedingPointsRoute(accountKind))}
          />
        ) : (
          <>
            {availableKinds.length > 1 ? (
              <View style={styles.filters}>
                <Chip
                  label="الكل"
                  selected={activeFilter === "all"}
                  onPress={() => setFilter("all")}
                />
                {availableKinds.map((kind) => {
                  const meta = FAVORITE_KIND_META[kind];
                  const count = items.filter((item) => item.kind === kind).length;
                  return (
                    <Chip
                      key={kind}
                      label={`${meta.label} · ${count}`}
                      icon={meta.icon}
                      color={meta.color}
                      selected={activeFilter === kind}
                      onPress={() => setFilter(kind)}
                    />
                  );
                })}
              </View>
            ) : null}

            {visible.map((item) => (
              <FavoriteRow
                key={`${item.kind}:${item.id}`}
                item={item}
                onPress={() => openFavorite(item)}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </>
        )}
      </View>
    </Screen>
  );
}

function FavoriteRow({
  item,
  onPress,
  onRemove,
}: {
  item: FavoriteItem;
  onPress: () => void;
  onRemove: () => void;
}) {
  const meta = FAVORITE_KIND_META[item.kind];

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${meta.color}18` }]}>
        <Ionicons name={meta.icon} size={ICON_SIZES.md} color={meta.color} />
      </View>

      <View style={styles.flex}>
        <AppText variant="label" weight="bold">{item.title}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>
          {meta.singular} · حُفظت في {savedAtLabel(item.savedAt)}
        </AppText>
      </View>

      <IconButton
        icon="heart"
        color={COLORS.danger}
        selected
        accessibilityLabel={`إزالة ${item.title} من المفضلة`}
        onPress={onRemove}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.sm },
  filters: {
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  card: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
});
