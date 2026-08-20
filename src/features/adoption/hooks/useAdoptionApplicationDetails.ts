import { useCallback, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import type { AdoptionApplication } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useAdoptionApplicationDetails(applicantAccountId: string | null | undefined) {
  const [confirmingHandover, setConfirmingHandover] = useState(false);
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const loader = useCallback(async () => {
    if (!applicationId || !applicantAccountId) return undefined;
    return repositories.adoptionApplications.getByApplicant(applicationId, applicantAccountId);
  }, [applicationId, applicantAccountId]);

  const resource = useAsyncResource<AdoptionApplication | undefined>(
    loader,
    undefined,
    "تعذر تحميل تفاصيل طلب التبني.",
  );

  const confirmHandover = useCallback(async () => {
    if (!applicationId || !applicantAccountId) return;
    setConfirmingHandover(true);
    try {
      await repositories.adoptionApplications.confirmHandoverForApplicant(
        applicationId,
        applicantAccountId,
      );
      await resource.reload();
    } finally {
      setConfirmingHandover(false);
    }
  }, [applicationId, applicantAccountId, resource]);

  return {
    application: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    confirmHandover,
    confirmingHandover,
  };
}
