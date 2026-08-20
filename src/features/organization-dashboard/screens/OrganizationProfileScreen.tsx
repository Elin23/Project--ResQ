import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { organizationDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export default function OrganizationProfileScreen() {
  const router = useRouter();
  const { account, signOut } = useSession();
  const { showFeedback } = useFeedback();

  const logout = async () => {
    await signOut();
    router.replace(ROUTES.login);
  };

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader title="حساب الجمعية" subtitle={account?.displayName ?? "الجمعية"} />
      <View style={styles.body}>

      <View style={styles.card}>
        <AppText weight="bold">إدارة مساحة العمل</AppText>
        <AppText color={COLORS.textMuted}>أدر بيانات الجمعية وإعدادات مساحة العمل والملف العام من مكان واحد.</AppText>
      </View>

      <ActionStack>
        <Button title="عرض الملف العام" onPress={() => router.push(organizationDetailsRoute("resq-syria"))} />
        <Button title="إعدادات الجمعية" variant="outline" onPress={() => showFeedback({ title: "إعدادات الجمعية", message: "ستتوفر إعدادات الفريق والبيانات التنظيمية من هذه المساحة.", tone: "info" })} />
        <Button title="تسجيل الخروج" variant="text" onPress={logout} />
      </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  card: { gap: SPACING.sm, padding: SPACING.lg, borderRadius: RADIUS.lg, backgroundColor: COLORS.white },
});
