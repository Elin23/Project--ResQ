import { useCallback, useState } from "react";

import { repositories } from "@/src/services/domain/repositories";

export function useManageDonationCampaign() {
  const [updating, setUpdating] = useState(false);

  const run = useCallback(async <T,>(operation: () => Promise<T>) => {
    setUpdating(true);
    try {
      return await operation();
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updating,
    pause: (id: string, ownerId: string) =>
      run(() => repositories.donationCampaigns.pauseOwned(id, ownerId)),
    resume: (id: string, ownerId: string) =>
      run(() => repositories.donationCampaigns.resumeOwned(id, ownerId)),
    close: (id: string, ownerId: string) =>
      run(() => repositories.donationCampaigns.closeOwned(id, ownerId)),
    submitForReview: (id: string, ownerId: string) =>
      run(() => repositories.donationCampaigns.submitForReview(id, ownerId)),
  };
}
