import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SectionHeader from "@/src/components/ui/SectionHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { useSession } from "@/src/features/session/SessionContext";
import { COLORS, SPACING } from "@/src/theme";
import { useOwnerAdoptionApplication } from "../hooks/useOwnerAdoptionApplication";

const HOUSING_LABEL = { apartment: "شقة", house: "منزل", farm: "مزرعة", other: "أخرى" } as const;
const STATUS_META = {
  pending: { label: "قيد المراجعة", color: COLORS.warning },
  accepted: { label: "تم القبول", color: COLORS.success },
  completed: { label: "اكتمل التبني", color: COLORS.success },
  rejected: { label: "مرفوض", color: COLORS.danger },
  not_selected: { label: "لم يتم الاختيار", color: COLORS.textMuted },
  withdrawn: { label: "مسحوب", color: COLORS.textMuted },
} as const;

export default function OwnerAdoptionApplicationDetailsScreen() {
  const router = useRouter();
  const { id, applicationId } = useLocalSearchParams<{ id: string; applicationId: string }>();
  const { account } = useSession();
  const { showFeedback } = useFeedback();
  const decision = useDecisionDialog();
  const state = useOwnerAdoptionApplication(applicationId, id, account?.id);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل طلب التبني..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.application) return <Screen><EmptyState title="الطلب غير موجود" description="قد لا تملك صلاحية الوصول إلى هذا الطلب." /></Screen>;

  const application = state.application;
  const meta = STATUS_META[application.status];

  const accept = () => {
    decision.request(
      { title: "قبول طلب التبني", message: `سيتم اختيار ${application.applicantName} لهذا الحيوان، وإيقاف استقبال الطلبات الجديدة وتحويل بقية الطلبات المعلقة إلى «لم يتم الاختيار».`, confirmLabel: "تأكيد القبول", destructive: false, icon: "checkmark-circle-outline" },
      async () => {
        try {
          await state.accept();
          showFeedback({ title: "تم قبول الطلب", message: "تم حجز الحيوان لهذا المتقدم بنجاح.", tone: "success" });
        } catch (error) {
          showFeedback({ title: "تعذر قبول الطلب", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" });
          throw error;
        }
      },
    );
  };

  const reject = () => {
    decision.request(
      { title: "رفض طلب التبني", message: "سيتم إبلاغ المتقدم بحالة الرفض، ويمكنك متابعة مراجعة الطلبات الأخرى.", confirmLabel: "رفض الطلب", destructive: true, icon: "close-circle-outline" },
      async () => {
        try { await state.reject(); }
        catch (error) {
          showFeedback({ title: "تعذر رفض الطلب", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" });
          throw error;
        }
      },
    );
  };

  const confirmHandover = () => {
    decision.request(
      { title: "تأكيد التسليم", message: "استخدم هذا الإجراء فقط بعد تسليم الحيوان للمتبني فعليًا.", confirmLabel: "تأكيد التسليم", destructive: false, icon: "checkmark-done-outline" },
      async () => { await state.confirmHandover(); },
    );
  };

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="تفاصيل طلب التبني" subtitle={application.applicantName} onBack={() => router.back()} />
      <View style={styles.content}>
        <Card disabled style={styles.summary}>
          <View style={styles.titleRow}>
            <View style={styles.flex}>
              <AppText variant="h2" weight="bold">{application.applicantName}</AppText>
              <AppText color={COLORS.textSecondary}>{application.city}</AppText>
            </View>
            <StatusBadge label={meta.label} color={meta.color} />
          </View>
        </Card>

        <SectionHeader title="بيانات المتقدم" />
        <Card disabled style={styles.card}>
          <Row label="رقم الهاتف" value={application.phone} />
          <Row label="نوع السكن" value={HOUSING_LABEL[application.housing]} />
          <Row label="لديه حيوانات أخرى" value={application.hasOtherPets ? "نعم" : "لا"} />
        </Card>

        <SectionHeader title="الخبرة والدافع" />
        <Card disabled style={styles.card}>
          <Field title="الخبرة في رعاية الحيوانات" value={application.experience} />
          <Field title="سبب الرغبة في التبني" value={application.reason} />
          {application.notes ? <Field title="ملاحظات إضافية" value={application.notes} /> : null}
        </Card>

        {application.status === "accepted" ? (
          <Card disabled style={styles.acceptedCard}>
            <AppText variant="label" weight="bold" color={COLORS.success}>تم اختيار هذا المتقدم</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>
              تم حجز الحيوان وإيقاف استقبال الطلبات الجديدة. يمكنك الآن تنسيق التسليم مع المتبني ثم تأكيد التسليم بعد حدوثه فعليًا.
            </AppText>
          </Card>
        ) : null}

        {application.status === "accepted" ? (
          <Card disabled style={styles.handoverCard}>
            <AppText variant="label" weight="bold">مرحلة التسليم</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>
              أكّد التسليم فقط بعد تسليم الحيوان فعليًا. تكتمل العملية عندما يؤكد المتبني الاستلام أيضًا.
            </AppText>
            <AppText variant="caption" color={application.ownerHandoverConfirmedAt ? COLORS.success : COLORS.textMuted}>
              {application.ownerHandoverConfirmedAt ? "✓ تم تأكيد التسليم من طرفك" : "بانتظار تأكيدك"}
            </AppText>
            <AppText variant="caption" color={application.applicantHandoverConfirmedAt ? COLORS.success : COLORS.textMuted}>
              {application.applicantHandoverConfirmedAt ? "✓ المتبني أكد الاستلام" : "بانتظار تأكيد المتبني"}
            </AppText>
            {!application.ownerHandoverConfirmedAt ? (
              <Button
                title="تأكيد تسليم الحيوان"
                icon="checkmark-done-outline"
                loading={state.confirmingHandover}
                onPress={confirmHandover}
              />
            ) : null}
          </Card>
        ) : null}

        {application.status === "completed" ? (
          <Card disabled style={styles.completedCard}>
            <AppText variant="label" weight="bold" color={COLORS.success}>اكتملت عملية التبني</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>
              أكد الطرفان التسليم والاستلام، وأصبح الحيوان مسجلًا كحالة تبنٍ مكتملة.
            </AppText>
          </Card>
        ) : null}

        {application.status === "pending" ? (
          <ActionStack>
            <Button title="قبول طلب التبني" icon="checkmark-circle-outline" loading={state.deciding} onPress={accept} />
            <Button title="رفض الطلب" icon="close-circle-outline" variant="outline" disabled={state.deciding} onPress={reject} />
          </ActionStack>
        ) : null}
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><AppText variant="caption" color={COLORS.textMuted}>{label}</AppText><AppText variant="bodySmall" weight="medium" style={styles.value}>{value}</AppText></View>;
}
function Field({ title, value }: { title: string; value: string }) {
  return <View style={styles.field}><AppText variant="caption" color={COLORS.textMuted}>{title}</AppText><AppText variant="bodySmall">{value}</AppText></View>;
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md },
  summary: { gap: SPACING.sm },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  card: { gap: SPACING.md },
  row: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", alignItems: "flex-start", gap: SPACING.md },
  field: { gap: SPACING.xs, alignItems: "stretch" },
  value: { flex: 1, textAlign: "right" },
  acceptedCard: { gap: SPACING.sm, backgroundColor: COLORS.successSoft },
  handoverCard: { gap: SPACING.sm, backgroundColor: COLORS.surfaceSubtle },
  completedCard: { gap: SPACING.sm, backgroundColor: COLORS.successSoft },
  flex: { flex: 1 },
});
