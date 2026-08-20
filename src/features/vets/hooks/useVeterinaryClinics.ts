import { useCallback } from "react";

import type { ServicePlace } from "@/src/domain/service-places";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";

export function useVeterinaryClinics() {
  const loader = useCallback(
    () => repositories.servicePlaces.list({ type: "clinic" }),
    [],
  );
  const resource = useAsyncResource<ServicePlace[]>(
    loader,
    [],
    "تعذر تحميل العيادات البيطرية.",
  );

  return {
    clinics: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
  };
}
