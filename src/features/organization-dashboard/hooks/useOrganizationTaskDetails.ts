import { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, Share } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

import { organizationTaskCompletedRoute, ROUTES } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import type { RescueChecklistKey, RescueTask } from "@/src/domain";
import type { OrganizationTask, OrganizationTaskStage } from "../types/organizationTask";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";

function toView(task: RescueTask): OrganizationTask {
  return {
    id: task.id,
    code: task.code,
    animalType: task.animalType,
    city: task.city,
    healthStatus: task.healthStatus,
    reporterNote: task.reporterNote,
    reportedAgo: "مهمة نشطة",
    etaMinutes: task.etaMinutes,
    locationLabel: task.locationLabel,
    locationDistance: task.locationDistance,
    reporterName: task.reporterName,
    reporterPhone: task.reporterPhone,
    image: { uri: task.imageUri },
    mapImage: { uri: task.mapImageUri },
  };
}

export function useOrganizationTaskDetails() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { handlePermission } = usePermissionFeedback();
  const params = useLocalSearchParams<{ id?: string }>();
  const [domainTask, setDomainTask] = useState<RescueTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!params.id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const task = await repositories.rescue.getById(params.id);
      setDomainTask(task ?? null);
      if (!task) setError("تعذر العثور على مهمة الإنقاذ المطلوبة.");
    } catch {
      setError("تعذر تحميل مهمة الإنقاذ.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  const task = useMemo(() => domainTask ? toView(domainTask) : undefined, [domainTask]);
  const stage: OrganizationTaskStage = domainTask?.stage === "completed" ? "rescued" : (domainTask?.stage ?? "on-route");
  const checklist = domainTask?.checklist ?? { arrived: false, assessed: false, secured: false };
  const notes = domainTask?.notes ?? "";
  const images = domainTask?.evidenceUris ?? [];
  const allChecked = Object.values(checklist).every(Boolean);

  const toggleChecklist = useCallback(async (key: RescueChecklistKey) => {
    if (!domainTask) return;
    let updated = await repositories.rescue.toggleChecklist(domainTask.id, key);
    if (key === "arrived" && updated.checklist.arrived) updated = await repositories.rescue.setStage(domainTask.id, "arrived");
    if (key === "secured" && updated.checklist.secured) updated = await repositories.rescue.setStage(domainTask.id, "rescued");
    setDomainTask(updated);
  }, [domainTask]);

  const openNavigation = useCallback(async () => {
    if (!domainTask) return;
    const updated = await repositories.rescue.setStage(domainTask.id, "on-route");
    setDomainTask(updated);
    await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${domainTask.latitude},${domainTask.longitude}`);
  }, [domainTask]);

  const callReporter = useCallback(async () => { await Linking.openURL(`tel:${domainTask?.reporterPhone ?? "+963900000000"}`); }, [domainTask]);
  const callVet = useCallback(async () => { await Linking.openURL("tel:+963110000000"); }, []);
  const callAssociation = useCallback(async () => { await Linking.openURL("tel:+963110000001"); }, []);

  const shareTask = useCallback(async () => {
    if (!task) return;
    await Share.share({ message: `مهمة إنقاذ ${task.code}\n${task.locationLabel}\n${task.healthStatus}` });
  }, [task]);

  const pickImage = useCallback(async (camera: boolean) => {
    if (!domainTask) return;
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, { title: camera ? "صلاحية الكاميرا مطلوبة" : "صلاحية الصور مطلوبة", message: camera ? "يلزم السماح باستخدام الكاميرا لتوثيق المهمة." : "يلزم السماح بالوصول للصور." })) return;
    const result = camera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsMultipleSelection: true });
    if (!result.canceled) {
      const updated = await repositories.rescue.addEvidence(domainTask.id, result.assets.map((asset) => asset.uri));
      setDomainTask(updated);
    }
  }, [domainTask, handlePermission]);

  const setNotes = useCallback((value: string) => {
    if (!domainTask) return;
    setDomainTask({ ...domainTask, notes: value });
  }, [domainTask]);

  const saveUpdates = useCallback(async () => {
    if (!domainTask) return;
    let updated = await repositories.rescue.saveNotes(domainTask.id, domainTask.notes);
    if (allChecked) {
      updated = await repositories.rescue.setStage(domainTask.id, "completed");
      updated = await repositories.rescue.setProgress(domainTask.id, 100);
      setDomainTask(updated);
      router.replace(organizationTaskCompletedRoute(domainTask.id));
      return;
    }
    setDomainTask(updated);
    showFeedback({ title: "تم حفظ التحديثات", message: "تم حفظ تقدم المهمة ويمكنك استكمال التوثيق لاحقًا.", tone: "success" });
  }, [allChecked, domainTask, router, showFeedback]);

  const goBack = useCallback(() => router.canGoBack() ? router.back() : router.replace(ROUTES.organizationDashboard), [router]);

  return { task, stage, checklist, notes, images, allChecked, loading, error, reload: load, setNotes, toggleChecklist, openNavigation, callReporter, callVet, callAssociation, shareTask, openCamera: () => pickImage(true), openGallery: () => pickImage(false), saveUpdates, goBack };
}
