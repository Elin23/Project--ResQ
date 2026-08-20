import { useCallback } from "react";

import type { DonationCampaign } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useDonationCampaignDetails(id?: string) {
  const loader = useCallback(async () => {
    if (!id) return undefined;
    return repositories.donationCampaigns.getPublicById(id);
  }, [id]);

  const resource = useAsyncResource<DonationCampaign | undefined>(
    loader,
    undefined,
    "تعذر تحميل تفاصيل الحملة.",
  );

  return {
    campaign: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
