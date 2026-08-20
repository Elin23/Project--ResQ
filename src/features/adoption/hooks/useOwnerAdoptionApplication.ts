import { useCallback, useState } from "react";

import type { AdoptionApplication } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useOwnerAdoptionApplication(
  applicationId: string | undefined,
  listingId: string | undefined,
  ownerAccountId: string | null | undefined,
) {
  const [deciding, setDeciding] = useState(false);
  const [confirmingHandover, setConfirmingHandover] = useState(false);

  const loader = useCallback(async () => {
    if (!applicationId || !listingId || !ownerAccountId) return undefined;
    return repositories.adoptionApplications.getForListingOwner(
      applicationId,
      listingId,
      ownerAccountId,
    );
  }, [applicationId, listingId, ownerAccountId]);

  const resource = useAsyncResource<AdoptionApplication | undefined>(
    loader,
    undefined,
    "تعذر تحميل طلب التبني.",
  );

  const accept = useCallback(async () => {
    if (!applicationId || !listingId || !ownerAccountId) return;
    setDeciding(true);
    try {
      await repositories.adoptionApplications.acceptForListingOwner(
        applicationId,
        listingId,
        ownerAccountId,
      );
      await resource.reload();
    } finally {
      setDeciding(false);
    }
  }, [applicationId, listingId, ownerAccountId, resource]);

  const reject = useCallback(async (decisionNote?: string) => {
    if (!applicationId || !listingId || !ownerAccountId) return;
    setDeciding(true);
    try {
      await repositories.adoptionApplications.rejectForListingOwner(
        applicationId,
        listingId,
        ownerAccountId,
        decisionNote,
      );
      await resource.reload();
    } finally {
      setDeciding(false);
    }
  }, [applicationId, listingId, ownerAccountId, resource]);

  const confirmHandover = useCallback(async () => {
    if (!applicationId || !listingId || !ownerAccountId) return;
    setConfirmingHandover(true);
    try {
      await repositories.adoptionApplications.confirmHandoverForListingOwner(
        applicationId,
        listingId,
        ownerAccountId,
      );
      await resource.reload();
    } finally {
      setConfirmingHandover(false);
    }
  }, [applicationId, listingId, ownerAccountId, resource]);

  return {
    application: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    accept,
    reject,
    deciding,
    confirmHandover,
    confirmingHandover,
  };
}
