import { useCallback } from "react";

import type { DonationCampaign } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnedDonationCampaigns(ownerAccountId?: string | null) {
  const loader = useCallback(async () => {
    if (!ownerAccountId) return [] as DonationCampaign[];
    return repositories.donationCampaigns.listByOwner(ownerAccountId);
  }, [ownerAccountId]);

  const resource = useAsyncResource<DonationCampaign[]>(
    loader,
    [],
    "تعذر تحميل حملاتك.",
  );

  return {
    campaigns: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
