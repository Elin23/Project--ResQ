import { useCallback } from "react";

import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { fetchFeedingPoints } from "../api/feedingPoints.api";
import type { FeedingPointSummary, ReportedStatus } from "../types";

interface Params {
  status?: ReportedStatus;
  search?: string;
}

export function useFeedingPoints({ status, search }: Params) {
  const loader = useCallback(
    () => fetchFeedingPoints({ status, search }),
    [status, search],
  );
  const normalizedSearch = search?.trim();
  const cacheKey = normalizedSearch ? undefined : `feeding-points:${status ?? "all"}`;
  const resource = useAsyncResource<FeedingPointSummary[]>(
    loader,
    [],
    "تعذر تحميل نقاط الإطعام.",
    { cacheKey, refreshOnForeground: true },
  );

  return {
    data: resource.data,
    isLoading: resource.loading,
    isRefreshing: resource.refreshing,
    error: resource.error,
    refreshError: resource.refreshError,
    isStale: resource.isStale,
    lastUpdatedAt: resource.lastUpdatedAt,
    refetch: resource.reload,
  };
}
