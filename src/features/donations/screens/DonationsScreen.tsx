import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

const OPTIONS = [
  { key: "food", icon: "restaurant-outline" as const, title: "طعام ومستلزمات", description: "دعم احتياجات الحيوانات اليومية في مراكز الرعاية." },
  { key: "medical", icon: "medkit-outline" as const, title: "علاج بيطري", description: "المساهمة في تكاليف العلاج والإسعافات الضرورية." },
  { key: "shelter", icon: "home-outline" as const, title: "دعم المأوى", description: "المساعدة في تجهيز أماكن آمنة ومناسبة للحيوانات." },
] as const;

export default function DonationsScreen() {
  const router = useRouter();
  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="التبرعات" subtitle="خيارات تجريبية لواجهة الدعم" onBack={() => router.back()} />
      <View style={styles.body}>
        <Card shadow={false} borderWidth={1} style={styles.notice} accessibilityRole="summary">
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
          <AppText color={COLORS.textSecondary} style={styles.noticeText}>هذه واجهة Frontend تجريبية. لا تتم معالجة أي مدفوعات حقيقية.</AppText>
        </Card>
        {OPTIONS.map((option) => (
          <Card key={option.key} shadow={false} borderWidth={1} accessibilityLabel={option.title}>
            <View style={styles.row}>
              <View style={styles.iconWrap}><Ionicons name={option.icon} size={26} color={COLORS.primary} /></View>
              <View style={styles.textWrap}>
                <AppText weight="bold" size={FONT_SIZES.title}>{option.title}</AppText>
                <AppText color={COLORS.textSecondary} style={styles.description}>{option.description}</AppText>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 0 },
  body: { padding: SPACING.lg },
  notice: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, backgroundColor: `${COLORS.primary}0D` },
  noticeText: { flex: 1, lineHeight: 22 },
  row: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  iconWrap: { width: 52, height: 52, borderRadius: RADIUS.full, backgroundColor: `${COLORS.primary}1A`, alignItems: "center", justifyContent: "center" },
  textWrap: { flex: 1, alignItems: "flex-start" },
  description: { marginTop: SPACING.xs, lineHeight: 22, textAlign: "left" },
});
