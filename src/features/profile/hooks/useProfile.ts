import { Href, useRouter } from "expo-router";
import { Alert } from "react-native";
import { ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";
import { DEFAULT_PROFILE } from "../constants/profile";

export function useProfile() {
  const router = useRouter();
  const { signOut } = useSession();
  const handleItemPress = (route?: Href, label?: string) => {
    if (route) return router.push(route);
    Alert.alert(label ?? "الخيار", "هذه الصفحة غير مكتملة بعد، وتم إدراجها في تقرير النواقص.");
  };
  const logout = () => Alert.alert("تسجيل الخروج", "هل أنت متأكد؟", [
    { text: "إلغاء", style: "cancel" },
    { text: "تسجيل الخروج", style: "destructive", onPress: async () => { await signOut(); router.replace(ROUTES.welcome); } },
  ]);
  return { profile: DEFAULT_PROFILE, handleItemPress, edit: () => router.push(ROUTES.editProfile), logout };
}
