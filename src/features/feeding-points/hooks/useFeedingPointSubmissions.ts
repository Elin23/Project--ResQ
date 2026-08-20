import { useCallback } from "react";

import type { FeedingPointSubmission } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useFeedingPointSubmissions(ownerAccountId: string | null | undefined) {
  const loader = useCallback(async () => {
    if (!ownerAccountId) return [] as FeedingPointSubmission[];
    return repositories.feedingPointSubmissions.listByOwner(ownerAccountId);
  }, [ownerAccountId]);

  const resource = useAsyncResource<FeedingPointSubmission[]>(
    loader,
    [],
    "تعذر تحميل طلبات نقاط الإطعام.",
  );

  return {
    submissions: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
