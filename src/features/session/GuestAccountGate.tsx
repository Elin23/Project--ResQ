import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import { ROUTES } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

export default function GuestAccountGate() {
  const router = useRouter();
  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.icon}><Ionicons name="person-outline" size={42} color={COLORS.primary} /></View>
      <AppText weight="bold" size={FONT_SIZES.headline}>هذه الصفحة للحسابات المسجلة</AppText>
      <AppText color={COLORS.textSecondary} style={styles.description}>
        يمكنك كزائر تصفح التطبيق وإنشاء بلاغ. سجّل الدخول لعرض حسابك وبلاغاتك وطلباتك.
      </AppText>
      <Button title="تسجيل الدخول" onPress={() => router.push(ROUTES.login)} />
      <Button title="إنشاء حساب" variant="outline" onPress={() => router.push(ROUTES.chooseAccount)} />
      <Button title="العودة للرئيسية" variant="text" onPress={() => router.replace(ROUTES.home)} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center", gap: SPACING.lg, paddingHorizontal: SPACING.xl },
  icon: { width: 88, height: 88, borderRadius: RADIUS.full, backgroundColor: COLORS.peach, alignItems: "center", justifyContent: "center" },
  description: { textAlign: "center", lineHeight: 25 },
});
