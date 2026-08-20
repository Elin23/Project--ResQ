import { Href, useRouter } from "expo-router";
import { ROUTES } from "@/src/navigation/routes";
import { DEFAULT_PROFILE } from "../constants/profile";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";

export function useProfile() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const handleItemPress = (route?: Href, label?: string) => {
    if (route) return router.push(route);
    showFeedback({ title: label ?? "الخيار", message: "هذه الصفحة غير مكتملة بعد، وتم إدراجها ضمن الأعمال المتبقية.", tone: "info" });
  };

  return { profile: DEFAULT_PROFILE, handleItemPress, edit: () => router.push(ROUTES.editProfile) };
}
