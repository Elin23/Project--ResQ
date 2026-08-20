import { Stack, useRouter } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import Button from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import RefreshStatus from "@/src/components/ui/RefreshStatus";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SearchResultCard from "@/src/features/search/components/SearchResultCard";
import { adoptionDetailsRoute, adoptionMyApplicationsRoute, adoptionMyListingsRoute, ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import { COLORS, SPACING } from "@/src/theme";
import { useAdoptionListings } from "../hooks/useAdoptionListings";

export default function AdoptionScreen() {
  const router = useRouter();
  const { listings, loading, refreshing, refreshError, isStale, lastUpdatedAt, error, reload } = useAdoptionListings();
  const { can, accountKind } = useSession();
  const canCreateListing = can("create-adoption-listing");
  const canViewOwnListings = can("view-own-submissions");
  const canApply = can("apply-adoption");

  return (
    <Screen
      scroll
      padded={false}
      contentContainerStyle={styles.content}
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={() => void reload()} tintColor={COLORS.primary} colors={[COLORS.primary]} />,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="حيوانات تبحث عن منزل" subtitle="الحالات المتاحة للتبني ومعلوماتها الأساسية" onBack={() => router.back()} />
      <View style={styles.body}>
      {canCreateListing || canViewOwnListings || canApply ? (
        <View style={styles.ownerActions}>
          {canCreateListing ? (
            <Button title="عرض حيوان للتبني" icon="add-circle-outline" onPress={() => router.push(ROUTES.createAdoptionListing)} />
          ) : null}
          {canViewOwnListings ? (
            <Button title="إعلاناتي للتبني" icon="folder-open-outline" variant="outline" onPress={() => router.push(adoptionMyListingsRoute(accountKind))} />
          ) : null}
          {canApply ? (
            <Button title="طلبات التبني الخاصة بي" icon="document-text-outline" variant="outline" onPress={() => router.push(adoptionMyApplicationsRoute(accountKind))} />
          ) : null}
        </View>
      ) : null}

      <RefreshStatus refreshing={refreshing} error={refreshError} stale={isStale} lastUpdatedAt={lastUpdatedAt} onRetry={() => void reload()} />
      {loading ? <SkeletonList count={3} /> : error ? <ErrorState description={error} onRetry={() => void reload()} /> : listings.length > 0 ? (
        listings.map((listing) => (
          <SearchResultCard key={listing.id} result={{ id: listing.id, type: "animal", category: "adoption", title: `${listing.animalName} • ${listing.animalType}`, subtitle: listing.locationName, distance: "متاح للتبني", image: { uri: listing.imageUrl }, badge: { label: "متاح للتبني", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark } }} onPress={() => router.push(adoptionDetailsRoute(listing.id, accountKind))} />
        ))
      ) : (
        <EmptyState title="لا توجد حالات متاحة الآن" description="ستظهر هنا الحيوانات المتاحة للتبني عند إضافتها." icon="heart-outline" />
      )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.md },
  ownerActions: { gap: SPACING.sm },
});
