import { useCallback } from "react";

import type { DonationTransfer } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useMyDonations(accountId?: string | null) {
  const loader = useCallback(async () => {
    if (!accountId) return [] as DonationTransfer[];
    return repositories.donationTransfers.listByDonor(accountId);
  }, [accountId]);

  const resource = useAsyncResource<DonationTransfer[]>(
    loader,
    [],
    "تعذر تحميل سجل تبرعاتك.",
  );

  return {
    transfers: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
