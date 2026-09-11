import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Chip from "@/src/components/ui/Chip";
import ErrorState from "@/src/components/ui/ErrorState";
import FormSection from "@/src/components/ui/FormSection";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import RemoteImage from "@/src/components/ui/RemoteImage";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import OpeningHoursEditor from "@/src/features/map-places/components/OpeningHoursEditor";
import { COLORS, LAYOUT, RADIUS, SPACING } from "@/src/theme";

import { ORGANIZATION_ACTIVITY_OPTIONS } from "../constants/organizationData";
import { useOrganizationDataForm } from "../hooks/useOrganizationDataForm";

export default function OrganizationDataScreen() {
  const state = useOrganizationDataForm();

  if (state.loading) {
    return <Screen surface="app"><ScreenHeader title="بيانات الجمعية" onBack={state.cancel} /><LoadingState label="جاري تحميل بيانات الجمعية..." /></Screen>;
  }
  if (state.errors.general && !state.identity.name) {
    return <Screen surface="app"><ScreenHeader title="بيانات الجمعية" onBack={state.cancel} /><ErrorState description={state.errors.general} onRetry={() => { void state.load(); }} /></Screen>;
  }

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ScreenHeader
        title="بيانات الجمعية"
        subtitle="البيانات الرسمية من الخادم، والتعديلات التشغيلية التي يمكن حفظها مباشرة"
        onBack={state.cancel}
      />

      <View style={styles.content}>
        <FormValidationSummary errors={state.validationErrors} />

        <FormSection title="الهوية الرسمية" subtitle="هذه البيانات مرتبطة بطلب اعتماد الجمعية ولا تُعدّل محليًا.">
          <Input label="اسم الجمعية" value={state.identity.name} readOnly />
          <Input label="رقم الترخيص" value={state.identity.licenseNumber || "غير مسجل"} readOnly contentDirection="ltr" />
          {state.identity.registrationNumber ? <Input label="رقم التسجيل" value={state.identity.registrationNumber} readOnly contentDirection="ltr" /> : null}
          <Input label="البريد الإلكتروني" value={state.identity.email || "غير مسجل"} readOnly contentDirection="ltr" />
        </FormSection>

        <FormSection title="الشعار" subtitle="يتم رفع الشعار إلى الخادم ويظهر في الملف العام بعد الحفظ.">
          <Pressable accessibilityRole="button" accessibilityLabel="تغيير شعار الجمعية" onPress={() => { void state.pickLogo(); }} style={styles.logoRow}>
            <RemoteImage uri={state.form.logoUri || undefined} style={styles.logo} accessibilityLabel="شعار الجمعية" />
            <View style={styles.logoCopy}>
              <AppText weight="bold">تغيير شعار الجمعية</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>اضغط لاختيار صورة من الجهاز</AppText>
            </View>
            <Ionicons name="camera-outline" size={22} color={COLORS.primaryStrong} />
          </Pressable>
        </FormSection>

        <FormSection title="التعريف بالجمعية" subtitle="النبذة التي تظهر للمستخدمين في الملف العام.">
          <Input
            label="نبذة تعريفية"
            required
            value={state.form.description}
            onChangeText={(value) => state.update("description", value.slice(0, state.descriptionMaxLength))}
            error={state.errors.description}
            multiline
            inputStyle={styles.description}
          />
          <AppText variant="caption" color={COLORS.textSecondary}>{state.descriptionCharCount} / {state.descriptionMaxLength}</AppText>
        </FormSection>

        <FormSection title="بيانات التواصل" subtitle="هذه القنوات تظهر في بيانات الجمعية العامة.">
          <Input
            label="رقم الهاتف"
            value={state.form.phone}
            onChangeText={(value) => state.update("phone", value)}
            error={state.errors.phone}
            keyboardType="phone-pad"
            contentDirection="ltr"
          />
          <Input
            label="الموقع الإلكتروني"
            placeholder="https://example.org"
            value={state.form.website}
            onChangeText={(value) => state.update("website", value)}
            error={state.errors.website}
            keyboardType="url"
            autoCapitalize="none"
            contentDirection="ltr"
          />
        </FormSection>

        <FormSection title="الموقع المعتمد" subtitle="تغيير موقع جمعية معتمدة يحتاج مراجعة إدارية؛ لذلك يظهر هنا للقراءة فقط.">
          <Input label="المحافظة" value={state.identity.governorateName || "غير محددة"} readOnly />
          <Input label="المنطقة" value={state.identity.regionName || "غير محددة"} readOnly />
          <Input label="العنوان" value={state.identity.address || "غير محدد"} readOnly multiline />
        </FormSection>

        <FormSection title="خدمات الجمعية" subtitle="اختر الخدمات الفعلية التي تقدمها الجمعية.">
          <View style={styles.chipsRow}>
            {ORGANIZATION_ACTIVITY_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                icon={option.icon}
                selected={state.form.activities.includes(option.id)}
                onPress={() => state.toggleActivity(option.id)}
              />
            ))}
          </View>
          {state.errors.activities ? <AppText variant="caption" color={COLORS.danger}>{state.errors.activities}</AppText> : null}
        </FormSection>

        <FormSection title="أوقات الدوام" subtitle="هذه الساعات محفوظة في حساب الجمعية وتظهر للزوار.">
          <OpeningHoursEditor value={state.form.openingHours} onChange={(value) => state.update("openingHours", value)} />
          {state.errors.openingHours ? <AppText variant="caption" color={COLORS.danger}>{state.errors.openingHours}</AppText> : null}
        </FormSection>

        <ActionStack>
          <Button title={state.saving ? "جارٍ حفظ التغييرات..." : "حفظ التغييرات"} loading={state.saving} disabled={state.saving} onPress={() => { void state.save(); }} />
          <Button title="إلغاء" variant="outline" onPress={state.cancel} disabled={state.saving} />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0, paddingBottom: SPACING.xl },
  content: {
    width: "100%", maxWidth: LAYOUT.contentMaxWidth, alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg, gap: SPACING.lg,
  },
  description: { minHeight: 110 },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  logoRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg },
  logo: { width: 66, height: 66, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceSubtle },
  logoCopy: { flex: 1, minWidth: 0, gap: 4 },
});
