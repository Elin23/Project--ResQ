import { useCallback } from "react";

import { repositories } from "@/src/services/domain/repositories";
import type { ServicePlace } from "@/src/domain/service-places";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";

export function useServicePlaceDetails(id: string) {
  const loader = useCallback(() => repositories.servicePlaces.getById(id), [id]);
  const resource = useAsyncResource<ServicePlace | null>(loader, null, "تعذر تحميل بيانات الجهة.");
  return {
    data: resource.data,
    isLoading: resource.loading,
    error: resource.error,
    refetch: resource.reload,
  };
}
