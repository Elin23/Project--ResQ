import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useMemo, useState } from "react";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { DEFAULT_PROFILE } from "@/src/features/profile/constants/profile";
import { useSession } from "@/src/features/session/SessionContext";
import { donationTransferSubmittedRoute } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { DONATION_TRANSFER_PROVIDERS } from "../constants/transferProviders";
import { useDonationCampaignDetails } from "../hooks/useDonationCampaignDetails";

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

export default function DonationCheckoutEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; amount?: string; supportMessage?: string; accountKind?: "user" | "organization" }>();
  const { account, accountKind } = useSession();
  const returnAccountKind = accountKind ?? (params.accountKind === "organization" ? params.accountKind : null);
  const state = useDonationCampaignDetails(params.id);
  const amount = Number(params.amount ?? 0);
  const [providerId, setProviderId] = useState(DONATION_TRANSFER_PROVIDERS[0].id);
  const [senderFullName, setSenderFullName] = useState(
    account?.kind === "user" ? `${DEFAULT_PROFILE.firstName} ${DEFAULT_PROFILE.lastName}` : "",
  );
  const [senderMobile, setSenderMobile] = useState(
    account?.kind === "user" ? DEFAULT_PROFILE.phone : "",
  );
  const [senderGovernorate, setSenderGovernorate] = useState(
    account?.kind === "user" ? DEFAULT_PROFILE.city : "",
  );
  const [transferNumber, setTransferNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validationErrors = useMemo(() => {
    const next: string[] = [];
    if (!senderFullName.trim()) next.push("أدخل الاسم الثلاثي للمرسل كما يظهر في الحوالة.");
    if (!transferNumber.trim()) next.push("رقم الحوالة أو العملية مطلوب.");
    if (!senderGovernorate.trim()) next.push("المحافظة مطلوبة.");
    if (!Number.isFinite(amount) || amount <= 0) next.push("مبلغ التبرع غير صالح؛ ارجع إلى الحملة واختر مبلغًا صحيحًا.");
    return next;
  }, [amount, senderFullName, senderGovernorate, transferNumber]);

  const provider = useMemo(
    () => DONATION_TRANSFER_PROVIDERS.find((item) => item.id === providerId) ?? DONATION_TRANSFER_PROVIDERS[0],
    [providerId],
  );

  if (state.loading) return <Screen><LoadingState label="جاري تجهيز الحوالة..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.campaign) return <Screen><EmptyState title="الحملة غير موجودة" description="لا يمكن متابعة التبرع لهذه الحملة." /></Screen>;

  const campaign = state.campaign;

  const submit = async () => {
    setShowValidation(true);
    setSubmissionError(null);
    if (validationErrors.length) return;

    setSubmitting(true);
    try {
      const transfer = await repositories.donationTransfers.submit({
        campaignId: campaign.id,
        donorAccountId: account?.id,
        donorDisplayName: account?.displayName,
        senderFullName,
        senderMobile: senderMobile.trim() || undefined,
        senderGovernorate,
        transferProviderId: provider.id,
        transferProviderName: provider.name,
        transferNumber,
        amount,
        supportMessage: params.supportMessage,
        notifyOnStatusChange: true,
      });
      router.replace(donationTransferSubmittedRoute(transfer.verificationCode, returnAccountKind));
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "تعذر إرسال بيانات الحوالة. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.screenContent}>
      <ScreenHeader title="تأكيد الحوالة" onBack={() => router.back()} />
      <View style={styles.body}>
        <Card disabled style={styles.campaignCard}>
          <View style={styles.campaignIcon}><Ionicons name="heart-outline" size={24} color={COLORS.primaryStrong} /></View>
          <View style={styles.flex}>
            <AppText variant="caption" color={COLORS.textSecondary}>{campaign.ownerDisplayName}</AppText>
            <AppText variant="h3" weight="bold">{campaign.title}</AppText>
            <AppText variant="h2" weight="bold" color={COLORS.primaryStrong}>{money(amount)}</AppText>
          </View>
        </Card>

        <Card disabled backgroundColor={COLORS.surfaceSubtle} style={styles.instructions}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="help-circle-outline" size={21} color={COLORS.primaryStrong} />
            <AppText variant="h3" weight="bold" color={COLORS.primaryStrong}>طريقة التبرع</AppText>
          </View>
          {[
            "اختر شركة الحوالات المناسبة لك.",
            "أرسل المبلغ إلى بيانات المستلم الموضحة أدناه.",
            "احتفظ بإيصال الحوالة ورقم العملية.",
            "أدخل بيانات الحوالة في النموذج أدناه لتأكيد تبرعك.",
          ].map((text, index) => (
            <View key={text} style={styles.stepRow}>
              <View style={styles.stepBadge}><AppText variant="caption" weight="bold">{index + 1}</AppText></View>
              <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.flex}>{text}</AppText>
            </View>
          ))}
        </Card>

        <AppText variant="h3" weight="bold">اختر شركة الحوالات</AppText>
        <View style={styles.providers}>
          {DONATION_TRANSFER_PROVIDERS.map((item) => {
            const selected = item.id === provider.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setProviderId(item.id)}
                style={({ pressed }) => [
                  styles.provider,
                  selected && styles.providerSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
                <AppText variant="label" weight={selected ? "bold" : "medium"} align="center">{item.name}</AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.recipientHeader}>
          <AppText variant="h3" weight="bold">بيانات مستلم الحوالة</AppText>
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={15} color={COLORS.success} />
            <AppText variant="caption" weight="bold" color={COLORS.success}>بيانات التحويل الرسمية</AppText>
          </View>
        </View>

        <Card disabled borderColor={COLORS.success} style={styles.recipientCard}>
          <DataRow label="الاسم بالكامل" value={campaign.paymentRecipient.fullName} />
          {campaign.paymentRecipient.mobile ? <DataRow label="رقم الموبايل" value={campaign.paymentRecipient.mobile} /> : null}
          <DataRow label="المحافظة" value={campaign.paymentRecipient.governorate} />
          <View style={styles.recipientWarning}>
            <Ionicons name="warning-outline" size={20} color={COLORS.danger} />
            <AppText variant="caption" color={COLORS.danger} style={styles.flex}>يرجى إرسال المبلغ حصراً إلى البيانات الموضحة أعلاه.</AppText>
          </View>
        </Card>

        <AppText variant="h3" weight="bold">بيانات الحوالة المرسلة</AppText>
        <FormValidationSummary errors={showValidation ? validationErrors : []} />
        {submissionError ? <FormValidationSummary title="تعذر إرسال الحوالة" errors={[submissionError]} /> : null}
        <Input label="الاسم الثلاثي للمرسل" required error={showValidation && !senderFullName.trim() ? "الاسم الثلاثي مطلوب كما يظهر في الإيصال." : undefined} value={senderFullName} onChangeText={setSenderFullName} placeholder="أدخل اسمك كما ورد في إيصال الحوالة" />
        <Input label="رقم الحوالة" required error={showValidation && !transferNumber.trim() ? "أدخل رقم العملية الموجود في إيصال التحويل." : undefined} value={transferNumber} onChangeText={setTransferNumber} placeholder="أدخل رقم العملية الموجود في الإيصال" contentDirection="ltr" />
        <Input label="رقم الموبايل (اختياري)" value={senderMobile} onChangeText={setSenderMobile} keyboardType="phone-pad" placeholder="رقم للتواصل عند الحاجة" contentDirection="ltr" />
        <Input label="المحافظة" required error={showValidation && !senderGovernorate.trim() ? "المحافظة مطلوبة." : undefined} value={senderGovernorate} onChangeText={setSenderGovernorate} placeholder="المحافظة" />

        <View style={styles.readOnlyField}>
          <AppText variant="caption" color={COLORS.textSecondary}>شركة الحوالات المختارة</AppText>
          <AppText weight="medium">{provider.name}</AppText>
        </View>
        <View style={styles.readOnlyField}>
          <AppText variant="caption" color={COLORS.textSecondary}>مبلغ الحوالة</AppText>
          <AppText variant="h3" weight="bold" color={COLORS.primaryStrong}>{money(amount)}</AppText>
        </View>

        <Card disabled backgroundColor={COLORS.primarySoft} style={styles.reviewNotice}>
          <Ionicons name="information-circle-outline" size={22} color={COLORS.primaryStrong} />
          <View style={styles.flex}>
            <AppText variant="bodySmall">سيتم مراجعة بيانات الحوالة قبل اعتماد التبرع. يرجى التأكد من صحة الاسم الثلاثي ورقم الحوالة.</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>تستخدم هذه البيانات للتحقق من الحوالة فقط.</AppText>
          </View>
        </Card>

        <Button title="إرسال بيانات الحوالة" loading={submitting} onPress={submit} />
        <Button title="إلغاء" variant="ghost" disabled={submitting} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataRow}>
      <View style={styles.flex}>
        <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
        <AppText weight="medium" selectable>{value}</AppText>
      </View>
      {label.includes("المحافظة") ? <Ionicons name="location-outline" size={20} color={COLORS.primaryStrong} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  campaignCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  campaignIcon: { width: 58, height: 58, borderRadius: RADIUS.md, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  instructions: { gap: SPACING.md },
  sectionTitleRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  stepRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  stepBadge: { width: 26, height: 26, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  providers: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  provider: { flex: 1, minHeight: 92, borderWidth: 1, borderColor: COLORS.borderStrong, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center", gap: SPACING.sm, padding: SPACING.md },
  providerSelected: { borderWidth: 2, borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft },
  radio: { width: 22, height: 22, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.borderStrong, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: COLORS.primaryStrong },
  radioDot: { width: 10, height: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryStrongFill },
  recipientHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm, flexWrap: "wrap" },
  officialBadge: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.successSoft },
  recipientCard: { gap: SPACING.sm },
  dataRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.divider },
  recipientWarning: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, padding: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.dangerSoft },
  readOnlyField: { minHeight: 66, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceSubtle, padding: SPACING.md, gap: SPACING.xs, justifyContent: "center" },
  reviewNotice: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  flex: { flex: 1 },
});
