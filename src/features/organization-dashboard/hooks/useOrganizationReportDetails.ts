import { useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { repositories } from "@/src/services/domain/repositories";
import { domainServices } from "@/src/services/domain/services";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { organizationTaskDetailsRoute, ROUTES } from "@/src/navigation/routes";
import type { Report } from "@/src/domain";
import { useSession } from "@/src/features/session/SessionContext";

export function useOrganizationReportDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { account } = useSession();
  const organizationId = account?.kind === "organization" ? account.id : "local-organization";
  const loader = useCallback(() => id ? repositories.reports.getById(id) : Promise.resolve(undefined), [id]);
  const resource = useAsyncResource<Report | undefined>(loader, undefined, "تعذر تحميل تفاصيل البلاغ.");

  const accept = useCallback(async () => {
    if (!resource.data) return;
    const task = await domainServices.rescueOperations.acceptIncomingReport(resource.data.id, organizationId);
    router.replace(organizationTaskDetailsRoute(task.id));
  }, [organizationId, resource.data, router]);

  return {
    report: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    accept,
    backToReports: () => router.replace(ROUTES.organizationReports),
    goBack: () => router.canGoBack() ? router.back() : router.replace(ROUTES.organizationReports),
  };
}
