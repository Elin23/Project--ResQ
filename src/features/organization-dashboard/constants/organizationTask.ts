import type { OrganizationTaskTimelineItem } from "../types/organizationTask";

export const ORGANIZATION_TASK_TIMELINE: OrganizationTaskTimelineItem[] = [
  { id: "accepted", label: "المهمة تم قبولها" },
  { id: "on-route", label: "في الطريق" },
  { id: "arrived", label: "تم الوصول" },
  { id: "rescued", label: "تم إنقاذ الحيوان" },
];

export const COMPLETED_TASK_TIMELINE = [
  { id: "accepted", label: "قبول المهمة", time: undefined },
  { id: "arrived", label: "الوصول للموقع", time: undefined },
  { id: "started", label: "بدء عملية الإنقاذ", time: undefined },
  { id: "transported", label: "النقل للمركز", time: undefined },
  { id: "completed", label: "اكتمال المهمة", time: undefined },
] as const;
