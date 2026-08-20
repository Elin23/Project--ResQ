import { useCallback } from "react";
import type { AdoptionContactAccess } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useAcceptedAdoptionContact(applicationId?: string, applicantAccountId?: string | null) {
  const loader = useCallback(async () => {
    if (!applicationId || !applicantAccountId) return undefined;
    return repositories.adoptionApplications.getAcceptedContactForApplicant(applicationId, applicantAccountId);
  }, [applicationId, applicantAccountId]);

  const resource = useAsyncResource<AdoptionContactAccess | undefined>(loader, undefined, "تعذر تحميل معلومات التواصل.");
  return { contactAccess: resource.data, loading: resource.loading, error: resource.error, reload: resource.reload };
}
