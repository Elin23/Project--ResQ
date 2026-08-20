import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Share, StyleSheet, View } from "react-native";
import { useCallback } from "react";

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
import {
  donationCampaignDetailsRoute,
  donationDetailsRoute,
  donationsRoute,
} from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationTransfer } from "@/src/domain";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";

const STATUS = {
  submitted: { label: "تم الإرسال", color: COLORS.info },
  verifying: { label: "قيد التحقق", color: COLORS.warning },
  approved: { label: "تم الاعتماد", color: COLORS.success },
  rejected: { label: "مرفوض", color: COLORS.danger },
} as const;

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

export default function DonationTransferSubmittedScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { account, accountKind } = useSession();
  const loader = useCallback(async () => {
    if (!code) return undefined;
    return repositories.donationTransfers.getByVerificationCode(code);
  }, [code]);
  const state = useAsyncResource<DonationTransfer | undefined>(
    loader,
    undefined,
    "تعذر تحميل طلب التحقق.",
  );

  if (state.loading) return <Screen><LoadingState label="جاري تحميل طلب التحقق..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.data) return <Screen><EmptyState title="طلب التحقق غير موجود" description="تأكد من رقم الطلب وحاول مرة أخرى." /></Screen>;

  const transfer = state.data;
  const meta = STATUS[transfer.status];
  const canOpenPrivateDetails = Boolean(account?.id && transfer.donorAccountId === account.id);

  return (
    <Screen scroll padded={false}>
      <ScreenHeader
        title="تم الإرسال بنجاح"
        onBack={() => router.replace(donationsRoute(accountKind))}
      />
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={54} color={COLORS.success} />
        </View>

        <AppText variant="h1" weight="bold" align="center">
          تم استلام بيانات الحوالة
        </AppText>
        <AppText color={COLORS.textSecondary} align="center">
          تم إنشاء طلب تحقق للحوالة. سيقوم فريق المراجعة بمطابقة البيانات قبل اعتماد التبرع في الحملة.
        </AppText>

        <Card disabled style={styles.codeCard}>
          <AppText variant="caption" color={COLORS.textSecondary}>رقم طلب التحقق</AppText>
          <AppText variant="h2" weight="bold" color={COLORS.primaryStrong} selectable>
            {transfer.verificationCode}
          </AppText>
          <StatusBadge label={meta.label} color={meta.color} />
        </Card>

        <Card disabled style={styles.summaryCard}>
          <AppText variant="h3" weight="bold">ملخص الحوالة</AppText>
          <InfoRow label="الحملة" value={transfer.campaignTitle} />
          <InfoRow label="المبلغ" value={money(transfer.amount)} />
          <InfoRow label="شركة التحويل" value={transfer.transferProviderName} />
          <InfoRow label="رقم الحوالة" value={transfer.transferNumber} />
          <InfoRow label="اسم المرسل" value={transfer.senderFullName} />
        </Card>

        <Card disabled style={styles.timelineCard}>
          <AppText variant="h3" weight="bold">مراحل التحقق</AppText>
          <TimelineItem
            icon="send-outline"
            title="تم استلام بيانات الحوالة"
            description="تم حفظ الطلب بنجاح وهو بانتظار بدء المراجعة."
            active
            done
          />
          <TimelineItem
            icon="search-outline"
            title="التحقق من الحوالة"
            description="سيتم مطابقة رقم الحوالة والمرسل والمبلغ."
            active={transfer.status === "verifying" || transfer.status === "approved" || transfer.status === "rejected"}
            done={transfer.status === "approved" || transfer.status === "rejected"}
          />
          <TimelineItem
            icon={transfer.status === "rejected" ? "close-circle-outline" : "checkmark-circle-outline"}
            title={transfer.status === "rejected" ? "نتيجة المراجعة" : "اعتماد التبرع"}
            description={
              transfer.status === "rejected"
                ? transfer.rejectionReason ?? "لم يتم اعتماد الحوالة."
                : "بعد الاعتماد يضاف المبلغ إلى إجمالي الحملة."
            }
            active={transfer.status === "approved" || transfer.status === "rejected"}
            done={transfer.status === "approved" || transfer.status === "rejected"}
            danger={transfer.status === "rejected"}
          />
        </Card>

        <Card disabled backgroundColor={COLORS.infoSoft} style={styles.noticeCard}>
          <Ionicons name="time-outline" size={22} color={COLORS.info} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">قد تستغرق المراجعة بعض الوقت</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              لا ترسل نفس الحوالة مرة أخرى. يمكنك متابعة حالتها باستخدام رقم طلب التحقق.
            </AppText>
          </View>
        </Card>

        <Card disabled backgroundColor={COLORS.successSoft} style={styles.noticeCard}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.success} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">تحديثات حالة الحوالة</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              {transfer.notifyOnStatusChange
                ? "سيتم إشعارك عند تغيير حالة التحقق."
                : "يمكنك العودة إلى تفاصيل التبرع لمتابعة الحالة."}
            </AppText>
          </View>
        </Card>

        <Button
          title="عرض الحملة المدعومة"
          icon="heart-outline"
          variant="outline"
          onPress={() => router.push(donationCampaignDetailsRoute(transfer.campaignId, accountKind))}
        />
        {canOpenPrivateDetails ? (
          <Button
            title="متابعة حالة التبرع"
            icon="document-text-outline"
            onPress={() => router.replace(donationDetailsRoute(transfer.id, accountKind))}
          />
        ) : null}
        <Button
          title="مشاركة الحملة"
          icon="share-social-outline"
          variant="ghost"
          onPress={() =>
            void Share.share({
              title: transfer.campaignTitle,
              message: `ساهمت في دعم حملة ${transfer.campaignTitle} عبر ResQ.`,
            })
          }
        />
      </View>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
      <AppText weight="medium" >{value}</AppText>
    </View>
  );
}

function TimelineItem({
  icon,
  title,
  description,
  active,
  done,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  active: boolean;
  done: boolean;
  danger?: boolean;
}) {
  const color = danger ? COLORS.danger : done ? COLORS.success : active ? COLORS.info : COLORS.textMuted;
  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label" weight="bold" color={active ? COLORS.text : COLORS.textMuted}>{title}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>{description}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md, alignItems: "stretch" },
  successIcon: { width: 100, height: 100, borderRadius: RADIUS.full, alignSelf: "center", backgroundColor: COLORS.successSoft, alignItems: "center", justifyContent: "center" },
  codeCard: { gap: SPACING.sm, alignItems: "center", backgroundColor: COLORS.surfaceMuted },
  summaryCard: { gap: SPACING.sm },
  timelineCard: { gap: SPACING.md },
  infoRow: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", alignItems: "flex-start", gap: SPACING.md },
  timelineItem: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  timelineIcon: { width: 40, height: 40, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  noticeCard: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  flex: { flex: 1 },
});
