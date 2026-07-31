import { useMemo, useRef, useState } from "react";
import { Alert, TextInput } from "react-native";
import type { SearchFilterKey, SearchResult } from "@/src/types/search";
import { SEARCH_RESULTS } from "../constants/search";

export function useSearchScreen() {
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

  const handleResultPress = (result: SearchResult) => Alert.alert(result.title, result.type === "clinic" ? "سيتم ربط هذه النتيجة بصفحة تفاصيل العيادة عند إنشاء الصفحة." : "سيتم ربط هذه النتيجة بصفحة تفاصيل الحيوان عند إنشاء الصفحة.");
  const focusSearch = () => searchInputRef.current?.focus();
  const clearSearch = () => { setSearchQuery(""); focusSearch(); };

  return {
    searchInputRef, selectedFilter, setSelectedFilter, searchQuery, setSearchQuery,
    filteredResults, handleResultPress, focusSearch, clearSearch,
    handleOpenMap: () => Alert.alert("الخريطة", "سيتم فتح صفحة الخريطة بعد إنشاء وربط صفحة الخريطة."),
    handleNotificationsPress: () => Alert.alert("الإشعارات", "سيتم فتح صفحة الإشعارات بعد إنشاء وربط صفحة الإشعارات."),
  };
}
export type SearchScreenController = ReturnType<typeof useSearchScreen>;
