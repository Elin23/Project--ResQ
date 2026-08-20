import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type NotificationCategory = "reports" | "volunteering" | "adoption";

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
  { id: "volunteering", label: "التطوع" },
  { id: "adoption", label: "التبني" },
] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number]["id"];

