import { FlatList } from "react-native";

import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import ReportCard from "../components/ReportCard";
import { useReports } from "../hooks/useReports";
import { styles } from "./Reports.styles";

export default function ReportsScreen() {
  const { reports, loading, error, reload } = useReports();

  if (loading) return <LoadingState label="جاري تحميل البلاغات..." />;

  if (error) {
    return <ErrorState description={error} onRetry={() => void reload()} style={styles.state} />;
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={reports.length === 0 ? styles.emptyList : styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReportCard
          report={item}
          onHelpPress={() => console.log("استجابة", item.id)}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          title="لا توجد بلاغات بعد"
          description="ستظهر هنا البلاغات الجديدة فور إضافتها."
          icon="document-text-outline"
          compact
        />
      }
    />
  );
}
