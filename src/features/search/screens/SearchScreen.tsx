import { Stack } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "@/src/components/ui/TopBar";
import SearchFilterChips from "../components/SearchFilterChips";
import SearchMapPreview from "../components/SearchMapPreview";
import { useSearchScreen } from "../hooks/useSearchScreen";
import SearchInputSection from "../sections/SearchInputSection";
import SearchResultsSection from "../sections/SearchResultsSection";
import { styles } from "./Search.styles";

export default function SearchScreen() {
  const controller = useSearchScreen();
  return <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <TopBar onSearchPress={controller.focusSearch} onNotificationsPress={controller.handleNotificationsPress} />
      <SearchInputSection controller={controller} />
      <SearchFilterChips selectedFilter={controller.selectedFilter} onFilterChange={controller.setSelectedFilter} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <SearchResultsSection controller={controller} />
        <SearchMapPreview onOpenMap={controller.handleOpenMap} />
      </ScrollView>
    </SafeAreaView>
  </>;
}
