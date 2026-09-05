import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { organizationReportDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useOrganizationReports } from "../hooks/useOrganizationReports";

function relativeLabel(createdAt: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  return minutes < 60 ? `منذ ${minutes} دقيقة` : `منذ ${Math.round(minutes / 60)} ساعة`;
}

export default function OrganizationReportsScreen() {
  const router = useRouter();
  const { reports, loading, error, reload } = useOrganizationReports();
  const incoming = reports.filter((item) => item.status === "pending");

  return (
    <Screen scroll surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader
        title="البلاغات الواردة"
        subtitle="راجع الحالات الجديدة قبل تحويلها إلى مهام إنقاذ"
        onBack={() => router.back()}
        right={<View style={styles.counter}><AppText weight="bold">{incoming.length}</AppText></View>}
      />

      {loading ? <LoadingState label="جاري تحميل البلاغات..." /> : error ? (
        <ErrorState description={error} onRetry={() => void reload()} />
      ) : incoming.length === 0 ? (
        <EmptyState title="لا توجد بلاغات جديدة" description="ستظهر هنا البلاغات المتاحة للجمعية عند وصولها." icon="checkmark-circle-outline" />
      ) : (
        <View style={styles.list}>
          {incoming.map((report) => (
            <Pressable key={report.id} accessibilityRole="button" onPress={() => router.push(organizationReportDetailsRoute(report.id))} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.badge, report.priority === "urgent" && styles.urgentBadge]}>
                  <AppText variant="caption" color={report.priority === "urgent" ? COLORS.white : COLORS.textSecondary}>{report.priority === "urgent" ? "حرج" : "جديد"}</AppText>
                </View>
                <Ionicons name="chevron-back" size={20} color={COLORS.textMuted} />
              </View>
              <AppText weight="bold">{report.title}</AppText>
              <AppText color={COLORS.textSecondary}>{report.locationName}</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>{relativeLabel(report.createdAt)} • {report.code}</AppText>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0, paddingBottom: 110, gap: SPACING.lg },
  counter: { minWidth: 36, height: 36, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface },
  list: { gap: SPACING.md },
  card: { padding: SPACING.lg, gap: SPACING.sm, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  cardTop: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between" },
  badge: { alignSelf: "flex-start", paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.lightgray },
  urgentBadge: { backgroundColor: COLORS.dangerFill },
});
