import { useCallback } from "react";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { MapPlaceApplication, ServicePlace } from "@/src/domain/service-places";

export function useMyMapPlaces(userId: string) {
  const loader = useCallback(async () => {
    const [places, applications] = await Promise.all([
      repositories.servicePlaces.listOwnedByUser(userId),
      repositories.mapPlaceApplications.listForUser(userId),
    ]);
    return { places, applications };
  }, [userId]);

  const resource = useAsyncResource<{ places: ServicePlace[]; applications: MapPlaceApplication[] }>(
    loader,
    { places: [], applications: [] },
    "تعذر تحميل الجهات والطلبات.",
  );

  return {
    places: resource.data.places,
    applications: resource.data.applications,
    loading: resource.loading,
    refreshing: resource.refreshing,
    refreshError: resource.refreshError,
    isStale: resource.isStale,
    lastUpdatedAt: resource.lastUpdatedAt,
    error: resource.error,
    reload: resource.reload,
  };
}
