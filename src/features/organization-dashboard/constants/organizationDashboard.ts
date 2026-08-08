import { COLORS } from "@/src/theme";
import type {
  EmergencyRescueCase,
  OrganizationAchievement,
  OrganizationDashboardMetric,
  OrganizationRescueTask,
} from "../types/organizationDashboard";

export const ORGANIZATION_DASHBOARD_METRICS: OrganizationDashboardMetric[] = [
  { id: "active", label: "حالات نشطة", value: "3", dotColor: COLORS.primary },
  { id: "completed", label: "حالات مكتملة", value: "28" },
];

export const EMERGENCY_RESCUE_CASES: EmergencyRescueCase[] = [
  {
    id: "1",
    title: "كلب مصاب - جروح",
    location: "دمشق",
    distance: "1.2 كم",
    reportedAgo: "منذ 15 دقيقة",
    image: require("@/assets/images/dogg.png"),
    urgent: true,
  },
  {
    id: "2",
    title: "قطة عالقة بحاجة لإنقاذ",
    location: "دمشق",
    distance: "3.5 كم",
    reportedAgo: "منذ 32 دقيقة",
    image: require("@/assets/images/organizations/cat-lolo.png"),
  },
];

export const CURRENT_RESCUE_TASK: OrganizationRescueTask = {
  id: "2",
  code: "#RS-882",
  title: "إنقاذ قطة",
  location: "الطريق الطبية",
  distance: "3.5 كم",
  progress: 60,
  image: require("@/assets/images/organizations/cat-lolo.png"),
};

export const ORGANIZATION_ACHIEVEMENTS: OrganizationAchievement[] = [
  { id: "first", label: "أول عملية إنقاذ", value: "1", icon: "medal", tone: "green" },
  { id: "ten", label: "10 عمليات", value: "10", icon: "star", tone: "orange" },
  { id: "hundred", label: "100 حالة", value: "100", icon: "ribbon", tone: "blue" },
  { id: "next", label: "الإنجاز القادم", value: "250", icon: "lock-closed", tone: "locked" },
];
