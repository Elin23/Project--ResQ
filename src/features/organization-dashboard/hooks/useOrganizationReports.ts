import { useCallback } from "react";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { Report } from "@/src/domain";
import { useSession } from "@/src/features/session/SessionContext";

export function useOrganizationReports() {
  const { account } = useSession();
  const organizationId = account?.kind === "organization" ? account.id : "local-organization";
  const loader = useCallback(() => repositories.reports.listForOrganization(organizationId), [organizationId]);
  const resource = useAsyncResource<Report[]>(loader, [], "تعذر تحميل البلاغات الواردة.");
  return { reports: resource.data, loading: resource.loading, error: resource.error, reload: resource.reload };
}
