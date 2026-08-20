import { useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import type { SearchFilterKey, SearchResult } from "@/src/types/search";
import { useRouter } from "expo-router";
import { ROUTES, adoptionDetailsRoute, searchResultDetailsRoute } from "@/src/navigation/routes";
import { COLORS } from "@/src/theme";
import { useAdoptionListings } from "@/src/features/adoption/hooks/useAdoptionListings";
import { SEARCH_RESULTS } from "../constants/search";
import { useSession } from "@/src/features/session/SessionContext";

export function useSearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [selectedFilter, setSelectedFilter] = useState<SearchFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { can } = useSession();
  const canViewAdoption = can("view-adoption");
  const adoption = useAdoptionListings(canViewAdoption);
  const canViewNotifications = can("view-notifications");

  useEffect(() => {
    if (!canViewAdoption && selectedFilter === "adoption") setSelectedFilter("all");
  }, [canViewAdoption, selectedFilter]);

  const results = useMemo<SearchResult[]>(() => [
    ...SEARCH_RESULTS.filter((result) => !(result.type === "animal" && result.category === "adoption")),
    ...(canViewAdoption ? adoption.listings.map((listing): SearchResult => ({
      id: listing.id,
      type: "animal",
      category: "adoption",
      title: `${listing.animalName} • ${listing.animalType}`,
      subtitle: listing.locationName,
      distance: "متاح للتبني",
      image: { uri: listing.imageUrl },
      badge: { label: "متاح للتبني", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark },
    })) : []),
  ], [adoption.listings, canViewAdoption]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return results.filter((result) => {
      const matchesText = !query || [result.title, result.subtitle, result.type === "clinic" ? result.services : ""].some((value) => (value ?? "").toLowerCase().includes(query));
      if (!matchesText || selectedFilter === "all") return matchesText;
      if (selectedFilter === "clinics") return result.type === "clinic";
      return result.type === "animal" && result.category === selectedFilter;
    });
  }, [results, searchQuery, selectedFilter]);

  const handleResultPress = (result: SearchResult) => {
    if (result.type === "animal" && result.category === "adoption") {
      router.push(adoptionDetailsRoute(result.id));
      return;
    }
    router.push(searchResultDetailsRoute(result.id));
  };
  const focusSearch = () => searchInputRef.current?.focus();
  const clearSearch = () => { setSearchQuery(""); focusSearch(); };

  return {
    searchInputRef, selectedFilter, setSelectedFilter, searchQuery, setSearchQuery,
    filteredResults, handleResultPress, focusSearch, clearSearch,
    adoptionLoading: adoption.loading,
    adoptionError: canViewAdoption ? adoption.error : null,
    canViewAdoption,
    handleOpenMap: () => router.push(ROUTES.map),
    handleNotificationsPress: canViewNotifications ? () => router.push(ROUTES.notifications) : undefined,
  };
}
export type SearchScreenController = ReturnType<typeof useSearchScreen>;
