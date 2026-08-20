import { StyleSheet, View } from "react-native";
import { useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import StatusBadge from "@/src/components/ui/StatusBadge";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { useSession } from "@/src/features/session/SessionContext";
import { canUserManageMapPlaceApplication, SERVICE_PLACE_TYPE_META, type MapPlaceApplicationStatus } from "@/src/domain/service-places";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, SPACING } from "@/src/theme";
import { mapPlaceApplicationEditRoute, mapPlaceEditRoute, ROUTES } from "@/src/navigation/routes";

const STATUS: Record<MapPlaceApplicationStatus, { label: string; color: string; description: string }> = {
  draft: { label: "مسودة", color: COLORS.textSecondary, description: "لم يتم إرسال الطلب للمراجعة بعد." },
  pending: { label: "قيد المراجعة", color: COLORS.warning, description: "الطلب لدى فريق المراجعة. لا يمكن تعديله أثناء المراجعة." },
  approved: { label: "تمت الموافقة", color: COLORS.successDark, description: "تم اعتماد الجهة. ستظهر ضمن الجهات التي تديرها." },
  rejected: { label: "بحاجة لتعديل", color: COLORS.danger, description: "راجع سبب الرفض ثم عدّل البيانات وأعد الإرسال." },
  cancelled: { label: "ملغي", color: COLORS.textSecondary, description: "تم إلغاء هذا الطلب." },
};

export default function MapPlaceApplicationDetailsScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const decision = useDecisionDialog();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account } = useSession();
  const loader = useCallback(() => repositories.mapPlaceApplications.getById(id), [id]);
  const resource = useAsyncResource(loader, null, "تعذر تحميل الطلب.");
  const owned = useMemo(() => Boolean(resource.data && account?.kind === "user" && canUserManageMapPlaceApplication(resource.data, account.id)), [resource.data, account]);

  const submit = async () => {
    if (!resource.data || !account || account.kind !== "user" || !owned) return;
    try {
      await repositories.mapPlaceApplications.submit(resource.data.id, account.id);
      await resource.reload();
    } catch { showFeedback({ title: "تعذر الإرسال", message: "لا يمكن إرسال الطلب من حالته الحالية.", tone: "error" }); }
  };

  const cancel = () => {
    if (!resource.data || !account || account.kind !== "user" || !owned) return;
    decision.request(
      { title: "إلغاء الطلب", message: "هل تريد إلغاء هذا الطلب؟", confirmLabel: "إلغاء الطلب", cancelLabel: "تراجع", destructive: true, icon: "close-circle-outline" },
      async () => { await repositories.mapPlaceApplications.cancel(resource.data!.id, account.id); await resource.reload(); },
    );
  };

  if (resource.loading) return <Screen><LoadingState /></Screen>;
  if (resource.error) return <Screen><ErrorState description={resource.error} onRetry={resource.reload} /></Screen>;
  if (!resource.data || !owned) return <Screen><ErrorState description="الطلب غير موجود أو لا تملك صلاحية الوصول إليه." /></Screen>;

  const application = resource.data;
  const status = STATUS[application.status];
  return (
    <Screen scroll padded={false} surface="app">
      <ScreenHeader title="طلب الظهور على الخريطة" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText variant="h3" weight="bold">{application.name}</AppText>
              <AppText color={COLORS.textSecondary}>{SERVICE_PLACE_TYPE_META[application.requestedType].label}</AppText>
            </View>
            <StatusBadge label={status.label} color={status.color} />
          </View>
          <AppText color={COLORS.textSecondary} style={styles.statusCopy}>{status.description}</AppText>
        </Card>

        {application.rejectionReason ? <Card borderColor={COLORS.danger}><AppText weight="bold" color={COLORS.danger}>سبب طلب التعديل</AppText><AppText style={styles.copy}>{application.rejectionReason}</AppText></Card> : null}

        <Card>
          <AppText weight="bold">البيانات المقدمة</AppText>
          <View style={styles.details}>
            <AppText>العنوان: {application.address}</AppText>
            <AppText>الهاتف: {application.phone}</AppText>
            {application.responsiblePerson ? <AppText>المسؤول: {application.responsiblePerson}</AppText> : null}
            {application.licenseNumber ? <AppText>رقم الترخيص: {application.licenseNumber}</AppText> : null}
            {application.description ? <AppText color={COLORS.textSecondary}>{application.description}</AppText> : null}
          </View>
        </Card>

        {application.status === "draft" || application.status === "rejected" ? <Button title="تعديل البيانات" variant="outline" onPress={() => router.push(mapPlaceApplicationEditRoute(application.id))} /> : null}
        {application.status === "draft" || application.status === "rejected" ? <Button title="إرسال للمراجعة" onPress={() => void submit()} /> : null}
        {application.status === "approved" && application.approvedPlaceId ? <Button title="إدارة الجهة المعتمدة" onPress={() => router.push(mapPlaceEditRoute(application.approvedPlaceId!))} /> : null}
        {["draft", "pending", "rejected"].includes(application.status) ? <Button title="إلغاء الطلب" variant="outline" textColor={COLORS.danger} borderColor={COLORS.danger} onPress={cancel} /> : null}
        <Button title="العودة إلى جهاتي" variant="ghost" onPress={() => router.replace(ROUTES.myMapPlaces)} />
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.md },
  row: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.sm },
  flex: { flex: 1, gap: SPACING.xxs },
  statusCopy: { marginTop: SPACING.sm },
  copy: { marginTop: SPACING.sm },
  details: { marginTop: SPACING.md, gap: SPACING.sm },
});
