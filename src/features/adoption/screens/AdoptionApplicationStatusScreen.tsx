import { Linking, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { useSession } from "@/src/features/session/SessionContext";
import { COLORS, SPACING } from "@/src/theme";
import { useAdoptionApplicationDetails } from "../hooks/useAdoptionApplicationDetails";
import { useAcceptedAdoptionContact } from "../hooks/useAcceptedAdoptionContact";

const HOUSING_LABEL = { apartment: "شقة", house: "منزل", farm: "مزرعة", other: "أخرى" } as const;

const STATUS_COPY = {
  pending: { label: "قيد المراجعة", color: COLORS.warning, title: "تم إرسال طلبك", description: "صاحب الحيوان يراجع طلبات التبني. ستصلك نتيجة الطلب عند اتخاذ القرار." },
  accepted: { label: "تم القبول", color: COLORS.success, title: "تم قبول طلبك", description: "تم اختيارك للتبني. أصبحت معلومات التواصل وموقع التسليم متاحة لك الآن." },
  completed: { label: "اكتمل التبني", color: COLORS.success, title: "اكتملت عملية التبني", description: "تم تأكيد تسليم واستلام الحيوان من الطرفين وإغلاق العملية بنجاح." },
  rejected: { label: "مرفوض", color: COLORS.danger, title: "لم تتم الموافقة على الطلب", description: "يمكنك استكشاف حالات تبنٍ أخرى مناسبة لك." },
  not_selected: { label: "لم يتم الاختيار", color: COLORS.textMuted, title: "تم اختيار متقدم آخر", description: "نشكر اهتمامك. يمكنك التقدم لحالات تبنٍ أخرى." },
  withdrawn: { label: "تم السحب", color: COLORS.textMuted, title: "تم سحب الطلب", description: "هذا الطلب لم يعد نشطًا." },
} as const;

export default function AdoptionApplicationStatusScreen() {
  const router = useRouter();
  const { account } = useSession();
  const state = useAdoptionApplicationDetails(account?.id);
  const contactState = useAcceptedAdoptionContact(state.application?.id, account?.id);
  const decision = useDecisionDialog();

  if (state.loading) return <Screen><LoadingState label="جاري تحميل حالة الطلب..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.application) return <Screen><EmptyState title="الطلب غير موجود" description="قد لا يكون هذا الطلب تابعًا لحسابك." /></Screen>;

  const application = state.application;
  const copy = STATUS_COPY[application.status];
  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <ScreenHeader title="حالة طلب التبني" onBack={() => router.back()} />
      <View style={styles.body}>
        <Card disabled style={styles.hero}>
          <StatusBadge label={copy.label} color={copy.color} />
          <AppText variant="h2" weight="bold">{copy.title}</AppText>
          <AppText color={COLORS.textSecondary}>{copy.description}</AppText>
        </Card>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">ملخص طلبك</AppText>
          <AppText color={COLORS.textSecondary}>الاسم: {application.applicantName}</AppText>
          <AppText color={COLORS.textSecondary}>المدينة: {application.city}</AppText>
          <AppText color={COLORS.textSecondary}>السكن: {HOUSING_LABEL[application.housing]}</AppText>
          <AppText color={COLORS.textSecondary}>حيوانات أخرى: {application.hasOtherPets ? "نعم" : "لا"}</AppText>
          <AppText color={COLORS.textSecondary}>سبب التبني: {application.reason}</AppText>
        </Card>

        {["accepted", "completed"].includes(application.status) && contactState.contactAccess ? (
          <Card disabled style={styles.contactCard}>
            <AppText variant="h3" weight="bold" color={COLORS.success}>التواصل والتسليم</AppText>
            <AppText color={COLORS.textSecondary}>جهة التواصل: {contactState.contactAccess.contact.name}</AppText>
            <AppText color={COLORS.textSecondary}>الهاتف: {contactState.contactAccess.contact.phone}</AppText>
            <AppText color={COLORS.textSecondary}>الموقع: {contactState.contactAccess.location.address}</AppText>
            <View style={styles.actions}>
              <Button title="اتصال الآن" icon="call-outline" onPress={() => void Linking.openURL(`tel:${contactState.contactAccess!.contact.phone.replace(/\s/g, "")}`)} />
              <Button title="فتح الموقع" icon="navigate-outline" variant="outline" onPress={() => void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${contactState.contactAccess!.location.latitude},${contactState.contactAccess!.location.longitude}`)} />
            </View>
          </Card>
        ) : !["accepted", "completed"].includes(application.status) ? (
          <Card disabled style={styles.lockedCard}>
            <AppText variant="h3" weight="bold">معلومات التواصل محمية</AppText>
            <AppText color={COLORS.textSecondary}>رقم صاحب الحيوان وموقع التسليم لا يظهران قبل قبول طلب التبني.</AppText>
          </Card>
        ) : null}

        {application.status === "accepted" ? (
          <Card disabled style={styles.handoverCard}>
            <AppText variant="h3" weight="bold">تأكيد استلام الحيوان</AppText>
            <AppText color={COLORS.textSecondary}>
              بعد إتمام التسليم فعليًا، أكّد الاستلام. لن تُغلق عملية التبني نهائيًا حتى يؤكد صاحب الحيوان التسليم أيضًا.
            </AppText>
            <AppText variant="caption" color={application.applicantHandoverConfirmedAt ? COLORS.success : COLORS.textMuted}>
              {application.applicantHandoverConfirmedAt ? "✓ تم تأكيد الاستلام من طرفك" : "بانتظار تأكيدك"}
            </AppText>
            <AppText variant="caption" color={application.ownerHandoverConfirmedAt ? COLORS.success : COLORS.textMuted}>
              {application.ownerHandoverConfirmedAt ? "✓ صاحب الحيوان أكد التسليم" : "بانتظار تأكيد صاحب الحيوان"}
            </AppText>
            {!application.applicantHandoverConfirmedAt ? (
              <Button
                title="تأكيد استلام الحيوان"
                icon="checkmark-done-outline"
                loading={state.confirmingHandover}
                onPress={() => decision.request(
                  {
                    title: "تأكيد الاستلام",
                    message: "استخدم هذا الإجراء فقط بعد استلام الحيوان فعليًا.",
                    confirmLabel: "تأكيد الاستلام",
                    cancelLabel: "إلغاء",
                  },
                  () => state.confirmHandover(),
                )}
              />
            ) : null}
          </Card>
        ) : null}

        {application.status === "completed" ? (
          <Card disabled style={styles.completedCard}>
            <AppText variant="h3" weight="bold" color={COLORS.success}>تم إتمام التبني</AppText>
            <AppText color={COLORS.textSecondary}>
              تم تأكيد التسليم من الطرفين، وأُغلق الإعلان نهائيًا كحالة تبنٍ مكتملة.
            </AppText>
          </Card>
        ) : null}
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.md },
  hero: { gap: SPACING.sm },
  card: { gap: SPACING.sm },
  lockedCard: { gap: SPACING.sm, backgroundColor: COLORS.surfaceSubtle },
  contactCard: { gap: SPACING.md, backgroundColor: COLORS.successSoft },
  actions: { gap: SPACING.sm },
  handoverCard: { gap: SPACING.sm, backgroundColor: COLORS.surfaceSubtle },
  completedCard: { gap: SPACING.sm, backgroundColor: COLORS.successSoft },
});
