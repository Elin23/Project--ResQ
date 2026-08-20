import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import WorkspaceMetricGrid from "@/src/components/ui/WorkspaceMetricGrid";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { useSession } from "@/src/features/session/SessionContext";
import {
  donationCampaignDetailsRoute,
  editCampaignRoute,
  myCampaignsRoute,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useManageDonationCampaign } from "../hooks/useManageDonationCampaign";
import { useOwnedCampaignTransfers } from "../hooks/useOwnedCampaignTransfers";
import { useOwnedDonationCampaign } from "../hooks/useOwnedDonationCampaign";

const STATUS = {
  draft: { label: "مسودة", color: COLORS.textSecondary, title: "الحملة محفوظة كمسودة" },
  pending_review: { label: "قيد المراجعة", color: COLORS.warning, title: "الحملة بانتظار المراجعة" },
  active: { label: "نشطة", color: COLORS.success, title: "الحملة منشورة وتستقبل التبرعات" },
  paused: { label: "موقوفة مؤقتًا", color: COLORS.warning, title: "الحملة متوقفة مؤقتًا" },
  completed: { label: "اكتمل الهدف", color: COLORS.success, title: "وصلت الحملة إلى هدفها" },
  closed: { label: "مغلقة", color: COLORS.textMuted, title: "تم إغلاق الحملة" },
  rejected: { label: "مرفوضة", color: COLORS.danger, title: "تحتاج الحملة إلى تعديل" },
} as const;

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function progress(raised: number, target: number) {
  return Math.min(1, target > 0 ? raised / target : 0);
}

export default function OwnedDonationCampaignStatusScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, accountKind } = useSession();
  const state = useOwnedDonationCampaign(id, account?.id);
  const transferState = useOwnedCampaignTransfers(id, account?.id);
  const actions = useManageDonationCampaign();
  const { showFeedback } = useFeedback();
  const decision = useDecisionDialog();

  const reload = async () => {
    await Promise.all([state.reload(), transferState.reload()]);
  };

  if (state.loading || transferState.loading) {
    return <Screen><LoadingState label="جاري تحميل إدارة الحملة..." /></Screen>;
  }
  if (state.error || transferState.error) {
    return (
      <Screen>
        <ErrorState
          description={state.error ?? transferState.error ?? "تعذر تحميل الحملة."}
          onRetry={() => void reload()}
        />
      </Screen>
    );
  }
  if (!state.campaign) {
    return <Screen><EmptyState title="الحملة غير موجودة" description="قد لا تملك صلاحية الوصول إلى هذه الحملة." /></Screen>;
  }

  const campaign = state.campaign;
  const meta = STATUS[campaign.status];
  const ratio = progress(campaign.raisedAmount, campaign.targetAmount);
  const pendingTransfers = transferState.transfers.filter((item) => item.status === "submitted").length;
  const verifyingTransfers = transferState.transfers.filter((item) => item.status === "verifying").length;
  const approvedTransfers = transferState.transfers.filter((item) => item.status === "approved").length;
  const rejectedTransfers = transferState.transfers.filter((item) => item.status === "rejected").length;
  const editable = ["draft", "rejected", "active", "paused"].includes(campaign.status);

  const pause = () => decision.request(
    { title: "إيقاف الحملة مؤقتًا", message: "ستتوقف الحملة عن استقبال تبرعات جديدة حتى تعيد فتحها.", confirmLabel: "إيقاف مؤقت", destructive: false, icon: "pause-circle-outline" },
    async () => {
      if (!account) return;
      try { await actions.pause(campaign.id, account.id); await reload(); }
      catch (error) { showFeedback({ title: "تعذر إيقاف الحملة", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" }); throw error; }
    },
  );

  const resume = () => decision.request(
    { title: "إعادة فتح الحملة", message: "ستعود الحملة للظهور للعامة واستقبال تبرعات جديدة.", confirmLabel: "إعادة الفتح", destructive: false, icon: "play-circle-outline" },
    async () => {
      if (!account) return;
      try { await actions.resume(campaign.id, account.id); await reload(); }
      catch (error) { showFeedback({ title: "تعذر إعادة فتح الحملة", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" }); throw error; }
    },
  );

  const close = () => decision.request(
    { title: "إغلاق الحملة", message: "الإغلاق نهائي من تطبيق الموبايل ولن تستقبل الحملة تبرعات جديدة بعده.", confirmLabel: "إغلاق الحملة", destructive: true, icon: "lock-closed-outline" },
    async () => {
      if (!account) return;
      try { await actions.close(campaign.id, account.id); await reload(); }
      catch (error) { showFeedback({ title: "تعذر إغلاق الحملة", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" }); throw error; }
    },
  );

  const submitDraft = async () => {
    if (!account) return;
    try {
      await actions.submitForReview(campaign.id, account.id);
      await reload();
    } catch (error) {
      showFeedback({ title: "تعذر إرسال الحملة", message: error instanceof Error ? error.message : "أكمل بيانات الحملة ثم حاول مرة أخرى.", tone: "error" });
    }
  };

  return (
    <Screen scroll padded={false}>
      <ScreenHeader
        title="إدارة الحملة"
        subtitle={campaign.title}
        onBack={() => router.replace(myCampaignsRoute(accountKind))}
      />
      <View style={styles.content}>
        <View style={[styles.statusIcon, { backgroundColor: `${meta.color}18` }]}>
          <Ionicons
            name={
              campaign.status === "pending_review"
                ? "hourglass-outline"
                : campaign.status === "active"
                  ? "checkmark-circle-outline"
                  : campaign.status === "rejected"
                    ? "alert-circle-outline"
                    : campaign.status === "paused"
                      ? "pause-circle-outline"
                      : "document-text-outline"
            }
            size={38}
            color={meta.color}
          />
        </View>
        <AppText variant="h1" weight="bold" align="center">{meta.title}</AppText>
        <View style={styles.center}><StatusBadge label={meta.label} color={meta.color} /></View>

        <Card disabled style={styles.progressCard}>
          <View style={styles.amountRow}>
            <View>
              <AppText variant="caption" color={COLORS.textSecondary}>المبلغ المحقق</AppText>
              <AppText variant="h2" weight="bold" color={COLORS.primaryStrong}>{money(campaign.raisedAmount)}</AppText>
            </View>
            <View style={styles.targetBlock}>
              <AppText variant="caption" color={COLORS.textSecondary}>الهدف</AppText>
              <AppText variant="label" weight="bold">{money(campaign.targetAmount)}</AppText>
            </View>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${ratio * 100}%` }]} /></View>
          <View style={styles.progressFooter}>
            <AppText variant="caption" color={COLORS.textSecondary}>{Math.round(ratio * 100)}% من الهدف</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>{campaign.donorCount} متبرع</AppText>
          </View>
        </Card>

        <WorkspaceMetricGrid
          metrics={[
            { key: "submitted", label: "بانتظار المراجعة", value: pendingTransfers, icon: "time-outline", color: COLORS.warning },
            { key: "verifying", label: "قيد التحقق", value: verifyingTransfers, icon: "search-outline", color: COLORS.info },
            { key: "approved", label: "معتمدة", value: approvedTransfers, icon: "checkmark-circle-outline", color: COLORS.success },
            { key: "rejected", label: "مرفوضة", value: rejectedTransfers, icon: "close-circle-outline", color: COLORS.danger },
          ]}
        />

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">بيانات الحملة</AppText>
          <InfoRow label="نوع الحملة" value={campaign.category} />
          <InfoRow label="الموقع" value={[campaign.location.governorate, campaign.location.city].filter(Boolean).join(" - ")} />
          <InfoRow label="الحالة العاجلة" value={campaign.urgent ? "نعم" : "لا"} />
          <InfoRow label="تاريخ الإنشاء" value={new Intl.DateTimeFormat("ar-SY").format(new Date(campaign.createdAt))} />
        </Card>

        {campaign.status === "pending_review" ? (
          <Card disabled backgroundColor={COLORS.primarySoft} style={styles.noticeCard}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primaryStrong} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">بانتظار مراجعة الإدارة</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                لا يمكنك نشر الحملة أو اعتمادها بنفسك. بعد الموافقة ستنتقل تلقائيًا إلى الحالة النشطة.
              </AppText>
            </View>
          </Card>
        ) : null}

        {campaign.rejectionReason ? (
          <Card disabled backgroundColor={COLORS.dangerSoft} style={styles.noticeCard}>
            <Ionicons name="alert-circle-outline" size={22} color={COLORS.danger} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold" color={COLORS.danger}>سبب الرفض</AppText>
              <AppText variant="bodySmall">{campaign.rejectionReason}</AppText>
            </View>
          </Card>
        ) : null}

        <ActionStack>
          {campaign.status === "active" ? (
            <>
              <Button
                title="عرض الحملة العامة"
                icon="eye-outline"
                onPress={() => router.push(donationCampaignDetailsRoute(campaign.id, accountKind))}
              />
              <Button
                title="إيقاف مؤقت"
                icon="pause-outline"
                variant="outline"
                disabled={actions.updating}
                onPress={pause}
              />
            </>
          ) : null}

          {campaign.status === "paused" ? (
            <Button
              title="إعادة فتح الحملة"
              icon="play-outline"
              disabled={actions.updating}
              onPress={resume}
            />
          ) : null}

          {campaign.status === "draft" ? (
            <Button
              title="إرسال للمراجعة"
              icon="paper-plane-outline"
              loading={actions.updating}
              onPress={() => void submitDraft()}
            />
          ) : null}

          {editable ? (
            <Button
              title={campaign.status === "rejected" ? "تعديل وإعادة الإرسال" : "تعديل تفاصيل الحملة"}
              icon="create-outline"
              variant="outline"
              onPress={() => router.push(editCampaignRoute(campaign.id, accountKind))}
            />
          ) : null}

          {["active", "paused", "completed"].includes(campaign.status) ? (
            <Button
              title="إغلاق الحملة"
              icon="close-circle-outline"
              variant="outline"
              disabled={actions.updating}
              onPress={close}
            />
          ) : null}
        </ActionStack>
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
      <AppText weight="medium">{value || "—"}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md, alignItems: "stretch" },
  statusIcon: { width: 90, height: 90, borderRadius: RADIUS.full, alignSelf: "center", alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center" },
  progressCard: { gap: SPACING.sm },
  amountRow: { flexDirection: "row", direction: "rtl", alignItems: "stretch", justifyContent: "space-between", gap: SPACING.md },
  targetBlock: { alignItems: "stretch" },
  progressTrack: { height: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceMuted, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: RADIUS.full, backgroundColor: COLORS.success },
  progressFooter: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.md },
  card: { gap: SPACING.sm },
  infoRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.md },
  noticeCard: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  flex: { flex: 1 },
});
