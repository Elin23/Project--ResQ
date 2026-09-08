import { useEffect, useMemo, useState } from "react";

import type { GovernorateLookup, RegionLookup } from "@/src/domain/lookups/locationLookup";
import { repositories } from "@/src/services/domain/repositories";

export function useLocationLookups(governorateId?: string) {
  const [governorates, setGovernorates] = useState<GovernorateLookup[]>([]);
  const [regions, setRegions] = useState<RegionLookup[]>([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingGovernorates(true);
    repositories.locationLookups.listGovernorates()
      .then((items) => {
        if (!active) return;
        setGovernorates(items);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("تعذر تحميل المحافظات. حاول مرة أخرى.");
      })
      .finally(() => {
        if (active) setLoadingGovernorates(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!governorateId) {
      setRegions([]);
      setLoadingRegions(false);
      return () => { active = false; };
    }
    setLoadingRegions(true);
    repositories.locationLookups.listRegions(governorateId)
      .then((items) => {
        if (!active) return;
        setRegions(items);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setRegions([]);
        setError("تعذر تحميل المناطق التابعة للمحافظة.");
      })
      .finally(() => {
        if (active) setLoadingRegions(false);
      });
    return () => { active = false; };
  }, [governorateId]);

  const governorateOptions = useMemo(
    () => governorates.map((item) => ({ value: item.id, label: item.name })),
    [governorates],
  );
  const regionOptions = useMemo(
    () => regions.map((item) => ({ value: item.id, label: item.name })),
    [regions],
  );

  return {
    governorates,
    regions,
    governorateOptions,
    regionOptions,
    loadingGovernorates,
    loadingRegions,
    error,
  };
}
