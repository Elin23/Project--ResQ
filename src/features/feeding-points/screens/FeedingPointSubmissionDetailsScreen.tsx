import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Linking, StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SectionHeader from "@/src/components/ui/SectionHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { feedingPointsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useFeedingPointSubmissionDetails } from "../hooks/useFeedingPointSubmissionDetails";
import { MODERATION_STATUS_META } from "../utils/moderation";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function FeedingPointSubmissionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, accountKind } = useSession();
  const { submission, loading, error, reload } = useFeedingPointSubmissionDetails(id, account?.id);

  if (loading) return <Screen><LoadingState label="جاري تحميل الطلب..." /></Screen>;
  if (error || !submission) {
    return (
      <Screen>
        <ErrorState description={error ?? "الطلب غير موجود أو لا تملك صلاحية الوصول إليه."} onRetry={() => void reload()} />
      </Screen>
    );
  }

  const meta = MODERATION_STATUS_META[submission.moderationStatus];
  const openInMaps = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${submission.latitude},${submission.longitude}`);

  return (
    <Screen scroll padded={false} safeAreaEdges={["top", "right", "bottom", "left"]}>
      <ScreenHeader title="حالة طلب نقطة الإطعام" onBack={() => router.back()} />
      <View style={styles.content}>
        <Image source={{ uri: submission.photoUri }} style={styles.hero} />

        <View style={styles.titleBlock}>
          <AppText variant="h2" weight="bold">{submission.name}</AppText>
          <StatusBadge label={meta.label} color={meta.color} icon={meta.icon} />
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={17} color={COLORS.textSecondary} />
            <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.flex}>{submission.address}</AppText>
          </View>
        </View>

        {submission.moderationStatus === "pending_review" ? (
          <Card disabled style={styles.pendingCard}>
            <Ionicons name="time-outline" size={22} color={COLORS.warning} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">الطلب قيد المراجعة</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>لن تظهر النقطة للعامة قبل اعتمادها من الإدارة.</AppText>
            </View>
          </Card>
        ) : null}

        {submission.moderationStatus === "rejected" ? (
          <Card disabled style={styles.rejectedCard}>
            <Ionicons name="close-circle-outline" size={22} color={COLORS.danger} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold" color={COLORS.danger}>سبب الرفض</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>{submission.rejectionReason ?? "لم يتم تسجيل سبب."}</AppText>
            </View>
          </Card>
        ) : null}

        {submission.moderationStatus === "approved" ? (
          <Card disabled style={styles.approvedCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.success} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold" color={COLORS.success}>تمت الموافقة</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>تم اعتماد الطلب وسيتم ربطه بالنقطة المنشورة عند اكتمال عملية النشر الإداري.</AppText>
            </View>
          </Card>
        ) : null}

        <SectionHeader title="تفاصيل النقطة" />
        {submission.description ? <AppText variant="body" color={COLORS.textSecondary}>{submission.description}</AppText> : null}
        <View style={styles.chipsRow}>
          {submission.facilities.includes("water") ? <Chip label="مياه" icon="water-outline" soft /> : null}
          {submission.facilities.includes("shade") ? <Chip label="ظل" icon="partly-sunny-outline" soft /> : null}
          <Chip
            label={submission.initialStatus === "stocked" ? "متوفر طعام" : "تحتاج طعام"}
            icon={submission.initialStatus === "stocked" ? "checkmark-circle-outline" : "alert-circle-outline"}
            color={submission.initialStatus === "stocked" ? COLORS.success : COLORS.warning}
            soft
          />
        </View>

        <Card disabled style={styles.infoCard}>
          <View style={styles.infoRow}><AppText variant="caption" color={COLORS.textMuted}>تاريخ الإرسال</AppText><AppText variant="label">{formatDate(submission.submittedAt)}</AppText></View>
          <View style={styles.infoRow}><AppText variant="caption" color={COLORS.textMuted}>تاريخ المراجعة</AppText><AppText variant="label">{formatDate(submission.reviewedAt)}</AppText></View>
          <View style={styles.infoRow}><AppText variant="caption" color={COLORS.textMuted}>الإحداثيات</AppText><AppText variant="label">{submission.latitude.toFixed(5)}، {submission.longitude.toFixed(5)}</AppText></View>
        </Card>

        {submission.note ? (
          <Card disabled>
            <AppText variant="label" weight="bold">ملاحظتك للإدارة</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.note}>{submission.note}</AppText>
          </Card>
        ) : null}

        <ActionStack>
          <Button title="فتح الموقع في الخرائط" icon="navigate-outline" variant="outline" onPress={() => void openInMaps()} />
          <Button title="العودة إلى نقاط الإطعام" variant="ghost" onPress={() => router.replace(feedingPointsRoute(accountKind))} />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.md },
  hero: { width: "100%", height: 220, borderRadius: RADIUS.lg, backgroundColor: COLORS.surfaceSubtle },
  titleBlock: { alignItems: "stretch", gap: SPACING.sm },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  flex: { flex: 1, minWidth: 0 },
  pendingCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.warningSoft },
  rejectedCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.dangerSoft },
  approvedCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.successSoft },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  infoCard: { gap: SPACING.md },
  infoRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.md },
  note: { marginTop: SPACING.sm },
});
