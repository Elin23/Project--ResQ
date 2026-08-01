import { useCallback, useEffect, useRef, useState } from "react";

import { fetchFeedingPointDetails, fetchStatusUpdates } from "../api/feedingPoints.api";
import type { FeedingPointDetails, StatusUpdate } from "../types";

export function useFeedingPointDetails(id: string) {
  const [point, setPoint] = useState<FeedingPointDetails | null>(null);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      // بالتوازي — ما في داعي ينتظروا بعض
      const [detailsResult, updatesResult] = await Promise.all([
        fetchFeedingPointDetails(id),
        fetchStatusUpdates(id),
      ]);

      if (reqId !== requestIdRef.current) return;
      setPoint(detailsResult);
      setUpdates(updatesResult);
    } catch (e) {
      if (reqId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "تعذّر تحميل النقطة");
      setPoint(null);
    } finally {
      if (reqId === requestIdRef.current) setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { point, updates, isLoading, error, refetch: load };
}