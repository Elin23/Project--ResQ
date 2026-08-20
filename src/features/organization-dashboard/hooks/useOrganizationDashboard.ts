import { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";

import { adoptionMyListingsRoute, createCampaignRoute, feedingPointsRoute, myCampaignsRoute, organizationDetailsRoute, organizationReportDetailsRoute, organizationTaskDetailsRoute, veterinaryClinicsRoute, ROUTES } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { domainServices } from "@/src/services/domain/services";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { Report, RescueTask } from "@/src/domain";
import type { EmergencyRescueCase, OrganizationRescueTask } from "../types/organizationDashboard";
import { COLORS } from "@/src/theme";
import { useSession } from "@/src/features/session/SessionContext";
import type { WorkspaceMetric } from "@/src/components/ui/WorkspaceMetricGrid";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";

const fallbackImage = require("@/assets/images/dogg.png");

function relativeLabel(createdAt: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  return minutes < 60 ? `منذ ${minutes} دقيقة` : `منذ ${Math.round(minutes / 60)} ساعة`;
}

function reportView(report: Report): EmergencyRescueCase {
  return { id: report.id, title: report.title, location: report.locationName, distance: "قريب منك", reportedAgo: relativeLabel(report.createdAt), image: fallbackImage, urgent: report.priority === "urgent" };
}

function taskView(task: RescueTask): OrganizationRescueTask {
  return { id: task.id, code: `#${task.code}`, title: task.title, location: task.locationLabel, distance: task.locationDistance, progress: task.progress, image: { uri: task.imageUri } };
}

export function useOrganizationDashboard() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account } = useSession();
  const organizationId = account?.kind === "organization" ? account.id : "local-organization";
  const reportsLoader = useCallback(() => repositories.reports.listForOrganization(organizationId), [organizationId]);
  const tasksLoader = useCallback(() => repositories.rescue.listByOrganization(organizationId), [organizationId]);
  const reportsResource = useAsyncResource<Report[]>(reportsLoader, [], "تعذر تحميل البلاغات.");
  const tasksResource = useAsyncResource<RescueTask[]>(tasksLoader, [], "تعذر تحميل مهام الإنقاذ.");

  const emergencyCases = useMemo(() => reportsResource.data.filter((item) => item.status === "pending").map(reportView), [reportsResource.data]);
  const acceptedCaseIds = useMemo(() => reportsResource.data.filter((item) => item.assignedOrganizationId === organizationId).map((item) => item.id), [reportsResource.data]);
  const activeTask = useMemo(() => tasksResource.data[0] ? taskView(tasksResource.data[0]) : undefined, [tasksResource.data]);
  const metrics = useMemo<WorkspaceMetric[]>(() => [
    { key: "incoming", label: "بلاغات بانتظار الفرز", value: emergencyCases.length, icon: "notifications-outline", color: COLORS.warning },
    { key: "active", label: "مهام إنقاذ نشطة", value: tasksResource.data.filter((item) => item.stage !== "completed").length, icon: "navigate-outline", color: COLORS.primaryStrong },
    { key: "completed", label: "مكتملة هذا الشهر", value: tasksResource.data.filter((item) => item.stage === "completed").length, icon: "checkmark-done-outline", color: COLORS.success },
    { key: "team", label: "أعضاء متاحون", value: 12, icon: "people-outline", color: COLORS.info },
  ], [emergencyCases.length, organizationId, tasksResource.data]);

  const acceptCase = useCallback(async (id: string) => {
    await domainServices.rescueOperations.acceptIncomingReport(id, organizationId);
    await Promise.all([reportsResource.reload(), tasksResource.reload()]);
    showFeedback({ title: "تم استلام الحالة", message: "أضيفت الحالة إلى مهام الإنقاذ الخاصة بالجمعية.", tone: "success" });
  }, [organizationId, reportsResource, showFeedback, tasksResource]);

  return {
    emergencyCases,
    acceptedCaseIds,
    activeTask,
    metrics,
    loading: reportsResource.loading || tasksResource.loading,
    error: reportsResource.error ?? tasksResource.error,
    reload: async () => { await Promise.all([reportsResource.reload(), tasksResource.reload()]); },
    openNotifications: () => router.push(ROUTES.organizationNotifications),
    openReports: () => router.push(ROUTES.organizationReports),
    openTasks: () => router.push(ROUTES.organizationTasks),
    openCaseDetails: (id: string) => router.push(organizationReportDetailsRoute(id)),
    acceptCase,
    openTaskDetails: (id: string) => router.push(organizationTaskDetailsRoute(id)),
    openMap: () => router.push(ROUTES.organizationMap),
    openFeedingPoints: () => router.push(feedingPointsRoute("organization")),
    openAdoptionListings: () => router.push(adoptionMyListingsRoute("organization")),
    createCampaign: () => router.push(createCampaignRoute("organization")),
    openCampaigns: () => router.push(myCampaignsRoute("organization")),
    openVeterinaryClinics: () => router.push(veterinaryClinicsRoute("organization")),
    updateOrganizationLocation: () => showFeedback({ title: "تحديث موقع الجمعية", message: "سيتم اعتماد الموقع الجديد بعد تأكيده من الخريطة.", tone: "info" }),
    openOrganizationProfile: () => router.push(organizationDetailsRoute(organizationId)),
  };
}
