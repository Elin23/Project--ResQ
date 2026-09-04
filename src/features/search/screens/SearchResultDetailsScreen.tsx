import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Share, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { SEARCH_RESULTS } from "../constants/search";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";

export default function SearchResultDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { can } = useSession();
  const result = SEARCH_RESULTS.find((item) => item.id === id);

  if (result?.type === "animal" && result.category === "adoption" && !can("view-adoption")) {
    return <Redirect href={ROUTES.search} />;
  }

  if (!result) {
    return (
      <Screen scroll={false} padded={false}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title="تفاصيل النتيجة" onBack={() => router.back()} />
        <View style={styles.emptyWrap}>
          <EmptyState
            title="النتيجة غير موجودة"
            description="قد تكون هذه النتيجة قديمة أو لم تعد متاحة."
            actionTitle="العودة إلى البحث"
            onActionPress={() => router.replace("/search")}
          />
        </View>
      </Screen>
    );
  }

  const isClinic = result.type === "clinic";
  const description = isClinic
    ? "عيادة بيطرية تقدم خدمات الرعاية الأساسية والمتابعة للحيوانات ضمن نطاق الخدمة المتاح."
    : result.category === "adoption"
      ? "حيوان متاح للتبني لدى جهة أو أسرة تبحث له عن منزل آمن ومسؤول."
      : "بلاغ عن حيوان مفقود. ساعد في مشاركة التفاصيل للوصول إلى صاحبه بأسرع وقت.";

  const handleShare = async () => {
    await Share.share({
      message: `${result.title}\n${result.subtitle}\nالمسافة: ${result.distance}`,
    });
  };

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title={isClinic ? "تفاصيل العيادة" : "تفاصيل الحيوان"}
        onBack={() => router.back()}
      />

      {result.type === "animal" ? (
        <Image source={result.image} resizeMode="cover" style={styles.heroImage} />
      ) : (
        <View style={styles.clinicHero}>
          <Ionicons name="medkit" size={54} color={COLORS.onColor} />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <AppText weight="bold" size={FONT_SIZES.headline}>
              {result.title}
            </AppText>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} />
              <AppText color={COLORS.textSecondary}>{result.subtitle}</AppText>
            </View>
          </View>
          <AppText weight="bold" color={COLORS.brown}>{result.distance}</AppText>
        </View>

        <Card shadow={false} borderWidth={1}>
          <AppText weight="bold" size={FONT_SIZES.title} style={styles.sectionTitle}>
            معلومات
          </AppText>
          <AppText color={COLORS.textSecondary} style={styles.description}>
            {description}
          </AppText>
          {isClinic ? (
            <View style={styles.infoRow}>
              <Ionicons name="medical-outline" size={20} color={COLORS.accent} />
              <AppText style={styles.infoText}>الخدمات: {result.services}</AppText>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name="paw-outline" size={20} color={COLORS.primary} />
              <AppText style={styles.infoText}>
                الحالة: {result.category === "adoption" ? "متاح للتبني" : "مفقود"}
              </AppText>
            </View>
          )}
        </Card>

        <ActionStack>
          <Button
            title={isClinic ? "عرض الموقع على الخريطة" : result.category === "adoption" ? "طلب التبني" : "لدي معلومات"}
            icon={isClinic ? "map-outline" : result.category === "adoption" ? "heart-outline" : "chatbubble-ellipses-outline"}
            onPress={() => router.push(isClinic ? "/map" : "/contact-us")}
          />
          <Button
            title="مشاركة"
            variant="outline"
            icon="share-social-outline"
            onPress={handleShare}
          />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 0 },
  emptyWrap: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
  heroImage: { width: "100%", height: 280, backgroundColor: COLORS.lightgray },
  clinicHero: { width: "100%", height: 220, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.accent },
  body: { padding: SPACING.lg },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "stretch", justifyContent: "space-between", gap: SPACING.md, marginBottom: SPACING.lg },
  titleContent: { flex: 1, alignItems: "stretch" },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, marginTop: SPACING.xs },
  sectionTitle: { marginBottom: SPACING.sm },
  description: { lineHeight: 25, textAlign: "auto" },
  infoRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, marginTop: SPACING.md, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.lightgray },
  infoText: { flex: 1 },
});
