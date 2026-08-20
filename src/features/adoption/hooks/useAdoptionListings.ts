import { useCallback } from "react";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { AdoptionListing } from "@/src/domain";

export function useAdoptionListings(enabled = true) {
  const loader = useCallback(
    () => enabled ? repositories.adoption.listAvailable() : Promise.resolve([]),
    [enabled],
  );
  const resource = useAsyncResource<AdoptionListing[]>(loader, [], "تعذر تحميل حالات التبني.", {
    cacheKey: enabled ? "public-adoption-listings" : undefined,
    refreshOnForeground: enabled,
  });
  return { listings: resource.data, loading: resource.loading, refreshing: resource.refreshing, refreshError: resource.refreshError, isStale: resource.isStale, lastUpdatedAt: resource.lastUpdatedAt, error: resource.error, reload: resource.reload };
}
