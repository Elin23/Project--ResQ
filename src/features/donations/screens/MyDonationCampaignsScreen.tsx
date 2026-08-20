import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

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
import { useSession } from "@/src/features/session/SessionContext";
import {
  createCampaignRoute,
  ownedCampaignStatusRoute,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationCampaign } from "@/src/domain";
import { useOwnedDonationCampaigns } from "../hooks/useOwnedDonationCampaigns";

const STATUS = {
  draft: { label: "مسودة", color: COLORS.textSecondary },
  pending_review: { label: "قيد المراجعة", color: COLORS.warning },
  active: { label: "نشطة", color: COLORS.success },
  paused: { label: "موقوفة مؤقتًا", color: COLORS.warning },
  completed: { label: "اكتمل الهدف", color: COLORS.success },
  closed: { label: "مغلقة", color: COLORS.textMuted },
  rejected: { label: "مرفوضة", color: COLORS.danger },
} as const;

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function progress(campaign: DonationCampaign) {
  return Math.min(1, campaign.targetAmount > 0 ? campaign.raisedAmount / campaign.targetAmount : 0);
}

export default function MyDonationCampaignsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const state = useOwnedDonationCampaigns(account?.id);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل حملاتك..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;

  const active = state.campaigns.filter((item) => item.status === "active").length;
  const pending = state.campaigns.filter((item) => item.status === "pending_review").length;
  const raised = state.campaigns.reduce((sum, item) => sum + item.raisedAmount, 0);

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="حملاتي" subtitle="إدارة حملات التبرع الخاصة بحسابك" onBack={() => router.back()} />
      <View style={styles.content}>
        <WorkspaceMetricGrid
          metrics={[
            { key: "all", label: "إجمالي الحملات", value: state.campaigns.length, icon: "megaphone-outline", color: COLORS.primaryStrong },
            { key: "active", label: "نشطة", value: active, icon: "checkmark-circle-outline", color: COLORS.success },
            { key: "pending", label: "قيد المراجعة", value: pending, icon: "time-outline", color: COLORS.warning },
            { key: "raised", label: "إجمالي المحقق", value: money(raised), icon: "cash-outline", color: COLORS.info },
          ]}
        />

        <Button
          title="فتح حملة تبرع جديدة"
          icon="add-circle-outline"
          onPress={() => router.push(createCampaignRoute(accountKind))}
        />

        {state.campaigns.length === 0 ? (
          <EmptyState
            icon="megaphone-outline"
            title="لا توجد حملات بعد"
            description="ابدأ بإنشاء حملة تبرع جديدة، ثم احفظها كمسودة أو أرسلها للمراجعة."
          />
        ) : (
          <View style={styles.list}>
            {state.campaigns.map((campaign) => {
              const meta = STATUS[campaign.status];
              const ratio = progress(campaign);
              return (
                <Card
                  key={campaign.id}
                  onPress={() => router.push(ownedCampaignStatusRoute(campaign.id, accountKind))}
                  style={styles.card}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.flex}>
                      <AppText variant="h3" weight="bold">{campaign.title}</AppText>
                      <AppText variant="caption" color={COLORS.textSecondary}>{campaign.shortDescription || "مسودة غير مكتملة"}</AppText>
                    </View>
                    <StatusBadge label={meta.label} color={meta.color} />
                  </View>

                  <View style={styles.amountRow}>
                    <AppText variant="label" weight="bold" color={COLORS.primaryStrong}>{money(campaign.raisedAmount)}</AppText>
                    <AppText variant="caption" color={COLORS.textMuted}>من {money(campaign.targetAmount)}</AppText>
                  </View>

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
                  </View>

                  <View style={styles.footer}>
                    <AppText variant="caption" color={COLORS.textSecondary}>
                      {campaign.donorCount} متبرع
                    </AppText>
                    <View style={styles.manageLink}>
                      <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>إدارة الحملة</AppText>
                      <Ionicons name="chevron-back" size={17} color={COLORS.primaryStrong} />
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.lg },
  list: { gap: SPACING.sm },
  card: { gap: SPACING.md },
  cardHeader: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.md },
  amountRow: { flexDirection: "row", direction: "rtl", alignItems: "baseline", gap: SPACING.xs },
  progressTrack: { height: 9, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceMuted, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: RADIUS.full, backgroundColor: COLORS.success },
  footer: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.md },
  manageLink: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xxs },
  flex: { flex: 1 },
});
