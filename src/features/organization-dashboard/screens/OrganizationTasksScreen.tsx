import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ScreenSection from "@/src/components/ui/ScreenSection";
import { organizationTaskDetailsRoute } from "@/src/navigation/routes";
import { SPACING } from "@/src/theme";
import ActiveRescueTaskCard from "../components/ActiveRescueTaskCard";
import { useOrganizationTasks } from "../hooks/useOrganizationTasks";

export default function OrganizationTasksScreen() {
  const router = useRouter();
  const { tasks, loading, error, reload } = useOrganizationTasks();

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader title="مهام الإنقاذ" subtitle="الحالات التي استلمتها الجمعية وبدأ تنفيذها" />
      <View style={styles.body}>
      <ScreenSection title="المهام النشطة" subtitle="رتّب الأولويات بحسب الحالة والمسافة ونسبة الإنجاز">
        {loading ? <LoadingState /> : error ? <ErrorState description={error} onRetry={() => void reload()} /> : tasks.length === 0 ? (
          <EmptyState title="لا توجد مهام نشطة" description="عند استلام بلاغ جديد سيظهر هنا كمهمة إنقاذ." icon="navigate-outline" />
        ) : tasks.map((task) => (
          <View key={task.id} style={styles.taskGap}>
            <ActiveRescueTaskCard task={task} onOpen={() => router.push(organizationTaskDetailsRoute(task.id))} onUpdate={() => router.push(organizationTaskDetailsRoute(task.id))} />
          </View>
        ))}
      </ScreenSection>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.xl },
  taskGap: { marginBottom: SPACING.md },
});
