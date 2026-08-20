import { useCallback } from "react";

import type { AdoptionApplication } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useListingApplications(
  listingId: string | undefined,
  ownerAccountId: string | null | undefined,
) {
  const loader = useCallback(async () => {
    if (!listingId || !ownerAccountId) return [] as AdoptionApplication[];
    return repositories.adoptionApplications.listByListing(listingId, ownerAccountId);
  }, [listingId, ownerAccountId]);

  const resource = useAsyncResource<AdoptionApplication[]>(
    loader,
    [],
    "تعذر تحميل طلبات تبني هذا الحيوان.",
  );

  return {
    applications: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
