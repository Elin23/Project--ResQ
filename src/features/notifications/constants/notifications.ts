import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type NotificationCategory = import("@/src/domain").AppNotificationCategory;

export type NotificationItem = {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  category: NotificationCategory;
  icon: ComponentProps<typeof Ionicons>["name"];
  target?: import("@/src/domain").AppNotificationTarget;
};

export type NotificationSection = {
  title: string;
  data: NotificationItem[];
};

export const NOTIFICATION_FILTERS = [
  { id: "all", label: "الكل" },
  { id: "reports", label: "البلاغات" },
  { id: "adoption", label: "التبني" },
  { id: "donations", label: "التبرعات" },
  { id: "feeding-points", label: "الإطعام" },
  { id: "system", label: "النظام" },
] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number]["id"];

