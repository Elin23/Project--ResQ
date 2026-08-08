import { useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import type { SearchFilterKey, SearchResult } from "@/src/types/search";
import { useRouter } from "expo-router";
import { ROUTES, searchResultDetailsRoute } from "@/src/navigation/routes";
import { SEARCH_RESULTS } from "../constants/search";

export function useSearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [selectedFilter, setSelectedFilter] = useState<SearchFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SEARCH_RESULTS.filter((result) => {
      const matchesText = !query || [result.title, result.subtitle, result.type === "clinic" ? result.services : ""].some((value) => (value ?? "").toLowerCase().includes(query));
      if (!matchesText || selectedFilter === "all") return matchesText;
      if (selectedFilter === "clinics") return result.type === "clinic";
      return result.type === "animal" && result.category === selectedFilter;
    });
  }, [searchQuery, selectedFilter]);

  const handleResultPress = (result: SearchResult) => {
    router.push(searchResultDetailsRoute(result.id));
  };
  const focusSearch = () => searchInputRef.current?.focus();
  const clearSearch = () => { setSearchQuery(""); focusSearch(); };

  return {
    searchInputRef, selectedFilter, setSelectedFilter, searchQuery, setSearchQuery,
    filteredResults, handleResultPress, focusSearch, clearSearch,
    handleOpenMap: () => router.push(ROUTES.map),
    handleNotificationsPress: () => router.push(ROUTES.notifications),
  };
}
export type SearchScreenController = ReturnType<typeof useSearchScreen>;
