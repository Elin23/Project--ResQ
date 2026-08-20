import { useCallback, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { RescueTask } from "@/src/domain";

function formatDuration(task: RescueTask) {
  const end = task.completedAt ? new Date(task.completedAt).getTime() : Date.now();
  const minutes = Math.max(1, Math.round((end - new Date(task.createdAt).getTime()) / 60000));
  if (minutes < 60) return `${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} ساعة و${rest} دقيقة` : `${hours} ساعة`;
}

export function useCompletedRescueTask() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const loader = useCallback(() => id ? repositories.rescue.getById(id) : Promise.resolve(undefined), [id]);
  const resource = useAsyncResource<RescueTask | undefined>(loader, undefined, "تعذر تحميل ملخص المهمة المكتملة.");
  const summary = useMemo(() => resource.data ? {
    completedLabel: new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(new Date(resource.data.completedAt ?? Date.now())),
    duration: formatDuration(resource.data),
    distance: resource.data.distanceKm ? `${resource.data.distanceKm.toFixed(1)} كم` : "غير مسجلة",
    uploadedPhotos: `${resource.data.evidenceUris.length} صور`,
    notesStatus: resource.data.notes.trim() ? "تم الحفظ" : "لا توجد ملاحظات",
  } : undefined, [resource.data]);
  return { task: resource.data, summary, loading: resource.loading, error: resource.error, reload: resource.reload };
}
