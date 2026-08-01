import { useCallback, useEffect, useRef, useState } from "react";

import { fetchFeedingPoints } from "../api/feedingPoints.api";
import type { FeedingPointSummary, ReportedStatus } from "../types";

interface Params {
  status?: ReportedStatus;
  search?: string;
}

export function useFeedingPoints({ status, search }: Params) {
  const [data, setData] = useState<FeedingPointSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** لمنع "سباق الطلبات": نتيجة طلب قديم ما لازم تكتب فوق نتيجة أحدث */
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFeedingPoints({ status, search });
      if (id !== requestIdRef.current) return;
      setData(result);
    } catch (e) {
      if (id !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "صار خطأ غير متوقع");
      setData([]);
    } finally {
      if (id === requestIdRef.current) setIsLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load };
}