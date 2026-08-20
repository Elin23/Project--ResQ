import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import MetaRow from "@/src/components/ui/MetaRow";
import ScreenSection from "@/src/components/ui/ScreenSection";
import { useSession } from "@/src/features/session/SessionContext";
import {
  adoptionMyListingDetailsRoute,
  ROUTES,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useOwnedAdoptionListings } from "../hooks/useOwnedAdoptionListings";
import { ADOPTION_MODERATION_META } from "../utils/moderation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function MyAdoptionListingsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const { listings, loading, error, reload } = useOwnedAdoptionListings(account?.id);

  const counts = listings.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.moderationStatus === "pending_review") acc.pending += 1;
      if (item.moderationStatus === "approved") acc.approved += 1;
      if (item.moderationStatus === "rejected") acc.rejected += 1;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  );

  return (
    <Screen scroll padded={false} safeAreaEdges={["top", "right", "bottom", "left"]}>
      <ScreenHeader
        title="إعلاناتي للتبني"
        subtitle="تابع حالة المراجعة وإدارة إعلاناتك"
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Button
          title="عرض حيوان جديد للتبني"
          icon="add-circle-outline"
          onPress={() => router.push(ROUTES.createAdoptionListing)}
        />

        {!loading && !error && listings.length > 0 ? (
          <View style={styles.statsRow}>
            <Card disabled style={styles.statCard}>
              <AppText variant="h3" weight="bold">{counts.total}</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>الإجمالي</AppText>
            </Card>
            <Card disabled style={styles.statCard}>
              <AppText variant="h3" weight="bold" color={COLORS.warning}>{counts.pending}</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>قيد المراجعة</AppText>
            </Card>
            <Card disabled style={styles.statCard}>
              <AppText variant="h3" weight="bold" color={COLORS.success}>{counts.approved}</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>منشور</AppText>
            </Card>
          </View>
        ) : null}

        {loading ? <LoadingState label="جاري تحميل إعلاناتك..." /> : null}
        {!loading && error ? (
          <ErrorState description={error} onRetry={() => void reload()} />
        ) : null}

        {!loading && !error && listings.length === 0 ? (
          <EmptyState
            title="لا توجد إعلانات بعد"
            description="عندما تعرض حيوانًا للتبني سيظهر هنا لتتابع مراجعته وإدارته."
            icon="paw-outline"
            actionTitle="عرض حيوان للتبني"
            onActionPress={() => router.push(ROUTES.createAdoptionListing)}
          />
        ) : null}

        {!loading && !error && listings.length > 0 ? (
          <ScreenSection title="الإعلانات" subtitle="الأحدث تحديثًا مع حالة المراجعة الحالية">
          {listings.map((item) => {
              const meta = ADOPTION_MODERATION_META[item.moderationStatus];
              return (
                <Card
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`فتح إعلان ${item.animalName}`}
                  onPress={() =>
                    router.push(adoptionMyListingDetailsRoute(item.id, accountKind))
                  }
                  style={styles.listingCard}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
                  <View style={styles.copy}>
                    <View style={styles.headerRow}>
                      <AppText variant="h3" weight="bold" numberOfLines={2} style={styles.title}>
                        {item.animalName}
                      </AppText>
                      <StatusBadge
                        label={meta.label}
                        color={meta.color}
                        background={meta.background}
                        icon={meta.icon}
                        size="sm"
                      />
                    </View>

                    <MetaRow icon="paw-outline" text={`${item.animalType}${item.breed ? ` • ${item.breed}` : ""}`} />
                    <MetaRow icon="location-outline" text={item.location.address} />

                    <AppText variant="caption" color={COLORS.textMuted}>
                      آخر تحديث {formatDate(item.updatedAt)}
                    </AppText>
                  </View>
                </Card>
              );
            })}
          </ScreenSection>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: SPACING.sm,
  },
  listingCard: {
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.md,
    alignItems: "center",
  },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: SPACING.xs,
    alignItems: "stretch",
  },
  headerRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
  },
});
