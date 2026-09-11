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
    locationLabel: task.locationLabel,
    reporterName: task.reporterName,
    reporterPhone: task.reporterPhone,
    imageUri: task.imageUri,
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
  const stage: OrganizationTaskStage = domainTask?.stage === "completed" ? "rescued" : (domainTask?.stage ?? "assigned");
  const checklist = domainTask?.checklist ?? { arrived: false, assessed: false, secured: false };
  const notes = domainTask?.notes ?? "";
  const images = domainTask?.evidenceUris ?? [];
  const allChecked = Object.values(checklist).every(Boolean);

  const toggleChecklist = useCallback(async (key: RescueChecklistKey) => {
    if (!domainTask) return;
    try {
      const updated = await repositories.rescue.toggleChecklist(domainTask.id, key);
      setDomainTask(updated);
    } catch (cause) {
      showFeedback({ title: "تعذر تحديث المهمة", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  }, [domainTask, showFeedback]);

  const openNavigation = useCallback(async () => {
    if (!domainTask) return;
    try {
      let updated = domainTask;
      if (updated.stage === "assigned") updated = await repositories.rescue.setStage(updated.id, "accepted");
      if (updated.stage === "accepted") updated = await repositories.rescue.setStage(updated.id, "on-route");
      setDomainTask(updated);
      if (!Number.isFinite(updated.latitude) || !Number.isFinite(updated.longitude) || (updated.latitude === 0 && updated.longitude === 0)) {
        showFeedback({ title: "الموقع غير متاح", message: "لا يحتوي البلاغ على إحداثيات صالحة للملاحة.", tone: "warning" });
        return;
      }
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${updated.latitude},${updated.longitude}`);
    } catch (cause) {
      showFeedback({ title: "تعذر بدء الملاحة", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  }, [domainTask, showFeedback]);

  const callReporter = useCallback(async () => {
    const phone = domainTask?.reporterPhone?.trim();
    if (!phone) {
      showFeedback({ title: "رقم المبلّغ غير متاح", message: "لم يشارك المبلّغ رقم هاتف صالحًا مع هذا البلاغ.", tone: "info" });
      return;
    }
    try { await Linking.openURL(`tel:${phone}`); }
    catch { showFeedback({ title: "تعذر فتح الاتصال", message: "تحقق من إمكانية إجراء المكالمات على الجهاز.", tone: "error" }); }
  }, [domainTask, showFeedback]);

  const shareTask = useCallback(async () => {
    if (!task) return;
    await Share.share({ message: `مهمة إنقاذ ${task.code}\n${task.locationLabel}\n${task.healthStatus}` });
  }, [task]);

  const pickImage = useCallback(async (camera: boolean) => {
    if (!domainTask) return;
    try {
      const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!handlePermission(permission, { title: camera ? "صلاحية الكاميرا مطلوبة" : "صلاحية الصور مطلوبة", message: camera ? "يلزم السماح باستخدام الكاميرا لتوثيق المهمة." : "يلزم السماح بالوصول للصور." })) return;
      const result = camera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsMultipleSelection: true });
      if (!result.canceled) {
        const updated = await repositories.rescue.addEvidence(domainTask.id, result.assets.map((asset) => asset.uri));
        setDomainTask(updated);
        showFeedback({ title: "تم رفع الصور", message: "حُفظ توثيق المهمة على الخادم.", tone: "success" });
      }
    } catch (cause) {
      showFeedback({ title: "تعذر رفع الصور", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  }, [domainTask, handlePermission, showFeedback]);

  const setNotes = useCallback((value: string) => {
    if (!domainTask) return;
    setDomainTask({ ...domainTask, notes: value });
  }, [domainTask]);

  const saveUpdates = useCallback(async () => {
    if (!domainTask) return;
    try {
      let updated = await repositories.rescue.saveNotes(domainTask.id, domainTask.notes);
      if (allChecked) {
        if (updated.stage === "arrived") updated = await repositories.rescue.setStage(updated.id, "rescued");
        if (updated.stage !== "rescued" && updated.stage !== "completed") {
          showFeedback({ title: "أكمل مراحل المهمة بالترتيب", message: "يجب تسجيل الوصول ثم تأمين الحيوان قبل إكمال المهمة.", tone: "error" });
          setDomainTask(updated);
          return;
        }
        if (updated.stage !== "completed") updated = await repositories.rescue.setStage(updated.id, "completed");
        updated = await repositories.rescue.setProgress(domainTask.id, 100);
        setDomainTask(updated);
        router.replace(organizationTaskCompletedRoute(domainTask.id));
        return;
      }
      setDomainTask(updated);
      showFeedback({ title: "تم حفظ التحديثات", message: "تم حفظ الملاحظات وتقدم المهمة على الخادم.", tone: "success" });
    } catch (cause) {
      showFeedback({ title: "تعذر حفظ المهمة", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  }, [allChecked, domainTask, router, showFeedback]);

  const goBack = useCallback(() => router.canGoBack() ? router.back() : router.replace(ROUTES.organizationDashboard), [router]);

  return { task, stage, checklist, notes, images, allChecked, loading, error, reload: load, setNotes, toggleChecklist, openNavigation, callReporter, shareTask, openCamera: () => void pickImage(true), openGallery: () => void pickImage(false), saveUpdates, goBack };
}
