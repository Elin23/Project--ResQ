import { useRouter } from "expo-router";
import { Alert } from "react-native";
import type { HomeQuickAction } from "../constants/home";

export function useHomeScreen() {
  const router = useRouter();
  const showTemporaryMessage = (title: string) => Alert.alert(title, "سيتم ربط هذه الميزة بالصفحة الخاصة بها عند إنشائها.");

  const quickActions: HomeQuickAction[] = [
    { key: "create-report", label: "إرسال بلاغ", icon: "megaphone", color: "#7A2E12", iconBackgroundColor: "#FFD9CA", onPress: () => router.push("/reports") },
    { key: "my-reports", label: "بلاغاتي", icon: "clipboard", color: "#12672C", iconBackgroundColor: "#9BF3A4", onPress: () => router.push("/reports") },
    { key: "adoption", label: "التبني", icon: "heart", color: "#062536", iconBackgroundColor: "#BCE8FF", onPress: () => router.push("/adoption") },
    { key: "clinics", label: "العيادات", icon: "medkit", color: "#1E293B", iconBackgroundColor: "#D4D6D8", onPress: () => router.push("/map") },
    { key: "feeding", label: "نقاط الإطعام", icon: "restaurant", color: "#25323A", iconBackgroundColor: "#D6E2E8", onPress: () => router.push("/map") },
    { key: "donations", label: "التبرعات", icon: "hand-left", color: "#694A3A", iconBackgroundColor: "#D8C2B4", onPress: () => showTemporaryMessage("التبرعات") },
  ];

  return { router, quickActions, showTemporaryMessage };
}
