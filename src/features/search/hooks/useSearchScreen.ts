import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import type { SearchFilterKey, SearchResult } from "@/src/types/search";
import { useRouter } from "expo-router";
import { ROUTES, adoptionDetailsRoute, reportDetailsRoute, searchResultDetailsRoute } from "@/src/navigation/routes";
import { COLORS } from "@/src/theme";
import { useAdoptionListings } from "@/src/features/adoption/hooks/useAdoptionListings";
import { useSession } from "@/src/features/session/SessionContext";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";
import { SERVICE_PLACE_TYPE_META } from "@/src/domain/service-places";

export function useSearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const [selectedFilter, setSelectedFilter] = useState<SearchFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { can, accountKind } = useSession();
  const canViewAdoption = can("view-adoption");
  const adoption = useAdoptionListings(canViewAdoption);
  const clinics = useAsyncResource(useCallback(() => repositories.servicePlaces.list({ type: "clinic" }), []), [], "تعذر تحميل العيادات.");
  const reports = useAsyncResource(useCallback(() => repositories.reports.list(), []), [], "تعذر تحميل البلاغات.");
  const canViewNotifications = can("view-notifications");

  useEffect(() => {
    if (!canViewAdoption && selectedFilter === "adoption") setSelectedFilter("all");
  }, [canViewAdoption, selectedFilter]);

  const results = useMemo<SearchResult[]>(() => [
    ...clinics.data.map((place): SearchResult => ({
      id: `clinic:${place.id}`,
      entityId: place.id,
      type: "clinic",
      title: place.name,
      subtitle: place.address || place.regionName || place.governorateName || "الموقع غير محدد",
      meta: place.status === "active" ? "متاحة على الخريطة" : "الحالة غير متاحة",
      services: SERVICE_PLACE_TYPE_META[place.type]?.label ?? "خدمة بيطرية",
      status: place.status === "active" ? { label: "نشطة", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark } : undefined,
    })),
    ...reports.data.map((report): SearchResult => ({
      id: `report:${report.id}`,
      entityId: report.id,
      type: "report",
      title: report.title,
      subtitle: report.locationName || report.address || "الموقع غير محدد",
      meta: report.code,
      image: report.imageUrl ? { uri: report.imageUrl } : undefined,
      badge: { label: report.status === "closed" ? "مغلق" : "بلاغ", backgroundColor: report.status === "closed" ? COLORS.successSoft : COLORS.primarySoft, textColor: report.status === "closed" ? COLORS.successDark : COLORS.primaryStrong },
    })),
    ...(canViewAdoption ? adoption.listings.map((listing): SearchResult => ({
      id: `adoption:${listing.id}`,
      entityId: listing.id,
      type: "adoption",
      title: `${listing.animalName} • ${listing.animalType}`,
      subtitle: listing.locationName,
      meta: "متاح للتبني",
      image: listing.imageUrl ? { uri: listing.imageUrl } : undefined,
      badge: { label: "متاح للتبني", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark },
    })) : []),
  ], [adoption.listings, canViewAdoption, clinics.data, reports.data]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("ar");
    return results.filter((result) => {
      const matchesText = !query || [result.title, result.subtitle, result.meta, result.type === "clinic" ? result.services : ""].some((value) => value.toLocaleLowerCase("ar").includes(query));
      if (!matchesText || selectedFilter === "all") return matchesText;
      if (selectedFilter === "clinics") return result.type === "clinic";
      if (selectedFilter === "reports") return result.type === "report";
      return result.type === "adoption";
    });
  }, [results, searchQuery, selectedFilter]);

  const handleResultPress = (result: SearchResult) => {
    if (result.type === "adoption") return router.push(adoptionDetailsRoute(result.entityId));
    if (result.type === "report") return router.push(reportDetailsRoute(result.entityId, accountKind));
    router.push(searchResultDetailsRoute(result.id));
  };
  const focusSearch = () => searchInputRef.current?.focus();
  const clearSearch = () => { setSearchQuery(""); focusSearch(); };

  return {
    searchInputRef, selectedFilter, setSelectedFilter, searchQuery, setSearchQuery,
    filteredResults, handleResultPress, focusSearch, clearSearch,
    adoptionLoading: adoption.loading || clinics.loading || reports.loading,
    adoptionError: [canViewAdoption ? adoption.error : null, clinics.error, reports.error].filter(Boolean).join(" • ") || null,
    canViewAdoption,
    handleOpenMap: () => router.push(ROUTES.map),
    handleNotificationsPress: canViewNotifications ? () => router.push(ROUTES.notifications) : undefined,
  };
}
export type SearchScreenController = ReturnType<typeof useSearchScreen>;
