import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useSession } from "@/src/features/session/SessionContext";
import {
  formatSyrianMobileInternational,
  normalizeSyrianMobile,
  validateSyrianMobile,
} from "@/src/features/auth/utils/registrationValidation";
import { donationTransferSubmittedRoute } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { apiRequest } from "@/src/services/api/client";
import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import type { TransferProviderDto } from "@/src/contracts/backend/donations";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationTransferProvider } from "../constants/transferProviders";
import { useDonationCampaignDetails } from "../hooks/useDonationCampaignDetails";

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function mapProvider(item: TransferProviderDto): DonationTransferProvider {
  return {
    id: String(item.id),
    code: item.code,
    name: item.name || item.code,
    shortName: item.name || item.code,
    instructions: item.instructions?.trim() || undefined,
    recipientName: item.recipientName?.trim() || undefined,
    recipientAccount: item.recipientAccount?.trim() || undefined,
  };
}

export default function DonationCheckoutEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; amount?: string; supportMessage?: string; accountKind?: "user" | "organization" }>();
  const { account, accountKind } = useSession();
  const returnAccountKind = accountKind ?? (params.accountKind === "organization" ? params.accountKind : null);
  const state = useDonationCampaignDetails(params.id);
  const amount = Number(params.amount ?? 0);
  const [providers, setProviders] = useState<DonationTransferProvider[]>([]);
  const [providerId, setProviderId] = useState("");
  const [governorates, setGovernorates] = useState<{ id: string; name: string }[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [governorateSheetVisible, setGovernorateSheetVisible] = useState(false);
  const [senderGovernorateId, setSenderGovernorateId] = useState<string | undefined>();
  const [senderFullName, setSenderFullName] = useState(account?.displayName ?? "");
  const [senderMobile, setSenderMobile] = useState(normalizeSyrianMobile(account?.phone ?? ""));
  const [senderGovernorate, setSenderGovernorate] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const loadReferenceData = useCallback(async () => {
    setReferenceLoading(true);
    setReferenceError(null);
    try {
      const [remoteProviders, locations] = await Promise.all([
        apiRequest<TransferProviderDto[]>(API_ENDPOINTS.donations.transferProviders),
        repositories.locationLookups.listGovernorates(),
      ]);
      const mapped = remoteProviders.map(mapProvider).filter((item) => Number(item.id) > 0 && item.name.trim());
      if (!mapped.length) {
        throw new Error("لا توجد شركات حوالات مفعلة حاليًا. يرجى المحاولة لاحقًا أو التواصل مع الدعم.");
      }
      setProviders(mapped);
      setProviderId((current) => (mapped.some((item) => item.id === current) ? current : mapped[0].id));
      setGovernorates(locations);
    } catch (error) {
      setProviders([]);
      setProviderId("");
      setGovernorates([]);
      setReferenceError(error instanceof Error ? error.message : "تعذر تحميل بيانات الحوالات والمحافظات.");
    } finally {
      setReferenceLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReferenceData();
  }, [loadReferenceData]);

  const provider = useMemo(
    () => providers.find((item) => item.id === providerId),
    [providerId, providers],
  );
  const senderMobileError = validateSyrianMobile(senderMobile);
  const providerHasTransferDetails = Boolean(
    provider?.recipientName || provider?.recipientAccount || provider?.instructions,
  );

  const validationErrors = useMemo(() => {
    const next: string[] = [];
    if (!provider) next.push("اختر شركة حوالات مفعلة.");
    else if (!providerHasTransferDetails) next.push("بيانات التحويل لهذا المزود غير مكتملة من الإدارة. اختر مزودًا آخر أو حاول لاحقًا.");
    if (!senderFullName.trim()) next.push("أدخل الاسم الثلاثي للمرسل كما يظهر في الحوالة.");
    if (senderMobileError) next.push(senderMobileError);
    if (!transferNumber.trim()) next.push("رقم الحوالة أو العملية مطلوب.");
    if (!senderGovernorateId) next.push("اختر المحافظة من القائمة المعتمدة.");
    if (!Number.isFinite(amount) || amount <= 0) next.push("مبلغ التبرع غير صالح؛ ارجع إلى الحملة واختر مبلغًا صحيحًا.");
    return next;
  }, [amount, provider, providerHasTransferDetails, senderFullName, senderGovernorateId, senderMobileError, transferNumber]);

  if (state.loading) return <Screen><LoadingState label="جاري تجهيز الحوالة..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.campaign) return <Screen><EmptyState title="الحملة غير موجودة" description="لا يمكن متابعة التبرع لهذه الحملة." /></Screen>;
  if (referenceLoading) return <Screen><LoadingState label="جاري تحميل شركات الحوالات المعتمدة..." /></Screen>;
  if (referenceError || !provider) {
    return (
      <Screen>
        <ScreenHeader title="تأكيد الحوالة" onBack={() => router.back()} />
        <ErrorState
          title="تعذر تجهيز بيانات الحوالة"
          description={referenceError ?? "لا توجد شركة حوالات مفعلة حاليًا."}
          onRetry={() => void loadReferenceData()}
        />
      </Screen>
    );
  }

  const campaign = state.campaign;

  const submit = async () => {
    setShowValidation(true);
    setSubmissionError(null);
    if (validationErrors.length || !provider) return;

    setSubmitting(true);
    try {
      const transfer = await repositories.donationTransfers.submit({
        campaignId: campaign.id,
        donorAccountId: account?.id,
        donorDisplayName: account?.displayName,
        senderFullName: senderFullName.trim(),
        senderMobile: formatSyrianMobileInternational(senderMobile),
        senderGovernorateId,
        senderGovernorate,
        transferProviderId: provider.id,
        transferProviderName: provider.name,
        transferNumber: transferNumber.trim(),
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
            "أرسل المبلغ وفق بيانات المستلم وتعليمات الشركة الظاهرة أدناه.",
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
          {providers.map((item) => {
            const selected = item.id === provider.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setProviderId(item.id)}
                style={({ pressed }) => [styles.provider, selected && styles.providerSelected, pressed && styles.pressed]}
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
          <AppText variant="h3" weight="bold">بيانات التحويل الرسمية</AppText>
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={15} color={COLORS.success} />
            <AppText variant="caption" weight="bold" color={COLORS.success}>من إعدادات الخادم</AppText>
          </View>
        </View>

        <Card disabled borderColor={providerHasTransferDetails ? COLORS.success : COLORS.warning} style={styles.recipientCard}>
          {provider.recipientName ? <DataRow label="اسم المستلم" value={provider.recipientName} /> : null}
          {provider.recipientAccount ? <DataRow label="رقم الحساب / رقم المستلم" value={provider.recipientAccount} /> : null}
          {provider.instructions ? (
            <View style={styles.instructionsText}>
              <AppText variant="caption" color={COLORS.textSecondary}>تعليمات شركة الحوالات</AppText>
              <AppText variant="bodySmall" selectable>{provider.instructions}</AppText>
            </View>
          ) : null}
          <View style={styles.recipientWarning}>
            <Ionicons name="warning-outline" size={20} color={providerHasTransferDetails ? COLORS.danger : COLORS.warning} />
            <AppText variant="caption" color={providerHasTransferDetails ? COLORS.danger : COLORS.warning} style={styles.flex}>
              {providerHasTransferDetails
                ? "استخدم حصراً بيانات التحويل الرسمية الخاصة بالشركة المختارة."
                : "بيانات هذا المزود غير مكتملة. لن يسمح التطبيق بإرسال الحوالة حتى تضبطها الإدارة."}
            </AppText>
          </View>
        </Card>

        <AppText variant="h3" weight="bold">بيانات الحوالة المرسلة</AppText>
        <FormValidationSummary errors={showValidation ? validationErrors : []} />
        {submissionError ? <FormValidationSummary title="تعذر إرسال الحوالة" errors={[submissionError]} /> : null}
        <Input
          label="الاسم الثلاثي للمرسل"
          required
          error={showValidation && !senderFullName.trim() ? "الاسم الثلاثي مطلوب كما يظهر في الإيصال." : undefined}
          value={senderFullName}
          onChangeText={setSenderFullName}
          placeholder="أدخل اسمك كما ورد في إيصال الحوالة"
        />
        <Input
          label="رقم الحوالة"
          required
          error={showValidation && !transferNumber.trim() ? "أدخل رقم العملية الموجود في إيصال التحويل." : undefined}
          value={transferNumber}
          onChangeText={setTransferNumber}
          placeholder="أدخل رقم العملية الموجود في الإيصال"
          contentDirection="ltr"
        />
        <Input
          label="رقم الموبايل"
          required
          prefix="+963"
          value={senderMobile}
          error={showValidation ? senderMobileError : undefined}
          onChangeText={(value) => setSenderMobile(normalizeSyrianMobile(value))}
          keyboardType="phone-pad"
          placeholder="9XXXXXXXX"
          contentDirection="ltr"
          helperText="مطلوب للتحقق من الحوالة عند الحاجة."
        />
        <LocationLookupSelect
          label="المحافظة"
          placeholder="اختر المحافظة"
          required
          value={senderGovernorateId}
          selectedLabel={senderGovernorate}
          options={governorates.map((item) => ({ value: item.id, label: item.name }))}
          visible={governorateSheetVisible}
          error={showValidation && !senderGovernorateId ? "اختر المحافظة من القائمة المعتمدة." : undefined}
          onOpen={() => setGovernorateSheetVisible(true)}
          onClose={() => setGovernorateSheetVisible(false)}
          onSelect={(value) => {
            const selected = governorates.find((item) => item.id === value);
            setSenderGovernorateId(value);
            setSenderGovernorate(selected?.name ?? "");
            setGovernorateSheetVisible(false);
          }}
        />

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
            <AppText variant="bodySmall">سيتم مراجعة بيانات الحوالة قبل اعتماد التبرع. يرجى التأكد من صحة الاسم ورقم الهاتف ورقم الحوالة.</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>تستخدم هذه البيانات للتحقق من الحوالة فقط.</AppText>
          </View>
        </Card>

        <Button title="إرسال بيانات الحوالة" loading={submitting} disabled={submitting || !providerHasTransferDetails} onPress={() => void submit()} />
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
  providers: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  provider: { flexGrow: 1, flexBasis: 140, minHeight: 92, borderWidth: 1, borderColor: COLORS.borderStrong, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center", gap: SPACING.sm, padding: SPACING.md },
  providerSelected: { borderWidth: 2, borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft },
  radio: { width: 22, height: 22, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.borderStrong, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: COLORS.primaryStrong },
  radioDot: { width: 10, height: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryStrong },
  recipientHeader: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm, flexWrap: "wrap" },
  officialBadge: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.successSoft },
  recipientCard: { gap: SPACING.sm },
  dataRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.divider },
  instructionsText: { gap: SPACING.xs, paddingVertical: SPACING.sm },
  recipientWarning: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, padding: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.dangerSoft },
  readOnlyField: { minHeight: 66, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceSubtle, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, justifyContent: "center", gap: SPACING.xxs },
  reviewNotice: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  pressed: { opacity: 0.82 },
  flex: { flex: 1 },
});
