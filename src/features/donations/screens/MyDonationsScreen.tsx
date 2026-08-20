import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useSession } from "@/src/features/session/SessionContext";
import { donationDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationTransfer } from "@/src/domain";
import { useMyDonations } from "../hooks/useMyDonations";

const STATUS = {
  submitted: { label: "قيد المراجعة", color: COLORS.warning, icon: "time-outline" as const },
  verifying: { label: "قيد التحقق", color: COLORS.info, icon: "search-outline" as const },
  approved: { label: "تم الاعتماد", color: COLORS.success, icon: "checkmark-circle-outline" as const },
  rejected: { label: "مرفوض", color: COLORS.danger, icon: "close-circle-outline" as const },
};

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function MyDonationsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const state = useMyDonations(account?.id);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل تبرعاتك..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="تبرعاتي" subtitle="متابعة الحوالات وحالة التحقق" onBack={() => router.back()} />
      <View style={styles.content}>
        {state.transfers.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="لا توجد تبرعات بعد"
            description="بعد إرسال بيانات حوالة لإحدى الحملات ستظهر هنا لمتابعة حالة التحقق."
          />
        ) : (
          state.transfers.map((transfer) => (
            <DonationRow
              key={transfer.id}
              transfer={transfer}
              onPress={() => router.push(donationDetailsRoute(transfer.id, accountKind))}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function DonationRow({ transfer, onPress }: { transfer: DonationTransfer; onPress: () => void }) {
  const meta = STATUS[transfer.status];
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${meta.color}18` }]}>
        <Ionicons name={meta.icon} size={24} color={meta.color} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label" weight="bold">{transfer.campaignTitle}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>{dateLabel(transfer.createdAt)}</AppText>
        <AppText variant="caption" color={meta.color}>{meta.label}</AppText>
      </View>
      <View style={styles.amountWrap}>
        <AppText variant="label" weight="bold">{money(transfer.amount)}</AppText>
        <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.sm },
  card: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  iconWrap: { width: 48, height: 48, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  amountWrap: { alignItems: "stretch", gap: SPACING.xs },
  flex: { flex: 1 },
});
