import { useCallback } from "react";

import type { DonationTransfer } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedCampaignTransfers(
  campaignId?: string,
  ownerAccountId?: string | null,
) {
  const loader = useCallback(async () => {
    if (!campaignId || !ownerAccountId) return [] as DonationTransfer[];
    return repositories.donationTransfers.listByCampaignOwner(
      campaignId,
      ownerAccountId,
    );
  }, [campaignId, ownerAccountId]);

  const resource = useAsyncResource<DonationTransfer[]>(
    loader,
    [],
    "تعذر تحميل حوالات الحملة.",
  );

  return {
    transfers: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
