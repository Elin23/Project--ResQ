import { useCallback } from "react";

import { repositories } from "@/src/services/domain/repositories";
import type { ServicePlaceQuery } from "@/src/domain/service-places";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";

export function useServicePlaces(query: ServicePlaceQuery) {
  const loader = useCallback(() => repositories.servicePlaces.list({ search: query.search, type: query.type }), [query.search, query.type]);
  const normalizedSearch = query.search?.trim();
  const cacheKey = normalizedSearch ? undefined : `service-places:${query.type ?? "all"}`;
  const resource = useAsyncResource(loader, [], "تعذر تحميل المواقع. حاول مرة أخرى.", {
    cacheKey,
    refreshOnForeground: true,
  });
  return {
    data: resource.data,
    isLoading: resource.loading,
    isRefreshing: resource.refreshing,
    refreshError: resource.refreshError,
    isStale: resource.isStale,
    lastUpdatedAt: resource.lastUpdatedAt,
    error: resource.error,
    refetch: resource.reload,
  };
}
