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
  targetId?: string;
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

export const NOTIFICATION_SECTIONS: NotificationSection[] = [
  {
    title: "اليوم",
    data: [
      { id: "1", title: "تم قبول بلاغك من قبل أحد المتطوعين.", time: "منذ 5 دقائق", unread: true, category: "reports", icon: "notifications-outline", targetId: "1" },
      { id: "2", title: "تم تحديث حالة البلاغ إلى: قيد الإنقاذ", time: "منذ 18 دقيقة", unread: true, category: "reports", icon: "paw-outline", targetId: "2" },
      { id: "3", title: "تم نقل الحيوان إلى العيادة البيطرية.", time: "منذ ساعة", unread: false, category: "reports", icon: "medkit-outline", targetId: "1" },
    ],
  },
  {
    title: "أمس",
    data: [
      { id: "4", title: "تمت الموافقة على طلب التبني الخاص بك.", time: "أمس، 04:30 م", unread: false, category: "adoption", icon: "heart-outline" },
      { id: "5", title: "تم إرسال بلاغ جديد بالقرب منك.", time: "أمس، 11:15 ص", unread: false, category: "reports", icon: "megaphone-outline", targetId: "3" },
      { id: "6", title: "هناك فرصة تطوع جديدة في جمعية قريبة.", time: "أمس، 09:20 ص", unread: false, category: "volunteering", icon: "people-outline" },
    ],
  },
];
