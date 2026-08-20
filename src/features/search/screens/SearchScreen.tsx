import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ShellAwareScrollView from "@/src/components/ui/ShellAwareScrollView";
import SearchFilterChips from "../components/SearchFilterChips";
import SearchMapPreview from "../components/SearchMapPreview";
import { useSearchScreen } from "../hooks/useSearchScreen";
import SearchInputSection from "../sections/SearchInputSection";
import SearchResultsSection from "../sections/SearchResultsSection";
import { styles } from "./Search.styles";

export default function SearchScreen() {
  const controller = useSearchScreen();
  const router = useRouter();
  return <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScreenHeader title="البحث" onBack={() => router.back()} />
      <SearchInputSection controller={controller} />
      <SearchFilterChips selectedFilter={controller.selectedFilter} onFilterChange={controller.setSelectedFilter} allowAdoption={controller.canViewAdoption} />
      <ShellAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <SearchResultsSection controller={controller} />
        <SearchMapPreview onOpenMap={controller.handleOpenMap} />
      </ShellAwareScrollView>
    </SafeAreaView>
  </>;
}
