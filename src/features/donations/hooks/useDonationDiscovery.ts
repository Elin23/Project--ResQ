import { useCallback, useMemo, useState } from "react";

import type { DonationCampaign, DonationCampaignCategory, DonationTransfer } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export type DonationCategoryFilter = "all" | DonationCampaignCategory;

export function useDonationDiscovery(donorAccountId?: string | null) {
  const [category, setCategory] = useState<DonationCategoryFilter>("all");

  const campaignsLoader = useCallback(
    () => repositories.donationCampaigns.listPublic(),
    [],
  );
  const campaignsResource = useAsyncResource<DonationCampaign[]>(
    campaignsLoader,
    [],
    "تعذر تحميل حملات التبرع.",
    { cacheKey: "public-donation-campaigns", refreshOnForeground: true },
  );

  const transfersLoader = useCallback(async () => {
    if (!donorAccountId) return [] as DonationTransfer[];
    return repositories.donationTransfers.listByDonor(donorAccountId);
  }, [donorAccountId]);
  const transfersResource = useAsyncResource<DonationTransfer[]>(
    transfersLoader,
    [],
    "تعذر تحميل تبرعاتك الأخيرة.",
  );

  const visibleCampaigns = useMemo(
    () =>
      category === "all"
        ? campaignsResource.data
        : campaignsResource.data.filter((campaign) => campaign.category === category),
    [campaignsResource.data, category],
  );

  const heroCampaign = useMemo(
    () =>
      campaignsResource.data.find((campaign) => campaign.status === "active" && campaign.urgent)
      ?? campaignsResource.data.find((campaign) => campaign.status === "active")
      ?? campaignsResource.data[0],
    [campaignsResource.data],
  );

  const mostNeeded = useMemo(
    () =>
      [...visibleCampaigns]
        .filter((campaign) => campaign.status === "active")
        .sort((a, b) => {
          if (a.urgent !== b.urgent) return Number(b.urgent) - Number(a.urgent);
          const aRatio = a.targetAmount > 0 ? a.raisedAmount / a.targetAmount : 1;
          const bRatio = b.targetAmount > 0 ? b.raisedAmount / b.targetAmount : 1;
          return aRatio - bRatio;
        })[0],
    [visibleCampaigns],
  );

  const activeCampaigns = useMemo(
    () =>
      visibleCampaigns
        .filter((campaign) => campaign.status === "active" && campaign.id !== mostNeeded?.id)
        .slice(0, 4),
    [visibleCampaigns, mostNeeded?.id],
  );

  const community = useMemo(() => {
    const campaigns = campaignsResource.data;
    return {
      raisedAmount: campaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0),
      donors: campaigns.reduce((sum, campaign) => sum + campaign.donorCount, 0),
      organizations: new Set(campaigns.map((campaign) => campaign.ownerAccountId)).size,
      activeCampaigns: campaigns.filter((campaign) => campaign.status === "active").length,
    };
  }, [campaignsResource.data]);

  return {
    category,
    setCategory,
    campaigns: visibleCampaigns,
    heroCampaign,
    mostNeeded,
    activeCampaigns,
    community,
    transfers: transfersResource.data.slice(0, 3),
    loading: campaignsResource.loading || transfersResource.loading,
    refreshing: campaignsResource.refreshing || transfersResource.refreshing,
    refreshError: campaignsResource.refreshError ?? transfersResource.refreshError,
    isStale: campaignsResource.isStale,
    lastUpdatedAt: campaignsResource.lastUpdatedAt,
    error: campaignsResource.error ?? transfersResource.error,
    reload: async () => {
      await Promise.all([campaignsResource.reload(), transfersResource.reload()]);
    },
  };
}
