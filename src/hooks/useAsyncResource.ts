import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

type AsyncResourceOptions = {
  /** Persist only non-sensitive/list data that is safe to show as a stale fallback. */
  cacheKey?: string;
  cacheMaxAgeMs?: number;
  refreshOnForeground?: boolean;
};

type CacheEnvelope<T> = {
  version: 1;
  savedAt: number;
  data: T;
};

const DEFAULT_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

/**
 * Shared async-resource state with stale-data resilience.
 *
 * `loading` is reserved for the first unresolved request.
 * `refreshing` represents reloads after data has already been resolved or hydrated.
 * A failed refresh never discards the last successful payload.
 */
export function useAsyncResource<T>(
  loader: () => Promise<T>,
  initialValue: T,
  errorMessage: string,
  options: AsyncResourceOptions = {},
) {
  const { cacheKey, cacheMaxAgeMs = DEFAULT_CACHE_MAX_AGE, refreshOnForeground = false } = options;
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const mountedRef = useRef(true);
  const resolvedRef = useRef(false);
  const requestIdRef = useRef(0);

  const persist = useCallback(async (next: T, savedAt: number) => {
    if (!cacheKey) return;
    const envelope: CacheEnvelope<T> = { version: 1, savedAt, data: next };
    try {
      await AsyncStorage.setItem(`@resq/async-cache/${cacheKey}`, JSON.stringify(envelope));
    } catch {
      // Cache persistence must never break the foreground experience.
    }
  }, [cacheKey]);

  const reload = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isRefresh = resolvedRef.current;
    if (isRefresh) {
      setRefreshing(true);
      setRefreshError(null);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const next = await loader();
      if (mountedRef.current && requestId === requestIdRef.current) {
        const now = Date.now();
        setData(next);
        setError(null);
        setRefreshError(null);
        setIsStale(false);
        setLastUpdatedAt(now);
        resolvedRef.current = true;
        void persist(next, now);
      }
      return next;
    } catch (cause) {
      if (mountedRef.current && requestId === requestIdRef.current) {
        if (isRefresh) {
          setRefreshError(errorMessage);
          setIsStale(true);
        } else {
          setError(errorMessage);
        }
      }
      throw cause;
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [errorMessage, loader, persist]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const bootstrap = async () => {
      if (cacheKey && !resolvedRef.current) {
        try {
          const raw = await AsyncStorage.getItem(`@resq/async-cache/${cacheKey}`);
          if (raw && !cancelled && mountedRef.current) {
            const cached = JSON.parse(raw) as CacheEnvelope<T>;
            const age = Date.now() - cached.savedAt;
            if (cached.version === 1 && age <= cacheMaxAgeMs) {
              setData(cached.data);
              setLastUpdatedAt(cached.savedAt);
              setIsStale(true);
              setLoading(false);
              resolvedRef.current = true;
            }
          }
        } catch {
          // Corrupt or unavailable cache is ignored; normal loading continues.
        }
      }
      if (!cancelled) void reload().catch(() => undefined);
    };

    void bootstrap();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [cacheKey, cacheMaxAgeMs, reload]);

  useEffect(() => {
    if (!refreshOnForeground) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && resolvedRef.current) void reload().catch(() => undefined);
    });
    return () => subscription.remove();
  }, [refreshOnForeground, reload]);

  return {
    data,
    loading,
    refreshing,
    error,
    refreshError,
    isStale,
    lastUpdatedAt,
    reload,
    setData,
  };
}
