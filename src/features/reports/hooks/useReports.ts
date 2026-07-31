import { useCallback, useEffect, useRef, useState } from "react";

import { getReports } from "@/src/services/reports";
import type { Report } from "@/src/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await getReports();
      if (mountedRef.current) setReports(items);
    } catch {
      if (mountedRef.current) {
        setError("تعذر تحميل البلاغات. تحقق من اتصالك وحاول مرة أخرى.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadReports();

    return () => {
      mountedRef.current = false;
    };
  }, [loadReports]);

  return { reports, loading, error, reload: loadReports };
}
