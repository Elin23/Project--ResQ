import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Screen from "@/src/components/ui/Screen";
import SearchResultCard from "@/src/features/search/components/SearchResultCard";
import HomeContentSection from "@/src/features/content/components/HomeContentSection";
import SharedSectionHeader from "@/src/components/ui/SectionHeader";
import OrganizationCard from "@/src/features/organizations/components/OrganizationCard";
import { useAdoptionListings } from "@/src/features/adoption/hooks/useAdoptionListings";
import { useOrganizations } from "@/src/features/organizations/hooks/useOrganizations";
import ErrorState from "@/src/components/ui/ErrorState";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import {
  ROUTES,
  adoptionDetailsRoute,
  adoptionRoute,
  articleDetailsRoute,
  articlesRoute,
  organizationDetailsRoute,
  successStoriesRoute,
  successStoryDetailsRoute,
} from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import { ARABIC_LAYOUT, COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

export default function ExploreScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const browseKind = account?.kind === "organization" && account.status === "pending" ? "user" : accountKind;
  const adoption = useAdoptionListings();
  const organizations = useOrganizations();
  return (
    <Screen scroll surface="app" safeAreaEdges={["top", "left", "right"]} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <AppText weight="bold" size={FONT_SIZES.headline}>استكشف مجتمع ResQ</AppText>
          <AppText color={COLORS.textSecondary} style={styles.subtitle}>تصفح الجمعيات والعيادات وحالات التبني والخدمات القريبة.</AppText>
        </View>

        <View style={styles.categoryRow}>
          <Category title="الجمعيات والمنظمات" icon="people" onPress={() => router.push(ROUTES.organizations)} />
          <Category title="حالات التبني" icon="heart" onPress={() => router.push(adoptionRoute(browseKind))} />
          <Category title="العيادات" icon="medkit" onPress={() => router.push(ROUTES.search)} />
          <Category title="مقالات ونصائح" icon="newspaper" onPress={() => router.push(articlesRoute(accountKind))} />
          <Category title="قصص نجاح" icon="sparkles" onPress={() => router.push(successStoriesRoute(accountKind))} />
        </View>

        <SharedSectionHeader title="جمعيات موصى بها" actionLabel="عرض الكل" onActionPress={() => router.push(ROUTES.organizations)} />
        {organizations.loading ? (
          <SkeletonList count={2} />
        ) : organizations.error ? (
          <ErrorState description={organizations.error} onRetry={() => void organizations.reload()} />
        ) : (
          organizations.organizations.slice(0, 2).map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} onOpen={() => router.push(organizationDetailsRoute(organization.id))} onContact={() => router.push(ROUTES.contactUs)} />
          ))
        )}

        <SharedSectionHeader title="حيوانات متاحة للتبني" actionLabel="عرض الكل" onActionPress={() => router.push(adoptionRoute(browseKind))} />
        {adoption.listings.slice(0, 2).map((listing) => (
          <SearchResultCard
            key={listing.id}
            result={{ id: `adoption-${listing.id}`, entityId: listing.id, type: "adoption", title: `${listing.animalName} • ${listing.animalType}`, subtitle: listing.locationName, meta: "متاح للتبني", image: { uri: listing.imageUrl }, badge: { label: "متاح للتبني", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark } }}
            onPress={() => router.push(adoptionDetailsRoute(listing.id, browseKind))}
          />
        ))}

        <HomeContentSection
          kind="article"
          onViewAll={() => router.push(articlesRoute(accountKind))}
          onOpen={(id) => router.push(articleDetailsRoute(id, accountKind))}
        />
        <HomeContentSection
          kind="success-story"
          onViewAll={() => router.push(successStoriesRoute(accountKind))}
          onOpen={(id) => router.push(successStoryDetailsRoute(id, accountKind))}
        />
    </Screen>
  );
}

function Category({ title, icon, onPress }: { title: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.category, pressed && styles.pressed]}><View style={styles.categoryIcon}><Ionicons name={icon} size={25} color={COLORS.brown} /></View><AppText weight="medium" size={FONT_SIZES.label} style={styles.categoryText}>{title}</AppText></Pressable>;
}
const styles = StyleSheet.create({
  content: { paddingBottom: SPACING.xl, gap: SPACING.sm }, hero: { alignItems: "stretch", marginBottom: SPACING.lg }, subtitle: { marginTop: SPACING.sm, width: "100%", textAlign: ARABIC_LAYOUT.textAlign, writingDirection: ARABIC_LAYOUT.direction, lineHeight: 24 }, categoryRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm }, category: { flexGrow: 1, flexBasis: "30%", minWidth: 100, minHeight: 112, padding: SPACING.sm, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", gap: SPACING.sm }, categoryIcon: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.peach, alignItems: "center", justifyContent: "center" }, categoryText: { textAlign: "center" }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
