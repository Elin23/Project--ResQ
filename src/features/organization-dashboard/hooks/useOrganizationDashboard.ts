import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { organizationDetailsRoute, reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import {
  CURRENT_RESCUE_TASK,
  EMERGENCY_RESCUE_CASES,
} from "../constants/organizationDashboard";

export function useOrganizationDashboard() {
  const router = useRouter();
  const [acceptedCaseIds, setAcceptedCaseIds] = useState<string[]>([]);
  const [taskProgress, setTaskProgress] = useState(CURRENT_RESCUE_TASK.progress);

  const activeTask = useMemo(
    () => ({ ...CURRENT_RESCUE_TASK, progress: taskProgress }),
    [taskProgress],
  );

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const openReports = useCallback(() => {
    router.push(ROUTES.reports);
  }, [router]);

  const openCaseDetails = useCallback(
    (id: string) => {
      router.push(reportDetailsRoute(id));
    },
    [router],
  );

  const acceptCase = useCallback((id: string) => {
    setAcceptedCaseIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
    Alert.alert("تم استلام الحالة", "أضيفت الحالة إلى مهام الإنقاذ الخاصة بالجمعية.");
  }, []);

  const updateTaskProgress = useCallback(() => {
    setTaskProgress((current) => Math.min(100, current + 15));
  }, []);

  const openMap = useCallback(() => {
    router.push(ROUTES.map);
  }, [router]);

  const updateOrganizationLocation = useCallback(() => {
    Alert.alert(
      "تحديث موقع الجمعية",
      "سيتم اعتماد الموقع الجديد بعد تأكيده من الخريطة.",
    );
  }, []);

  const openOrganizationProfile = useCallback(() => {
    router.push(organizationDetailsRoute("resq-syria"));
  }, [router]);

  return {
    router,
    emergencyCases: EMERGENCY_RESCUE_CASES,
    acceptedCaseIds,
    activeTask,
    openNotifications,
    openReports,
    openCaseDetails,
    acceptCase,
    updateTaskProgress,
    openMap,
    updateOrganizationLocation,
    openOrganizationProfile,
  };
}
