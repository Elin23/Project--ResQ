import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import ActionStack from "@/src/components/ui/ActionStack";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import DetailRow from "@/src/components/ui/DetailRow";
import Input from "@/src/components/ui/Input";
import ReadingSection from "@/src/components/ui/ReadingSection";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import RemoteImage from "@/src/components/ui/RemoteImage";
import Screen from "@/src/components/ui/Screen";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { COLORS, DENSITY, RADIUS, SPACING } from "@/src/theme";
import { ORGANIZATION_TASK_TIMELINE } from "../constants/organizationTask";
import { useOrganizationTaskDetails } from "../hooks/useOrganizationTaskDetails";
import OrganizationTaskHeader from "../components/OrganizationTaskHeader";
import TaskChecklist from "../components/TaskChecklist";
import TaskEvidenceSection from "../components/TaskEvidenceSection";
import TaskTimeline from "../components/TaskTimeline";

export default function OrganizationTaskDetailsScreen() {
  const vm = useOrganizationTaskDetails();
  const { showFeedback } = useFeedback();
  if (vm.loading) return <Screen surface="app"><LoadingState label="جاري تحميل المهمة..." /></Screen>;
  if (vm.error || !vm.task) return <Screen surface="app"><ErrorState description={vm.error ?? "تعذر العثور على المهمة."} onRetry={() => void vm.reload()} /></Screen>;
  const task = vm.task;
  const hasReporterPhone = Boolean(task.reporterPhone?.trim());

  return (
    <Screen
      scroll
      padded={false}
      surface="app"
      safeAreaEdges={["top", "left", "right", "bottom"]}
      contentContainerStyle={styles.scroll}
      footer={<StickyActionBar><Button title={vm.allChecked ? "إكمال المهمة" : "حفظ التعديلات"} icon="save-outline" onPress={() => void vm.saveUpdates()} /></StickyActionBar>}
    >
      <OrganizationTaskHeader title="تفاصيل المهمة" onBack={vm.goBack} onShare={() => void vm.shareTask()} onMore={() => showFeedback({ title: "خيارات المهمة", message: "يمكنك مشاركة المهمة أو تحديث مراحل التنفيذ من هذه الصفحة.", tone: "info" })} />
      <View style={styles.content}>
        <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow>
          <View style={styles.statusRow}>
            <View style={styles.codeWrap}>
              <AppText variant="caption" color={COLORS.textSecondary}>رقم المهمة</AppText>
              <AppText variant="h3" weight="bold">{task.code}</AppText>
            </View>
            <Button title="بدء الملاحة" icon="navigate-outline" onPress={() => void vm.openNavigation()} size="small" fullWidth={false} />
          </View>
        </Card>

        {task.imageUri ? <RemoteImage uri={task.imageUri} style={styles.hero} accessibilityLabel="صورة البلاغ المرتبط بالمهمة" /> : null}

        <ReadingSection title="ملخص البلاغ" subtitle="المعلومات الأساسية القادمة من البلاغ المسند">
          <View style={styles.twoCols}>
            <DetailRow label="نوع الحيوان" value={task.animalType} icon="paw-outline" tone="soft" />
            <DetailRow label="المدينة" value={task.city || "غير محددة"} icon="location-outline" tone="soft" />
          </View>
          <Card disabled shadow={false} backgroundColor={COLORS.rescueInput} style={styles.summaryCard}>
            <DetailRow label="الحالة" value={task.healthStatus} icon="medkit-outline" valueColor={COLORS.danger} />
            <View style={styles.divider} />
            <AppText variant="caption" color={COLORS.textSecondary}>ملاحظات المبلّغ</AppText>
            <AppText variant="bodyLarge">{task.reporterNote || "لا توجد ملاحظات إضافية."}</AppText>
          </Card>
        </ReadingSection>

        <ReadingSection title="الموقع" actionLabel="عرض العنوان" onActionPress={() => showFeedback({ title: "الموقع", message: task.locationLabel, tone: "info" })}>
          <Card shadow={false} borderWidth={1} borderColor={COLORS.border} style={styles.locationCard}>
            <View style={styles.locationIcon}><Ionicons name="location-outline" size={26} color={COLORS.primaryStrong} /></View>
            <AppText style={styles.locationText}>{task.locationLabel}</AppText>
            <ActionStack><Button title="فتح في الخرائط" icon="navigate-outline" onPress={() => void vm.openNavigation()} size="small" /></ActionStack>
          </Card>
        </ReadingSection>

        <ReadingSection title="بيانات المبلّغ">
          <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow={false} style={styles.reporterCard}>
            {hasReporterPhone ? (
              <Pressable accessibilityRole="button" accessibilityLabel="الاتصال بالمبلّغ" onPress={() => void vm.callReporter()} style={styles.contactIcon}>
                <Ionicons name="call" size={22} color={COLORS.successDark} />
              </Pressable>
            ) : null}
            <View style={styles.reporterText}>
              <AppText weight="medium">{task.reporterName}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>{hasReporterPhone ? task.reporterPhone : "رقم الهاتف غير متاح"}</AppText>
            </View>
          </Card>
        </ReadingSection>

        <ReadingSection title="الجدول الزمني للمهمة">
          <TaskTimeline items={ORGANIZATION_TASK_TIMELINE} stage={vm.stage} />
        </ReadingSection>

        <ReadingSection title="مراحل التنفيذ" subtitle="كل اختيار يحدّث حالة المهمة الفعلية على الخادم ولا يتم حفظه محليًا فقط.">
          <TaskChecklist value={vm.checklist} onToggle={(key) => void vm.toggleChecklist(key)} />
        </ReadingSection>

        <ReadingSection title="التوثيق والملاحظات" subtitle="الصور والملاحظات تحفظ على الخادم وتبقى مرتبطة بالمهمة">
          <TaskEvidenceSection images={vm.images} onCamera={vm.openCamera} onGallery={vm.openGallery} />
          <Input label="ملاحظات الجمعية" value={vm.notes} onChangeText={vm.setNotes} multiline numberOfLines={5} placeholder="اكتب ملاحظات عن حالة الحيوان والتنفيذ..." />
        </ReadingSection>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 0 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.xl, gap: DENSITY.sectionGap },
  statusRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.md },
  codeWrap: { flex: 1, alignItems: "stretch", gap: SPACING.xxs },
  hero: { width: "100%", height: 220, borderRadius: RADIUS.lg },
  twoCols: { flexDirection: "row", direction: "rtl", gap: SPACING.md, flexWrap: "wrap" },
  summaryCard: { gap: SPACING.sm },
  divider: { height: 1, width: "100%", backgroundColor: COLORS.border },
  locationCard: { gap: SPACING.md, alignItems: "stretch" },
  locationIcon: { width: 48, height: 48, borderRadius: RADIUS.full, alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surfaceMuted },
  locationText: { textAlign: "center" },
  reporterCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  contactIcon: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.rescueSoft, alignItems: "center", justifyContent: "center" },
  reporterText: { flex: 1, alignItems: "stretch", gap: SPACING.xxs },
});
