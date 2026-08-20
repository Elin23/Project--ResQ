import { useCallback } from "react";

import type { DonationCampaign, ServicePlace } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useVeterinaryClinicDetails(id?: string) {
  const clinicLoader = useCallback(async () => {
    if (!id) return null;
    const place = await repositories.servicePlaces.getById(id);
    return place?.type === "clinic" ? place : null;
  }, [id]);

  const clinic = useAsyncResource<ServicePlace | null>(
    clinicLoader,
    null,
    "تعذر تحميل بيانات العيادة.",
  );

  const clinicAccountId = clinic.data?.accountId;

  const campaignsLoader = useCallback(async () => {
    if (!clinicAccountId) return [] as DonationCampaign[];
    const publicCampaigns = await repositories.donationCampaigns.listPublic();
    return publicCampaigns.filter(
      (campaign) => campaign.ownerAccountId === clinicAccountId,
    );
  }, [clinicAccountId]);

  const campaigns = useAsyncResource<DonationCampaign[]>(
    campaignsLoader,
    [],
    "تعذر تحميل حملات العيادة.",
  );

  return {
    clinic: clinic.data,
    campaigns: campaigns.data,
    loading: clinic.loading || campaigns.loading,
    error: clinic.error ?? campaigns.error,
    reload: async () => {
      await clinic.reload();
      await campaigns.reload();
    },
  };
}
