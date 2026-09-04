import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import QuickReportFab from "@/src/components/ui/QuickReportFab";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import Chip from "@/src/components/ui/Chip";
import WorkspaceMetricGrid from "@/src/components/ui/WorkspaceMetricGrid";
import { useSession } from "@/src/features/session/SessionContext";
import { reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, SPACING } from "@/src/theme";
import MyReportCard from "../components/MyReportCard";
import { useMyReports, type ReportFilter } from "../hooks/useMyReports";

const filters: { id: ReportFilter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "review", label: "قيد المراجعة" },
  { id: "rescue", label: "قيد الإنقاذ" },
  { id: "rescued", label: "تم الإنقاذ" },
];

export default function ReportsScreen() {
  const model = useMyReports();
  const router = useRouter();
  const { isGuest, accountKind } = useSession();

  const metrics = [
    { key: "all", label: "إجمالي البلاغات", value: model.stats.all, icon: "documents-outline" as const, color: COLORS.primaryStrong },
    { key: "mine", label: "بلاغاتي", value: model.stats.mine, icon: "person-outline" as const, color: COLORS.textSecondary },
    { key: "rescue", label: "قيد الإنقاذ", value: model.stats.rescued, icon: "navigate-outline" as const, color: COLORS.info },
  ];

  const createReport = () => router.push(ROUTES.createReport);

  return (
    <View style={styles.root}>
      <Screen scroll surface="app" contentContainerStyle={styles.content}>
        <ScreenHeader title={isGuest ? "بلاغات المجتمع" : "بلاغاتي"} onBack={() => router.back()} />

        {!isGuest ? <WorkspaceMetricGrid metrics={metrics} columns={3} /> : null}

        <Input
          placeholder="ابحث برقم البلاغ أو نوع الحيوان..."
          value={model.query}
          onChangeText={model.setQuery}
          icon="search"
        />

        <View style={styles.filters}>
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              color={COLORS.primaryStrong}
              selected={model.filter === filter.id}
              onPress={() => model.setFilter(filter.id)}
            />
          ))}
        </View>

        {model.loading ? (
          <LoadingState label="جاري تحميل البلاغات..." />
        ) : model.error ? (
          <ErrorState description={model.error} onRetry={() => void model.reload()} />
        ) : model.reports.length === 0 ? (
          <EmptyState
            title={isGuest ? "لا توجد بلاغات متاحة" : "لا توجد بلاغات بعد"}
            description={isGuest ? "ستظهر هنا بلاغات المجتمع عند توفرها." : "استخدم زر الإضافة العائم لإنشاء بلاغك الأول ومتابعته من هنا."}
            icon="document-text-outline"
          />
        ) : (
          <View style={styles.list}>
            {model.reports.map((report) => (
              <MyReportCard
                key={report.id}
                report={report}
                onDetailsPress={() => router.push(reportDetailsRoute(report.id, accountKind))}
              />
            ))}
          </View>
        )}

        <View accessible={false} style={styles.fabClearance} />
      </Screen>

      <QuickReportFab onPress={createReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: 0, gap: SPACING.lg },
  filters: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  list: { gap: SPACING.md },
  fabClearance: { height: 58 },
});
