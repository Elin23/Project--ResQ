import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { feedingPointSubmissionDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useFeedingPointSubmissions } from "../hooks/useFeedingPointSubmissions";
import { MODERATION_STATUS_META } from "../utils/moderation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function FeedingPointSubmissionsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const { submissions, loading, error, reload } = useFeedingPointSubmissions(account?.id);

  return (
    <Screen scroll padded={false} safeAreaEdges={["top", "right", "bottom", "left"]}>
      <ScreenHeader
        title="طلبات نقاط الإطعام"
        subtitle="تابع حالة المراجعة والنشر"
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <Button
          title="إضافة نقطة جديدة"
          icon="add-circle-outline"
          onPress={() => router.push(ROUTES.createFeedingPoint)}
        />

        {loading ? <LoadingState label="جاري تحميل طلباتك..." /> : null}
        {!loading && error ? <ErrorState description={error} onRetry={() => void reload()} /> : null}
        {!loading && !error && submissions.length === 0 ? (
          <EmptyState
            title="لا توجد طلبات بعد"
            description="عند إضافة نقطة إطعام ستظهر هنا لتتابع حالة مراجعتها."
            icon="restaurant-outline"
            actionTitle="إضافة نقطة إطعام"
            onActionPress={() => router.push(ROUTES.createFeedingPoint)}
          />
        ) : null}

        {!loading && !error ? submissions.map((item) => {
          const meta = MODERATION_STATUS_META[item.moderationStatus];
          return (
            <Card
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`فتح طلب ${item.name}`}
              onPress={() => router.push(feedingPointSubmissionDetailsRoute(item.id, accountKind))}
              style={styles.card}
            >
              <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
              <View style={styles.cardCopy}>
                <View style={styles.cardHeader}>
                  <AppText variant="h3" weight="bold" numberOfLines={2} style={styles.cardTitle}>{item.name}</AppText>
                  <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} size="sm" />
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
                  <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={2} style={styles.flex}>{item.address}</AppText>
                </View>
                <AppText variant="caption" color={COLORS.textMuted}>أُرسل في {item.submittedAt ? formatDate(item.submittedAt) : "غير مرسل بعد"}</AppText>
              </View>
            </Card>
          );
        }) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.md },
  card: { flexDirection: "row", direction: "rtl", gap: SPACING.md, alignItems: "center" },
  thumbnail: { width: 82, height: 82, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceSubtle },
  cardCopy: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  cardHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  cardTitle: { flex: 1 },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  flex: { flex: 1 },
});
