import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, SPACING } from "@/src/theme";

/**
 * The current backend does not expose a reviewed owner-change request endpoint.
 * Keep the deep-link safe and explicit instead of submitting to local/in-memory state
 * or showing a false success message. The entry point is intentionally not linked
 * from the production edit screen until the backend workflow exists.
 */
export default function MapPlaceChangeRequestScreen() {
  const router = useRouter();
  return (
    <Screen scroll padded={false} surface="app">
      <ScreenHeader title="تغيير بيانات معتمدة" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card backgroundColor={COLORS.surfaceSubtle} borderColor={COLORS.divider}>
          <AppText variant="h3" weight="bold">هذه العملية غير متاحة من التطبيق حاليًا</AppText>
          <AppText color={COLORS.textSecondary} style={styles.copy}>
            نوع الجهة وموقعها من البيانات التي تحتاج مراجعة إدارية. لن يعرض التطبيق نجاحًا وهميًا أو يحفظ الطلب محليًا. استخدم قناة الإدارة المعتمدة إلى أن يتوفر مسار مراجعة فعلي في الخادم.
          </AppText>
        </Card>
        <Button title="رجوع" variant="outline" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.xl },
  copy: { marginTop: SPACING.sm, lineHeight: 24 },
});
