import { useCallback, useMemo } from "react";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { RescueTask } from "@/src/domain";
import type { OrganizationRescueTask } from "../types/organizationDashboard";
import { useSession } from "@/src/features/session/SessionContext";

function taskView(task: RescueTask): OrganizationRescueTask {
  return { id: task.id, code: `#${task.code}`, title: task.title, location: task.locationLabel, distance: task.locationDistance, progress: task.progress, image: { uri: task.imageUri } };
}

export function useOrganizationTasks() {
  const { account } = useSession();
  const organizationId = account?.kind === "organization" ? account.id : "local-organization";
  const loader = useCallback(() => repositories.rescue.listByOrganization(organizationId), [organizationId]);
  const resource = useAsyncResource<RescueTask[]>(loader, [], "تعذر تحميل مهام الإنقاذ.");
  const tasks = useMemo(() => resource.data.map(taskView), [resource.data]);
  return { tasks, loading: resource.loading, error: resource.error, reload: resource.reload };
}
