import { StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Chip from "@/src/components/ui/Chip";
import FormSection from "@/src/components/ui/FormSection";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SelectionSheet from "@/src/components/ui/SelectionSheet";
import ToggleField from "@/src/components/ui/ToggleField";
import { COLORS, LAYOUT, SPACING } from "@/src/theme";

import {
  ORGANIZATION_ACTIVITY_OPTIONS,
  ORGANIZATION_ANIMAL_OPTIONS,
  ORGANIZATION_GOVERNORATE_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
} from "../constants/organizationData";
import { useOrganizationDataForm } from "../hooks/useOrganizationDataForm";

/** البيانات الرسمية للجمعية — تقابل «تعديل الحساب» في الحساب الشخصي. */
export default function OrganizationDataScreen() {
  const state = useOrganizationDataForm();
  const { form, errors, fieldNavigation } = state;

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ScreenHeader
        title="بيانات الجمعية"
        subtitle="المعلومات الرسمية التي يعتمدها فريق ResQ ويظهر جزء منها في الملف العام"
        onBack={state.cancel}
      />

      <View style={styles.content}>
        <FormValidationSummary errors={state.validationErrors} />

        <FormSection title="الهوية الرسمية" subtitle="اسم الجمعية وترخيصها كما ورد في الوثائق المعتمدة.">
          <Input
            ref={fieldNavigation.ref("name")}
            label="اسم الجمعية"
            required
            value={form.name}
            onChangeText={(value) => state.update("name", value)}
            error={errors.name}
            {...fieldNavigation.nextProps("name", "licenseNumber")}
          />
          <Input
            label="نوع الجهة"
            value={form.entityType}
            readOnly
            icon="chevron-down"
            onIconPress={state.openEntityTypePicker}
          />
          <Input
            ref={fieldNavigation.ref("licenseNumber")}
            label="رقم الترخيص"
            required
            value={form.licenseNumber}
            onChangeText={(value) => state.update("licenseNumber", value)}
            error={errors.licenseNumber}
            contentDirection="ltr"
            {...fieldNavigation.nextProps("licenseNumber", "issuingAuthority")}
          />
          <Input
            ref={fieldNavigation.ref("issuingAuthority")}
            label="الجهة المانحة للترخيص"
            required
            value={form.issuingAuthority}
            onChangeText={(value) => state.update("issuingAuthority", value)}
            error={errors.issuingAuthority}
            {...fieldNavigation.nextProps("issuingAuthority", "description")}
          />
        </FormSection>

        <FormSection title="التعريف بالجمعية" subtitle="نبذة قصيرة تظهر للمستخدمين في الملف العام.">
          <Input
            ref={fieldNavigation.ref("description")}
            label="نبذة تعريفية"
            required
            value={form.description}
            onChangeText={(value) => state.update("description", value.slice(0, state.descriptionMaxLength))}
            error={errors.description}
            multiline
            inputStyle={styles.description}
          />
          <AppText variant="caption" color={COLORS.textSecondary}>
            {state.descriptionCharCount} / {state.descriptionMaxLength}
          </AppText>
        </FormSection>

        <FormSection title="بيانات التواصل" subtitle="القنوات التي يصل عبرها المستخدمون والمتطوعون إلى الجمعية.">
          <Input
            ref={fieldNavigation.ref("email")}
            label="البريد الإلكتروني"
            required
            value={form.email}
            onChangeText={(value) => state.update("email", value)}
            error={errors.email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            {...fieldNavigation.nextProps("email", "phone")}
          />
          <Input
            ref={fieldNavigation.ref("phone")}
            label="رقم الهاتف"
            required
            prefix="+963"
            value={form.phone}
            onChangeText={(value) => state.update("phone", value.replace(/\D/g, ""))}
            error={errors.phone}
            keyboardType="phone-pad"
            {...fieldNavigation.nextProps("phone", "website")}
          />
          <Input
            ref={fieldNavigation.ref("website")}
            label="الموقع الإلكتروني"
            placeholder="مثال: resq.sy"
            value={form.website}
            onChangeText={(value) => state.update("website", value)}
            keyboardType="url"
            autoCapitalize="none"
            {...fieldNavigation.nextProps("website", "district")}
          />
        </FormSection>

        <FormSection title="نطاق العمل" subtitle="المنطقة التي تغطيها فرق الجمعية ميدانياً.">
          <Input
            label="المحافظة"
            value={form.governorate}
            readOnly
            icon="chevron-down"
            onIconPress={state.openGovernoratePicker}
          />
          <Input
            ref={fieldNavigation.ref("district")}
            label="المنطقة"
            required
            value={form.district}
            onChangeText={(value) => state.update("district", value)}
            error={errors.district}
            {...fieldNavigation.nextProps("district", "address")}
          />
          <Input
            ref={fieldNavigation.ref("address")}
            label="العنوان التفصيلي"
            placeholder="الشارع وأقرب معلم معروف"
            value={form.address}
            onChangeText={(value) => state.update("address", value)}
            {...fieldNavigation.nextProps("address", "workingHours")}
          />
        </FormSection>

        <FormSection title="الأنشطة وأنواع الحيوانات" subtitle="تحدد ما يظهر للمستخدمين ضمن خدمات الجمعية.">
          <AppText variant="label" weight="medium">أنشطة الجمعية</AppText>
          <View style={styles.chipsRow}>
            {ORGANIZATION_ACTIVITY_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                icon={option.icon}
                selected={form.activities.includes(option.id)}
                onPress={() => state.toggleFromList("activities", option.id)}
              />
            ))}
          </View>
          {errors.activities ? <AppText variant="caption" color={COLORS.danger}>{errors.activities}</AppText> : null}

          <AppText variant="label" weight="medium" style={styles.subFieldLabel}>الحيوانات المستقبَلة</AppText>
          <View style={styles.chipsRow}>
            {ORGANIZATION_ANIMAL_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                icon={option.icon}
                color={COLORS.info}
                selected={form.animals.includes(option.id)}
                onPress={() => state.toggleFromList("animals", option.id)}
              />
            ))}
          </View>
          {errors.animals ? <AppText variant="caption" color={COLORS.danger}>{errors.animals}</AppText> : null}
        </FormSection>

        <FormSection title="قدرات التشغيل" subtitle="تُستخدم في توزيع بلاغات الإنقاذ وطلبات الانضمام.">
          <Input
            ref={fieldNavigation.ref("workingHours")}
            label="ساعات العمل"
            required
            value={form.workingHours}
            onChangeText={(value) => state.update("workingHours", value)}
            error={errors.workingHours}
            {...fieldNavigation.nextProps("workingHours", form.hasShelter ? "shelterCapacity" : undefined)}
          />
          <ToggleField
            label="هل تتوفر لديكم منشأة إيواء؟"
            description="أضف سعة المأوى إذا كانت الجمعية تمتلك مكاناً لاستقبال الحالات."
            value={form.hasShelter}
            onValueChange={(value) => state.update("hasShelter", value)}
          />
          {form.hasShelter ? (
            <Input
              ref={fieldNavigation.ref("shelterCapacity")}
              label="سعة المأوى"
              required
              value={form.shelterCapacity}
              onChangeText={(value) => state.update("shelterCapacity", value.replace(/\D/g, ""))}
              error={errors.shelterCapacity}
              keyboardType="number-pad"
              {...fieldNavigation.doneProps()}
            />
          ) : null}
          <ToggleField
            label="تستقبلون متطوعين؟"
            description="يمكن للمستخدمين إرسال طلبات انضمام للجمعية."
            value={form.acceptsVolunteers}
            onValueChange={(value) => state.update("acceptsVolunteers", value)}
          />
        </FormSection>

        <ActionStack>
          <Button title="حفظ التغييرات" onPress={state.save} />
          <Button title="إلغاء" variant="outline" onPress={state.cancel} />
        </ActionStack>
      </View>

      <SelectionSheet
        visible={state.entityTypePickerVisible}
        title="نوع الجهة"
        options={ORGANIZATION_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
        selectedValue={form.entityType}
        onSelect={(value) => state.update("entityType", value)}
        onClose={state.closeEntityTypePicker}
      />
      <SelectionSheet
        visible={state.governoratePickerVisible}
        title="المحافظة"
        options={ORGANIZATION_GOVERNORATE_OPTIONS.map((option) => ({ value: option, label: option }))}
        selectedValue={form.governorate}
        onSelect={(value) => state.update("governorate", value)}
        onClose={state.closeGovernoratePicker}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0, paddingBottom: SPACING.xl },
  content: {
    width: "100%",
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  description: { minHeight: 96 },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  subFieldLabel: { marginTop: SPACING.sm },
});
