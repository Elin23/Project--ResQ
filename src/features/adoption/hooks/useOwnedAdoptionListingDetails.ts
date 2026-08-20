import { useCallback, useState } from "react";

import type { AdoptionListing } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedAdoptionListingDetails(
  id: string | undefined,
  ownerAccountId: string | null | undefined,
) {
  const [closing, setClosing] = useState(false);

  const loader = useCallback(async () => {
    if (!id || !ownerAccountId) return undefined;
    return repositories.adoption.getOwnedById(id, ownerAccountId);
  }, [id, ownerAccountId]);

  const resource = useAsyncResource<AdoptionListing | undefined>(
    loader,
    undefined,
    "تعذر تحميل تفاصيل إعلان التبني.",
  );

  const closeListing = useCallback(async () => {
    if (!id || !ownerAccountId) return;
    setClosing(true);
    try {
      await repositories.adoption.closeOwned(id, ownerAccountId);
      await resource.reload();
    } finally {
      setClosing(false);
    }
  }, [id, ownerAccountId, resource]);

  return {
    listing: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    closeListing,
    closing,
  };
}
