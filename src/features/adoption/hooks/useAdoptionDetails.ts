import { useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { AdoptionListing } from "@/src/domain";

export function useAdoptionDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const loader = useCallback(() => id ? repositories.adoption.getById(id) : Promise.resolve(undefined), [id]);
  const resource = useAsyncResource<AdoptionListing | undefined>(loader, undefined, "تعذر تحميل تفاصيل حالة التبني.");
  return { listing: resource.data, loading: resource.loading, error: resource.error, reload: resource.reload };
}
