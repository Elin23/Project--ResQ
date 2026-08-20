import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { adoptionListingApplicationDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useListingApplications } from "../hooks/useListingApplications";
import { useOwnedAdoptionListingDetails } from "../hooks/useOwnedAdoptionListingDetails";

const STATUS_META = {
  pending: { label: "قيد المراجعة", color: COLORS.warning },
  completed: { label: "اكتمل التبني", color: COLORS.success },
  accepted: { label: "مقبول", color: COLORS.success },
  rejected: { label: "مرفوض", color: COLORS.danger },
  not_selected: { label: "لم يتم الاختيار", color: COLORS.textMuted },
  withdrawn: { label: "مسحوب", color: COLORS.textMuted },
} as const;

export default function AdoptionListingApplicationsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, accountKind } = useSession();
  const listingState = useOwnedAdoptionListingDetails(id, account?.id);
  const state = useListingApplications(id, account?.id);

  if (listingState.loading || state.loading) {
    return <Screen><LoadingState label="جاري تحميل طلبات التبني..." /></Screen>;
  }
  if (listingState.error || state.error) {
    return <Screen><ErrorState description={listingState.error ?? state.error ?? "تعذر تحميل الطلبات."} onRetry={() => { void listingState.reload(); void state.reload(); }} /></Screen>;
  }
  if (!listingState.listing) {
    return <Screen><EmptyState title="الإعلان غير موجود" description="قد لا تملك صلاحية إدارة هذا الإعلان." /></Screen>;
  }

  const pendingCount = state.applications.filter((item) => item.status === "pending").length;

  return (
    <Screen scroll padded={false}>
      <ScreenHeader
        title="طلبات تبني الحيوان"
        subtitle={`${listingState.listing.animalName} • ${pendingCount} بانتظار قرارك`}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        {state.applications.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="لا توجد طلبات بعد"
            description="عند وصول طلبات لتبني هذا الحيوان ستظهر هنا لتراجعها وتتخذ القرار المناسب."
          />
        ) : (
          state.applications.map((application) => {
            const meta = STATUS_META[application.status];
            return (
              <Card
                key={application.id}
                onPress={() => router.push(adoptionListingApplicationDetailsRoute(id, application.id, accountKind))}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.identity}>
                    <View style={styles.avatar}>
                      <Ionicons name="person-outline" size={21} color={COLORS.primaryStrong} />
                    </View>
                    <View style={styles.flex}>
                      <AppText variant="label" weight="bold">{application.applicantName}</AppText>
                      <AppText variant="caption" color={COLORS.textSecondary}>{application.city}</AppText>
                    </View>
                  </View>
                  <StatusBadge label={meta.label} color={meta.color} />
                </View>
                <AppText variant="bodySmall" color={COLORS.textSecondary} numberOfLines={2}>
                  {application.reason}
                </AppText>
                <View style={styles.footer}>
                  <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
                  <AppText variant="caption" color={COLORS.textMuted}>عرض الطلب واتخاذ القرار</AppText>
                </View>
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md },
  card: { gap: SPACING.md },
  cardHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  identity: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primarySoft },
  footer: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  flex: { flex: 1 },
});
