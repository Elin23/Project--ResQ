import { useCallback, useState } from "react";

import type { DonationTransfer } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedCampaignTransfers(
  campaignId?: string,
  ownerAccountId?: string | null,
) {
  const [reviewingTransferId, setReviewingTransferId] = useState<string | null>(null);

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

  const verify = useCallback(async (transferId: string) => {
    if (!campaignId || !ownerAccountId) return;
    setReviewingTransferId(transferId);
    try {
      await repositories.donationTransfers.verifyByCampaignOwner(campaignId, transferId, ownerAccountId);
      await resource.reload();
    } finally {
      setReviewingTransferId(null);
    }
  }, [campaignId, ownerAccountId, resource.reload]);

  const reject = useCallback(async (transferId: string, reason: string) => {
    if (!campaignId || !ownerAccountId) return;
    setReviewingTransferId(transferId);
    try {
      await repositories.donationTransfers.rejectByCampaignOwner(campaignId, transferId, ownerAccountId, reason);
      await resource.reload();
    } finally {
      setReviewingTransferId(null);
    }
  }, [campaignId, ownerAccountId, resource.reload]);

  return {
    transfers: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    verify,
    reject,
    reviewingTransferId,
  };
}
