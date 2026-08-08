import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import SearchResultCard from "@/src/features/search/components/SearchResultCard";
import { SEARCH_RESULTS } from "@/src/features/search/constants/search";
import { searchResultDetailsRoute } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, SPACING } from "@/src/theme";

const ADOPTION_RESULTS = SEARCH_RESULTS.filter(
  (result) => result.type === "animal" && result.category === "adoption",
);

export default function AdoptionScreen() {
  const router = useRouter();

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "استكشاف" }} />
      <View style={styles.header}>
        <AppText weight="bold" size={FONT_SIZES.headline}>
          حيوانات تبحث عن منزل
        </AppText>
        <AppText color={COLORS.textSecondary} style={styles.subtitle}>
          تصفح الحالات التجريبية وافتح التفاصيل قبل إرسال طلب الاهتمام.
        </AppText>
      </View>

      {ADOPTION_RESULTS.length > 0 ? (
        ADOPTION_RESULTS.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
            onPress={() => router.push(searchResultDetailsRoute(result.id))}
          />
        ))
      ) : (
        <EmptyState
          title="لا توجد حالات متاحة الآن"
          description="ستظهر هنا الحيوانات المتاحة للتبني عند إضافتها."
          icon="heart-outline"
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  header: { alignItems: "flex-start", marginBottom: SPACING.lg },
  subtitle: { marginTop: SPACING.sm, lineHeight: 24, textAlign: "left" },
});
