import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useOrganizationReportDetails } from "../hooks/useOrganizationReportDetails";

export default function OrganizationReportDetailsScreen() {
  const details = useOrganizationReportDetails();

  if (details.loading) return <Screen surface="app"><LoadingState label="جاري تحميل البلاغ..." /></Screen>;
  if (details.error) return <Screen surface="app"><ErrorState description={details.error} onRetry={() => void details.reload()} /></Screen>;
  if (!details.report) {
    return <Screen surface="app" contentContainerStyle={styles.content}><EmptyState title="البلاغ غير متاح" description="قد يكون البلاغ أُغلق أو لم يعد متاحًا لهذه الجمعية." actionTitle="العودة للبلاغات" onActionPress={details.backToReports} /></Screen>;
  }

  const report = details.report;
  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader title="مراجعة البلاغ" subtitle={report.code} onBack={details.goBack} />
      <View style={styles.body}>
      <View style={styles.card}>
        <AppText variant="h3" weight="bold">{report.title}</AppText>
        <AppText color={COLORS.textSecondary}>{report.locationName}</AppText>
        <AppText color={COLORS.textSecondary}>{report.subtitle}</AppText>
        {report.priority === "urgent" ? <AppText color={COLORS.danger} weight="bold">هذه الحالة مصنفة كحالة حرجة.</AppText> : null}
      </View>
      <View style={styles.card}>
        <AppText weight="bold">قرار الفرز</AppText>
        <AppText color={COLORS.textSecondary}>استلام البلاغ يحوله إلى مهمة إنقاذ نشطة ويضيفه إلى قائمة مهام الفريق.</AppText>
      </View>
      <ActionStack>
        <Button title="استلام وتحويل إلى مهمة" onPress={() => void details.accept()} />
        <Button title="العودة للبلاغات" variant="outline" onPress={details.goBack} />
      </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  card: { padding: SPACING.lg, gap: SPACING.sm, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
});
