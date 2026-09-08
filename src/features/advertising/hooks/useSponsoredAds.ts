import { useCallback } from "react";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";

export function useSponsoredAds(placement: import("@/src/domain").SponsoredAdPlacement = "HOME_BANNER") {
  const load = useCallback(() => repositories.sponsoredAds.listActive(undefined, placement), [placement]);
  const state = useAsyncResource(load, []);
  return {
    ads: state.data ?? [],
    loading: state.loading,
    error: state.error,
    refresh: state.refresh,
  };
}
