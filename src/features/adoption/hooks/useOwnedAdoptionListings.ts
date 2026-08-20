import { useCallback } from "react";

import type { AdoptionListing } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedAdoptionListings(ownerAccountId: string | null | undefined) {
  const loader = useCallback(async () => {
    if (!ownerAccountId) return [] as AdoptionListing[];
    return repositories.adoption.listByOwner(ownerAccountId);
  }, [ownerAccountId]);

  const resource = useAsyncResource<AdoptionListing[]>(
    loader,
    [],
    "تعذر تحميل إعلانات التبني الخاصة بك.",
  );

  return {
    listings: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
