import { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";

import { adoptionMyListingsRoute, articleDetailsRoute, articlesRoute, createCampaignRoute, feedingPointsRoute, myCampaignsRoute, organizationDetailsRoute, organizationReportDetailsRoute, organizationTaskDetailsRoute, successStoriesRoute, successStoryDetailsRoute, veterinaryClinicsRoute, ROUTES } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { domainServices } from "@/src/services/domain/services";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { Report, RescueTask } from "@/src/domain";
import type { OrganizationRescueTask } from "../types/organizationDashboard";
import { COLORS } from "@/src/theme";
import { useSession } from "@/src/features/session/SessionContext";
import type { WorkspaceMetric } from "@/src/components/ui/WorkspaceMetricGrid";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useUnreadNotificationCount } from "@/src/features/notifications/hooks";
import { fetchMyOrganization } from "@/src/services/api/organizationsApi";

function relativeLabel(createdAt: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  return minutes < 60 ? `منذ ${minutes} دقيقة` : `منذ ${Math.round(minutes / 60)} ساعة`;
}

function taskView(task: RescueTask): OrganizationRescueTask {
  return { id: task.id, code: `#${task.code}`, title: task.title, location: task.locationLabel, distance: task.locationDistance, progress: task.progress, image: { uri: task.imageUri } };
}

export function useOrganizationDashboard() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account } = useSession();
  const organizationId = account?.kind === "organization" ? String(account.organizationId ?? "") : "";
  const unreadNotifications = useUnreadNotificationCount(Boolean(account));
  const organizationLoader = useCallback(async () => account?.kind === "organization" ? fetchMyOrganization() : null, [account?.kind]);
  const organizationResource = useAsyncResource(organizationLoader, null, "تعذر تحميل بيانات الجمعية.");
  const reportsLoader = useCallback(() => repositories.reports.listForOrganization(organizationId), [organizationId]);
  const tasksLoader = useCallback(() => repositories.rescue.listByOrganization(organizationId), [organizationId]);
  const reportsResource = useAsyncResource<Report[]>(reportsLoader, [], "تعذر تحميل البلاغات.");
  const tasksResource = useAsyncResource<RescueTask[]>(tasksLoader, [], "تعذر تحميل مهام الإنقاذ.");

  const assignedTasks = useMemo(() => tasksResource.data.filter((item) => item.stage === "assigned"), [tasksResource.data]);
  const emergencyCases = useMemo(() => assignedTasks.map((task) => ({ id: task.reportId, title: task.title, location: task.locationLabel, distance: task.locationDistance, reportedAgo: relativeLabel(task.createdAt), image: { uri: task.imageUri }, urgent: false })), [assignedTasks]);
  const acceptedCaseIds = useMemo(() => tasksResource.data.filter((item) => item.stage !== "assigned" && item.stage !== "cancelled").map((item) => item.reportId), [tasksResource.data]);
  const activeTask = useMemo(() => tasksResource.data.find((item) => !["assigned", "completed", "cancelled"].includes(item.stage)) ? taskView(tasksResource.data.find((item) => !["assigned", "completed", "cancelled"].includes(item.stage))!) : undefined, [tasksResource.data]);
  const operationsAvailable = organizationResource.data?.status === "ACTIVE"
    && organizationResource.data?.verificationStatus === "VERIFIED";
  const operationsAvailabilityLabel = operationsAvailable
    ? "الفريق يستقبل حالات جديدة"
    : organizationResource.data?.verificationStatus === "REJECTED"
      ? "الحساب غير معتمد ولا يمكنه استلام حالات جديدة"
      : "استلام الحالات سيتاح بعد اعتماد الجمعية";

  const metrics = useMemo<WorkspaceMetric[]>(() => [
    { key: "incoming", label: "بلاغات بانتظار الفرز", value: emergencyCases.length, icon: "notifications-outline", color: COLORS.warning },
    { key: "active", label: "مهام إنقاذ نشطة", value: tasksResource.data.filter((item) => !["assigned", "completed", "cancelled"].includes(item.stage)).length, icon: "navigate-outline", color: COLORS.primaryStrong },
    { key: "completed", label: "مكتملة هذا الشهر", value: tasksResource.data.filter((item) => item.stage === "completed").length, icon: "checkmark-done-outline", color: COLORS.success },
    { key: "assigned", label: "مهام بانتظار القبول", value: assignedTasks.length, icon: "time-outline", color: COLORS.info },
  ], [assignedTasks.length, emergencyCases.length, tasksResource.data]);

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
    operationsAvailable,
    operationsAvailabilityLabel,
    loading: reportsResource.loading || tasksResource.loading || organizationResource.loading,
    error: reportsResource.error ?? tasksResource.error ?? organizationResource.error,
    reload: async () => { await Promise.all([reportsResource.reload(), tasksResource.reload(), organizationResource.reload()]); },
    unreadNotificationCount: unreadNotifications.count,
    organizationName: organizationResource.data?.name ?? account?.displayName ?? "الجمعية",
    organizationLogoUrl: organizationResource.data?.logoUrl ?? undefined,
    organizationVerified: organizationResource.data?.verificationStatus === "VERIFIED" && organizationResource.data?.status === "ACTIVE",
    organizationStatusLabel: organizationResource.data?.verificationStatus === "VERIFIED" && organizationResource.data?.status === "ACTIVE"
      ? "جمعية معتمدة"
      : organizationResource.data?.verificationStatus === "REJECTED"
        ? "تعذر اعتماد الجمعية"
        : "قيد المراجعة والاعتماد",
    totalRescueTasks: tasksResource.data.length,
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
    openArticles: () => router.push(articlesRoute("organization")),
    openArticle: (id: string) => router.push(articleDetailsRoute(id, "organization")),
    openSuccessStories: () => router.push(successStoriesRoute("organization")),
    openSuccessStory: (id: string) => router.push(successStoryDetailsRoute(id, "organization")),
    updateOrganizationLocation: () => router.push(ROUTES.organizationData),
    openOrganizationProfile: () => router.push(organizationDetailsRoute(organizationId)),
  };
}
