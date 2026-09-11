import { useCallback } from "react";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { fetchOrganization } from "@/src/services/api/organizationsApi";
export function useOrganizationDetails(id?: string) {
  const load = useCallback(() => id ? fetchOrganization(id) : Promise.resolve(null), [id]);
  return useAsyncResource(load, null, "تعذر تحميل بيانات الجمعية. حاول مرة أخرى.", { cacheKey: id ? `organization-${id}` : undefined, refreshOnForeground: true });
}
