import { useCallback } from "react";

import type { AdoptionApplication } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useAdoptionApplications(applicantAccountId: string | null | undefined) {
  const loader = useCallback(async () => {
    if (!applicantAccountId) return [] as AdoptionApplication[];
    return repositories.adoptionApplications.listByApplicant(applicantAccountId);
  }, [applicantAccountId]);

  const resource = useAsyncResource<AdoptionApplication[]>(
    loader,
    [],
    "تعذر تحميل طلبات التبني الخاصة بك.",
  );

  return {
    applications: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
