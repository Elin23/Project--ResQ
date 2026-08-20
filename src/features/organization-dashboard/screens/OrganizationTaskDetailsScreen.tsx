import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Card from "@/src/components/ui/Card";
import DetailRow from "@/src/components/ui/DetailRow";
import Input from "@/src/components/ui/Input";
import ReadingSection from "@/src/components/ui/ReadingSection";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import Screen from "@/src/components/ui/Screen";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
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
  return <Screen scroll padded={false} surface="app" safeAreaEdges={["top", "left", "right", "bottom"]} contentContainerStyle={styles.scroll} footer={<StickyActionBar><Button title={vm.allChecked ? "إكمال المهمة" : "حفظ التعديلات"} icon="refresh-outline" onPress={vm.saveUpdates} /></StickyActionBar>}>
    <OrganizationTaskHeader title="تفاصيل المهمة" onBack={vm.goBack} onShare={vm.shareTask} onMore={() => showFeedback({ title: "خيارات المهمة", message: "يمكنك مشاركة المهمة أو التواصل مع المركز عند الحاجة.", tone: "info" })} />
    <View style={styles.content}>
      <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow>
        <View style={styles.statusRow}><View style={styles.urgentPill}><AppText variant="caption" weight="bold" color={COLORS.textInverse}>مهمة حرجة</AppText></View><View style={styles.codeWrap}><AppText variant="caption" color={COLORS.textSecondary}>رقم المهمة: {task.code}</AppText><AppText variant="caption" color={COLORS.textSecondary}>الوصول التقديري</AppText></View><AppText variant="h3" weight="bold" color={COLORS.warning}>{task.etaMinutes} دقيقة</AppText></View>
        <Button title="في الطريق إلى الموقع" icon="walk-outline" onPress={vm.openNavigation} size="medium" backgroundColor={COLORS.rescueSoft} borderColor={COLORS.rescueBorder} borderWidth={1} textColor={COLORS.warning} />
      </Card>

      <View style={styles.heroWrap}><Image source={task.image} style={styles.hero} /><View style={styles.counter}><AppText variant="caption" color={COLORS.textInverse}>1/3</AppText></View></View>

      <ReadingSection title="ملخص البلاغ" subtitle="المعلومات الأساسية قبل الوصول إلى الموقع">
        <View style={styles.twoCols}>
          <DetailRow label="نوع الحيوان" value={task.animalType} icon="paw-outline" tone="soft" />
          <DetailRow label="المدينة" value={task.city} icon="location-outline" tone="soft" />
        </View>
        <Card disabled shadow={false} backgroundColor={COLORS.rescueInput}>
          <DetailRow label="الحالة الصحية" value={task.healthStatus} icon="medkit-outline" valueColor={COLORS.danger} />
          <View style={styles.divider} />
          <AppText variant="caption" color={COLORS.textSecondary}>ملاحظات المبلّغ</AppText>
          <AppText variant="bodyLarge">{task.reporterNote}</AppText>
          <View style={styles.timeRow}><Ionicons name="time-outline" size={14} color={COLORS.textSecondary} /><AppText variant="caption" color={COLORS.textSecondary}>{task.reportedAgo}</AppText></View>
        </Card>
      </ReadingSection>

      <ReadingSection title="الموقع" actionLabel="نسخ الموقع" onActionPress={() => showFeedback({ title: "الموقع", message: task.locationLabel, tone: "info" })}>
        <Card padding={0} shadow><Image source={task.mapImage} style={styles.map} /><View style={styles.mapButton}><Button title="بدء الملاحة" icon="navigate-outline" onPress={vm.openNavigation} size="medium" /></View></Card>
        <AppText variant="caption" color={COLORS.textSecondary}>لا تتم مشاركة موقعك مع غرفة العمليات إلا أثناء تنفيذ المهمة.</AppText>
      </ReadingSection>

      <ReadingSection title="بيانات المبلّغ">
      <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow={false} style={styles.reporterCard}>
        <Pressable onPress={vm.callReporter} style={styles.contactIcon}><Ionicons name="call" size={24} color={COLORS.successDark} /></Pressable>
        <Pressable onPress={() => showFeedback({ title: "المراسلة غير متاحة بعد", message: "ستتوفر قناة الرسائل بعد ربط خدمة المراسلة.", tone: "info" })} style={styles.contactIcon}><Ionicons name="chatbox-outline" size={22} color={COLORS.brown} /></Pressable>
        <View style={styles.reporterText}><AppText weight="medium">{task.reporterName}</AppText><AppText variant="caption" color={COLORS.textSecondary}>{task.reporterPhone}</AppText></View>
        <View style={styles.avatar}><AppText weight="bold" color={COLORS.successDark}>خ س</AppText></View>
      </Card>
      </ReadingSection>

      <ReadingSection title="الجدول الزمني للمهمة">
      <TaskTimeline items={ORGANIZATION_TASK_TIMELINE} stage={vm.stage} />
      </ReadingSection>

      <ReadingSection title="قائمة التحقق">
      <TaskChecklist value={vm.checklist} onToggle={vm.toggleChecklist} />
      </ReadingSection>

      <ReadingSection title="التوثيق والملاحظات" subtitle="أضف الصور والملاحظات التي تساعد على توثيق التنفيذ">
      <TaskEvidenceSection images={vm.images} onCamera={vm.openCamera} onGallery={vm.openGallery} />
      <Input label="ملاحظات الجمعية" value={vm.notes} onChangeText={vm.setNotes} multiline numberOfLines={5} placeholder="اكتب ملاحظات هنا عن حالة الحيوان..." />
      </ReadingSection>

      <Card backgroundColor={COLORS.rescueDangerSoft} borderWidth={1} borderColor={COLORS.statusPendingLight} shadow={false}>
        <View style={styles.emergencyTitle}><Ionicons name="warning-outline" size={20} color={COLORS.danger} /><AppText weight="medium" color={COLORS.danger}>حالات الطوارئ</AppText></View>
        <ActionStack>
          <Button title="الاتصال بالطوارئ البيطرية" icon="medkit-outline" onPress={vm.callVet} size="medium" variant="danger" />
          <Button title="الاتصال بالجمعية" icon="headset-outline" onPress={vm.callAssociation} size="medium" variant="outline" borderColor={COLORS.brownMuted} textColor={COLORS.brownMuted} />
        </ActionStack>
      </Card>
    </View>
  </Screen>;
}


const styles = StyleSheet.create({
  scroll: { paddingVertical: 0 }, content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  statusRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm, marginBottom: SPACING.md }, urgentPill: { backgroundColor: COLORS.danger, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs }, codeWrap: { flex: 1, alignItems: "stretch" },
  heroWrap: { position: "relative", marginVertical: SPACING.sm }, hero: { width: "100%", height: 220, borderRadius: RADIUS.lg, resizeMode: "cover" }, counter: { position: "absolute", left: SPACING.md, bottom: SPACING.md, backgroundColor: COLORS.backdrop, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  twoCols: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, flexWrap: "wrap" }, divider: { height: 1, width: "100%", backgroundColor: COLORS.border, marginVertical: SPACING.sm }, timeRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "flex-end", gap: SPACING.xs, marginTop: SPACING.sm },
  map: { width: "100%", height: 170, resizeMode: "cover" }, mapButton: { position: "absolute", left: SPACING.md, right: SPACING.md, bottom: SPACING.md }, reporterCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm }, contactIcon: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.rescueSoft, alignItems: "center", justifyContent: "center" }, reporterText: { flex: 1, alignItems: "stretch" }, emergencyTitle: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs }, avatar: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center" },
});
