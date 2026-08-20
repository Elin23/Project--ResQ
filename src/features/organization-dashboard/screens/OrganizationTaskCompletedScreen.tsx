import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Card from "@/src/components/ui/Card";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { ROUTES } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { COMPLETED_TASK_TIMELINE } from "../constants/organizationTask";
import { useCompletedRescueTask } from "../hooks/useCompletedRescueTask";
import OrganizationTaskHeader from "../components/OrganizationTaskHeader";

export default function OrganizationTaskCompletedScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const completed = useCompletedRescueTask();
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  if (completed.loading) return <Screen surface="app"><LoadingState label="جاري تحميل ملخص المهمة..." /></Screen>;
  if (completed.error || !completed.task || !completed.summary) return <Screen surface="app"><ErrorState description={completed.error ?? "تعذر العثور على المهمة المكتملة."} onRetry={() => void completed.reload()} /></Screen>;

  const code = completed.task.code;

  const share = async () => { await Share.share({ message: `تم إكمال مهمة الإنقاذ ${code} بنجاح عبر ResQ 🎉` }); };

  return <Screen scroll padded={false} surface="app" safeAreaEdges={["top", "left", "right", "bottom"]} contentContainerStyle={styles.scroll} footer={<StickyActionBar><ActionStack><Button title="العودة إلى لوحة الجمعية" onPress={() => router.replace(ROUTES.organizationDashboard)} /><Button title="استلام مهمة جديدة" onPress={() => router.replace(ROUTES.organizationDashboard)} variant="text" /></ActionStack></StickyActionBar>}>
    <OrganizationTaskHeader title="إكمال المهمة" onBack={() => router.replace(ROUTES.organizationDashboard)} onShare={share} />
    <View style={styles.content}>
      <View style={styles.successIcon}><Ionicons name="checkmark" size={34} color={COLORS.white} /></View>
      <AppText size={FONT_SIZES.displayLarge} weight="bold" style={styles.center}>تم إكمال المهمة بنجاح 🎉</AppText>
      <AppText color={COLORS.textSecondary} style={styles.description}>شكراً لمساهمتك في إنقاذ حياة حيوان. تم تحديث حالة المهمة وإرسال جميع البيانات إلى فريق ResQ.</AppText>

      <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow={false}>
        <View style={styles.summaryHeader}><View style={styles.donePill}><AppText size={FONT_SIZES.caption} color={COLORS.successDark}>تم الإنقاذ</AppText></View><View style={styles.summaryText}><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>رقم المهمة</AppText><AppText weight="medium">{code}</AppText></View></View>
        <View style={styles.summaryRow}><View><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{completed.summary.completedLabel}</AppText></View><View style={styles.animal}><Ionicons name="paw" size={20} color={COLORS.brown} /><AppText>النوع: {completed.task.animalType}</AppText></View></View>
      </Card>

      <View style={styles.grid}><Stat icon="time-outline" label="مدة المهمة" value={completed.summary.duration} /><Stat icon="location-outline" label="المسافة المقطوعة" value={completed.summary.distance} /><Stat icon="images-outline" label="الصور المرفوعة" value={completed.summary.uploadedPhotos} /><Stat icon="document-text-outline" label="الملاحظات" value={completed.summary.notesStatus} /></View>

      <Card backgroundColor={COLORS.rescueSoft} borderWidth={1} borderColor={COLORS.rescueBorder} shadow={false}>
        <AppText weight="bold" color={COLORS.warning} style={styles.rtl}>الأثر الذي صنعته</AppText>
        <Impact icon="heart-outline" label="تم إنقاذ حيوان واحد" />
        <Impact icon="star-outline" label="+25 نقطة أثر للجمعية" />
        <Impact icon="medal-outline" label="شارة جديدة: منقذ الحيوانات" />
      </Card>

      <AppText size={FONT_SIZES.title} weight="medium" style={styles.sectionTitle}>ملخص الرحلة</AppText>
      <View style={styles.completedTimeline}>{COMPLETED_TASK_TIMELINE.map((item, index) => <View key={item.id} style={styles.completedRow}><View style={styles.completedText}><AppText weight={index === COMPLETED_TASK_TIMELINE.length - 1 ? "bold" : "regular"}>{item.label}</AppText><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{item.time}</AppText></View><View style={styles.completedRail}><View style={styles.completedDot} />{index < COMPLETED_TASK_TIMELINE.length - 1 ? <View style={styles.completedLine} /> : null}</View></View>)}</View>

      <Card borderWidth={1} borderColor={COLORS.rescueBorder} shadow={false}>
        <AppText weight="medium" style={styles.center}>كيف كانت تجربتك؟</AppText>
        <View style={styles.stars}>{[1,2,3,4,5].map((star) => <Pressable key={star} accessibilityRole="button" accessibilityLabel={`تقييم ${star} من 5`} accessibilityState={{ selected: star === rating }} onPress={() => setRating(star)} style={({ pressed }) => [styles.starButton, pressed && styles.starPressed]}><Ionicons name={star <= rating ? "star" : "star-outline"} size={32} color={star <= rating ? COLORS.rating : COLORS.neutral} /></Pressable>)}</View>
        <Input value={notes} onChangeText={setNotes} multiline label="ملاحظات التجربة" placeholder="أضف ملاحظاتك هنا (اختياري)..." />
      </Card>

      <ActionStack>
        <Button title="مشاركة الإنجاز" icon="share-social-outline" onPress={share} variant="outline" borderColor={COLORS.brownMuted} textColor={COLORS.brownMuted} />
        <Button title="تحميل تقرير المهمة (PDF)" icon="document-outline" onPress={() => showFeedback({ title: "تقرير المهمة", message: "سيتم إنشاء ملف PDF عند ربط خدمة التقارير.", tone: "info" })} variant="outline" borderColor={COLORS.brownMuted} textColor={COLORS.brownMuted} />
      </ActionStack>
    </View>
  </Screen>;
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.stat}><Ionicons name={icon} size={24} color={COLORS.bgblue} /><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{label}</AppText><AppText weight="medium">{value}</AppText></View>; }
function Impact({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) { return <View style={styles.impact}><AppText>{label}</AppText><View style={styles.impactIcon}><Ionicons name={icon} size={18} color={COLORS.warning} /></View></View>; }

const styles = StyleSheet.create({
  scroll: { paddingVertical: 0 }, content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg }, successIcon: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: COLORS.rescueSuccess, borderWidth: 5, borderColor: COLORS.rescueSuccessSoft, alignSelf: "center", alignItems: "center", justifyContent: "center", marginTop: SPACING.xl, marginBottom: SPACING.md }, center: { textAlign: "center", writingDirection: "rtl" }, description: { textAlign: "center", writingDirection: "rtl", lineHeight: 24, marginVertical: SPACING.md, paddingHorizontal: SPACING.sm },
  summaryHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between" }, donePill: { backgroundColor: COLORS.success, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs }, summaryText: { alignItems: "stretch" }, summaryRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", marginTop: SPACING.md }, animal: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  grid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.md }, stat: { width: "48.5%", minHeight: 112, borderRadius: RADIUS.md, backgroundColor: COLORS.rescueInput, alignItems: "center", justifyContent: "center", gap: SPACING.xs }, rtl: { textAlign: "right", writingDirection: "rtl" }, impact: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "flex-end", gap: SPACING.sm, marginTop: SPACING.sm }, impactIcon: { width: 34, height: 34, borderRadius: RADIUS.full, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  sectionTitle: { textAlign: "right", marginTop: SPACING.lg, marginBottom: SPACING.md }, completedTimeline: { marginBottom: SPACING.lg }, completedRow: { minHeight: 62, flexDirection: "row", direction: "rtl", justifyContent: "flex-end" }, completedText: { flex: 1, alignItems: "stretch", paddingStart: SPACING.md }, completedRail: { width: 24, alignItems: "center" }, completedDot: { width: 16, height: 16, borderRadius: RADIUS.full, backgroundColor: COLORS.rescueSuccess }, completedLine: { width: 2, minHeight: 46, flex: 1, backgroundColor: COLORS.orgStatGreenBorder },
  stars: { flexDirection: "row", direction: "rtl", justifyContent: "center", gap: SPACING.xs, marginVertical: SPACING.md }, starButton: { width: 44, height: 44, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" }, starPressed: { opacity: 0.7, transform: [{ scale: 0.94 }] },
});
