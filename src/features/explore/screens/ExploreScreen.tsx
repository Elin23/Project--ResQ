import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Screen from "@/src/components/ui/Screen";
import SearchResultCard from "@/src/features/search/components/SearchResultCard";
import { SEARCH_RESULTS } from "@/src/features/search/constants/search";
import { ORGANIZATIONS } from "@/src/features/organizations/constants/organizations";
import OrganizationCard from "@/src/features/organizations/components/OrganizationCard";
import { ROUTES, organizationDetailsRoute, searchResultDetailsRoute } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

const ADOPTION_RESULTS = SEARCH_RESULTS.filter((item) => item.type === "animal" && item.category === "adoption").slice(0, 2);

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <Screen padded={false} scroll={false} backgroundColor={COLORS.surface} safeAreaEdges={["left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <AppText weight="bold" size={FONT_SIZES.headline}>استكشف مجتمع ResQ</AppText>
          <AppText color={COLORS.textSecondary} style={styles.subtitle}>تصفح الجمعيات والعيادات وحالات التبني والخدمات القريبة.</AppText>
        </View>

        <View style={styles.categoryRow}>
          <Category title="الجمعيات والمنظمات" icon="people" onPress={() => router.push(ROUTES.organizations)} />
          <Category title="حالات التبني" icon="heart" onPress={() => router.push(ROUTES.adoptionList)} />
          <Category title="العيادات" icon="medkit" onPress={() => router.push(ROUTES.search)} />
        </View>

        <SectionHeader title="جمعيات موصى بها" onPress={() => router.push(ROUTES.organizations)} />
        {ORGANIZATIONS.slice(0, 2).map((organization) => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            onOpen={() => router.push(organizationDetailsRoute(organization.id))}
            onContact={() => router.push(ROUTES.contactUs)}
          />
        ))}

        <SectionHeader title="حيوانات متاحة للتبني" onPress={() => router.push(ROUTES.adoptionList)} />
        {ADOPTION_RESULTS.map((result) => (
          <SearchResultCard key={result.id} result={result} onPress={() => router.push(searchResultDetailsRoute(result.id))} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function Category({ title, icon, onPress }: { title: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.category, pressed && styles.pressed]}>
      <View style={styles.categoryIcon}><Ionicons name={icon} size={25} color={COLORS.brown} /></View>
      <AppText weight="medium" size={FONT_SIZES.label} style={styles.categoryText}>{title}</AppText>
    </Pressable>
  );
}

function SectionHeader({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Pressable onPress={onPress}><AppText color={COLORS.brown}>عرض الكل</AppText></Pressable>
      <AppText weight="bold" size={FONT_SIZES.title}>{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, paddingBottom: 120 },
  hero: { alignItems: "flex-end", marginBottom: SPACING.lg },
  subtitle: { marginTop: SPACING.sm, textAlign: "right", lineHeight: 24 },
  categoryRow: { flexDirection: "row-reverse", gap: SPACING.sm },
  category: { flex: 1, minHeight: 112, padding: SPACING.sm, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", gap: SPACING.sm },
  categoryIcon: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.peach, alignItems: "center", justifyContent: "center" },
  categoryText: { textAlign: "center" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  sectionHeader: { marginTop: SPACING.xl, marginBottom: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
