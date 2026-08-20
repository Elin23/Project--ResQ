import { useCallback } from "react";

import type { DonationCampaign } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedDonationCampaign(id?: string, ownerAccountId?: string | null) {
  const loader = useCallback(async () => {
    if (!id || !ownerAccountId) return undefined;
    return repositories.donationCampaigns.getOwnedById(id, ownerAccountId);
  }, [id, ownerAccountId]);

  const resource = useAsyncResource<DonationCampaign | undefined>(
    loader,
    undefined,
    "تعذر تحميل الحملة.",
  );

  return {
    campaign: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
