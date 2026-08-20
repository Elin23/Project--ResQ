import { Ionicons } from "@expo/vector-icons";
import { Share, StyleSheet, View } from "react-native";
import { useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

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
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import {
  donationCampaignDetailsRoute,
} from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationCampaign, DonationTransfer } from "@/src/domain";

const STATUS = {
  submitted: {
    label: "قيد المراجعة",
    color: COLORS.warning,
    title: "تم استلام بيانات الحوالة",
    description: "الطلب بانتظار أن يبدأ فريق المراجعة التحقق من الحوالة.",
  },
  verifying: {
    label: "قيد التحقق",
    color: COLORS.info,
    title: "جاري التحقق من الحوالة",
    description: "يتم الآن مطابقة رقم الحوالة وبيانات المرسل والمبلغ.",
  },
  approved: {
    label: "تم اعتماد التبرع",
    color: COLORS.success,
    title: "شكرًا لمساهمتك",
    description: "تم اعتماد الحوالة وإضافة المبلغ إلى إجمالي الحملة.",
  },
  rejected: {
    label: "لم يتم الاعتماد",
    color: COLORS.danger,
    title: "تحتاج الحوالة إلى مراجعة",
    description: "لم يتم اعتماد هذه الحوالة. راجع ملاحظات فريق المراجعة أدناه.",
  },
} as const;

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function dateTime(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DonationTransferDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, accountKind } = useSession();

  const transferLoader = useCallback(async () => {
    if (!id || !account?.id) return undefined;
    return repositories.donationTransfers.getByDonor(id, account.id);
  }, [account?.id, id]);
  const transferState = useAsyncResource<DonationTransfer | undefined>(
    transferLoader,
    undefined,
    "تعذر تحميل تفاصيل التبرع.",
  );

  const campaignLoader = useCallback(async () => {
    if (!transferState.data?.campaignId) return undefined;
    return repositories.donationCampaigns.getPublicById(transferState.data.campaignId);
  }, [transferState.data?.campaignId]);
  const campaignState = useAsyncResource<DonationCampaign | undefined>(
    campaignLoader,
    undefined,
    "تعذر تحميل الحملة المدعومة.",
  );

  if (transferState.loading) return <Screen><LoadingState label="جاري تحميل تفاصيل التبرع..." /></Screen>;
  if (transferState.error) return <Screen><ErrorState description={transferState.error} onRetry={() => void transferState.reload()} /></Screen>;
  if (!transferState.data) return <Screen><EmptyState title="التبرع غير موجود" description="قد لا يكون هذا التبرع تابعًا لحسابك." /></Screen>;

  const transfer = transferState.data;
  const meta = STATUS[transfer.status];
  const campaign = campaignState.data;

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="تفاصيل التبرع" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card disabled style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: `${meta.color}18` }]}>
            <Ionicons
              name={
                transfer.status === "approved"
                  ? "checkmark-circle-outline"
                  : transfer.status === "rejected"
                    ? "close-circle-outline"
                    : transfer.status === "verifying"
                      ? "search-outline"
                      : "time-outline"
              }
              size={30}
              color={meta.color}
            />
          </View>
          <View style={styles.flex}>
            <StatusBadge label={meta.label} color={meta.color} />
            <AppText variant="h2" weight="bold">{meta.title}</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>{meta.description}</AppText>
          </View>
        </Card>

        <Card disabled style={styles.codeCard}>
          <AppText variant="caption" color={COLORS.textSecondary}>رقم طلب التحقق</AppText>
          <AppText variant="h2" weight="bold" color={COLORS.primaryStrong} selectable>
            {transfer.verificationCode}
          </AppText>
        </Card>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">تفاصيل التبرع</AppText>
          <InfoRow label="الحملة" value={transfer.campaignTitle} />
          <InfoRow label="المبلغ" value={money(transfer.amount)} strong />
          <InfoRow label="تاريخ الإرسال" value={dateTime(transfer.createdAt)} />
          <InfoRow label="شركة التحويل" value={transfer.transferProviderName} />
          <InfoRow label="اسم المرسل" value={transfer.senderFullName} />
          <InfoRow label="رقم الحوالة" value={transfer.transferNumber} />
          <InfoRow label="المحافظة" value={transfer.senderGovernorate} />
        </Card>

        <Card disabled style={styles.timelineCard}>
          <AppText variant="h3" weight="bold">مراحل التحقق</AppText>
          <TimelineStep
            title="استلام بيانات الحوالة"
            subtitle={dateTime(transfer.createdAt)}
            done
            active
          />
          <TimelineStep
            title="بدء التحقق"
            subtitle={transfer.verifyingAt ? dateTime(transfer.verifyingAt) : "بانتظار بدء المراجعة"}
            done={Boolean(transfer.verifyingAt || transfer.reviewedAt)}
            active={transfer.status === "verifying"}
          />
          <TimelineStep
            title={transfer.status === "rejected" ? "لم يتم اعتماد الحوالة" : "اعتماد التبرع"}
            subtitle={
              transfer.reviewedAt
                ? dateTime(transfer.reviewedAt)
                : "سيتم تحديث هذه المرحلة بعد انتهاء المراجعة"
            }
            done={Boolean(transfer.reviewedAt)}
            active={transfer.status === "approved" || transfer.status === "rejected"}
            danger={transfer.status === "rejected"}
          />
        </Card>

        {transfer.rejectionReason ? (
          <Card disabled backgroundColor={COLORS.dangerSoft} borderColor={`${COLORS.danger}55`} style={styles.noticeCard}>
            <Ionicons name="alert-circle-outline" size={22} color={COLORS.danger} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold" color={COLORS.danger}>ملاحظات فريق المراجعة</AppText>
              <AppText variant="bodySmall">{transfer.rejectionReason}</AppText>
            </View>
          </Card>
        ) : (
          <Card disabled backgroundColor={COLORS.infoSoft} style={styles.noticeCard}>
            <Ionicons name="information-circle-outline" size={22} color={COLORS.info} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">ملاحظات فريق المراجعة</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                لا توجد ملاحظات إضافية على الطلب حاليًا.
              </AppText>
            </View>
          </Card>
        )}

        {campaign ? (
          <Card
            onPress={() => router.push(donationCampaignDetailsRoute(campaign.id, accountKind))}
            style={styles.campaignCard}
          >
            <View style={styles.campaignIcon}>
              <Ionicons name="heart-outline" size={24} color={COLORS.primaryStrong} />
            </View>
            <View style={styles.flex}>
              <AppText variant="caption" color={COLORS.textSecondary}>الحملة التي دعمتها</AppText>
              <AppText variant="label" weight="bold">{campaign.title}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>{campaign.ownerDisplayName}</AppText>
            </View>
            <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
          </Card>
        ) : null}

        <Card disabled style={styles.helpCard}>
          <View style={styles.helpTitle}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.primaryStrong} />
            <AppText variant="h3" weight="bold">هل تحتاج مساعدة؟</AppText>
          </View>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>
            إذا لاحظت مشكلة في بيانات الحوالة أو تأخر تحديث الحالة، احتفظ برقم طلب التحقق وتواصل مع فريق الدعم.
          </AppText>
        </Card>

        <Button
          title="مشاركة الحملة"
          icon="share-social-outline"
          variant="outline"
          onPress={() =>
            void Share.share({
              title: transfer.campaignTitle,
              message: `ادعم حملة ${transfer.campaignTitle} عبر ResQ.`,
            })
          }
        />
      </View>
    </Screen>
  );
}

function InfoRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
      <AppText weight={strong ? "bold" : "medium"} color={strong ? COLORS.primaryStrong : COLORS.text}>
        {value}
      </AppText>
    </View>
  );
}

function TimelineStep({
  title,
  subtitle,
  done,
  active,
  danger = false,
}: {
  title: string;
  subtitle: string;
  done: boolean;
  active: boolean;
  danger?: boolean;
}) {
  const color = danger ? COLORS.danger : done ? COLORS.success : active ? COLORS.info : COLORS.textMuted;
  return (
    <View style={styles.timelineStep}>
      <View style={[styles.timelineDot, { borderColor: color, backgroundColor: done ? color : COLORS.background }]}>
        {done ? <Ionicons name={danger ? "close" : "checkmark"} size={14} color={COLORS.textInverse} /> : null}
      </View>
      <View style={styles.flex}>
        <AppText variant="label" weight="bold" color={active || done ? COLORS.text : COLORS.textMuted}>{title}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>{subtitle}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md },
  statusCard: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  statusIcon: { width: 58, height: 58, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  codeCard: { gap: SPACING.sm, alignItems: "center", backgroundColor: COLORS.surfaceMuted },
  card: { gap: SPACING.sm },
  infoRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.md },
  timelineCard: { gap: SPACING.md },
  timelineStep: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  timelineDot: { width: 28, height: 28, borderRadius: RADIUS.full, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  noticeCard: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  campaignCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  campaignIcon: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  helpCard: { gap: SPACING.sm },
  helpTitle: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  flex: { flex: 1 },
});
