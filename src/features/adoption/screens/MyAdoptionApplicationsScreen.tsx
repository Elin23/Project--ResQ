import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { adoptionApplicationDetailsRoute } from "@/src/navigation/routes";
import { COLORS, SPACING } from "@/src/theme";
import { useAdoptionApplications } from "../hooks/useAdoptionApplications";

const STATUS = {
  pending: { label: "قيد المراجعة", color: COLORS.warning },
  completed: { label: "اكتمل التبني", color: COLORS.success },
  accepted: { label: "تم القبول", color: COLORS.success },
  rejected: { label: "مرفوض", color: COLORS.danger },
  not_selected: { label: "لم يتم الاختيار", color: COLORS.textMuted },
  withdrawn: { label: "تم السحب", color: COLORS.textMuted },
} as const;

export default function MyAdoptionApplicationsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const state = useAdoptionApplications(account?.id);

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <ScreenHeader title="طلبات التبني الخاصة بي" subtitle="تابع حالة الطلبات التي أرسلتها" onBack={() => router.back()} />
      <View style={styles.body}>
        {state.loading ? <LoadingState label="جاري تحميل طلبات التبني..." /> : state.error ? <ErrorState description={state.error} onRetry={() => void state.reload()} /> : state.applications.length === 0 ? (
          <EmptyState title="لا توجد طلبات بعد" description="عندما تتقدم لتبني حيوان ستظهر حالة طلبك هنا." icon="heart-outline" />
        ) : state.applications.map((application) => {
          const status = STATUS[application.status];
          return (
            <Card key={application.id} onPress={() => router.push(adoptionApplicationDetailsRoute(application.id, accountKind))} style={styles.card}>
              <View style={styles.row}>
                <AppText variant="h3" weight="bold">طلب تبني</AppText>
                <StatusBadge label={status.label} color={status.color} size="sm" />
              </View>
              <AppText color={COLORS.textSecondary}>المدينة: {application.city}</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>{new Date(application.createdAt).toLocaleDateString("ar")}</AppText>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.md },
  card: { gap: SPACING.sm },
  row: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", alignItems: "center", gap: SPACING.sm },
});
