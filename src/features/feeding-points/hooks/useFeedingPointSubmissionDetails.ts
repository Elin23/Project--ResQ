import { useCallback } from "react";

import type { FeedingPointSubmission } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useFeedingPointSubmissionDetails(
  id: string | undefined,
  ownerAccountId: string | null | undefined,
) {
  const loader = useCallback(async () => {
    if (!id || !ownerAccountId) return undefined;
    return repositories.feedingPointSubmissions.getOwnedById(id, ownerAccountId);
  }, [id, ownerAccountId]);

  const resource = useAsyncResource<FeedingPointSubmission | undefined>(
    loader,
    undefined,
    "تعذر تحميل تفاصيل الطلب.",
  );

  return {
    submission: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
