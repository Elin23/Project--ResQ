import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Chip from "@/src/components/ui/Chip";
import FormSection from "@/src/components/ui/FormSection";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import ToggleField from "@/src/components/ui/ToggleField";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import {
  SERVICE_PLACE_TYPE_META,
  validateMapPlaceDraft,
  type DailyOpeningHours,
  type ServicePlaceType,
} from "@/src/domain/service-places";
import MapPlaceLocationPicker, { type MapPlaceLocationValue } from "@/src/features/map-places/components/MapPlaceLocationPicker";
import OpeningHoursEditor, { defaultOpeningHours } from "@/src/features/map-places/components/OpeningHoursEditor";
import { useSession } from "@/src/features/session/SessionContext";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { ROUTES } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, DENSITY, SPACING } from "@/src/theme";

const USER_PLACE_TYPES = ["clinic", "pet_store", "pet_hotel", "cat_cafe", "grooming", "shelter", "other"] as const satisfies readonly Exclude<ServicePlaceType, "organization">[];
type UserPlaceType = (typeof USER_PLACE_TYPES)[number];
const USER_PLACE_ICONS: Record<UserPlaceType, keyof typeof Ionicons.glyphMap> = {
  clinic: "medical-outline",
  pet_store: "bag-handle-outline",
  pet_hotel: "bed-outline",
  cat_cafe: "cafe-outline",
  grooming: "cut-outline",
  shelter: "home-outline",
  other: "location-outline",
};
const DEFAULT_LOCATION: MapPlaceLocationValue = { latitude: 33.5138, longitude: 36.2765 };
const FIELD_KEYS = ["name", "address", "phone", "secondaryPhone", "whatsapp", "website", "responsiblePerson", "licenseNumber"] as const;

export default function MapPlaceApplicationFormScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account } = useSession();
  const fieldNavigation = useFormFieldNavigation(FIELD_KEYS);
  const [type, setType] = useState<UserPlaceType>("clinic");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [supportingDocumentUri, setSupportingDocumentUri] = useState<string | undefined>();
  const [location, setLocation] = useState<MapPlaceLocationValue>(DEFAULT_LOCATION);
  const [openingHours, setOpeningHours] = useState<DailyOpeningHours[]>(() => defaultOpeningHours());
  const [acceptsFreeCases, setAcceptsFreeCases] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationIntent, setValidationIntent] = useState<"draft" | "submit">("submit");


  const validationMessages = useMemo(() => {
    const next: string[] = [];
    if (!name.trim()) next.push("اسم الجهة مطلوب.");
    if (!address.trim()) next.push("عنوان الجهة مطلوب.");
    if (!phone.trim()) next.push("رقم الهاتف الأساسي مطلوب.");
    if (["clinic", "pet_hotel", "grooming", "shelter"].includes(type) && !responsiblePerson.trim()) next.push("بيانات الشخص المسؤول مطلوبة لهذا النوع من الجهات.");
    if (validationIntent === "submit" && type === "clinic" && !licenseNumber.trim()) next.push("رقم ترخيص العيادة مطلوب.");
    if (validationIntent === "submit" && type === "clinic" && !supportingDocumentUri) next.push("صورة إثبات ترخيص العيادة مطلوبة.");
    return next;
  }, [address, licenseNumber, name, phone, responsiblePerson, supportingDocumentUri, type, validationIntent]);

  const hasUnsavedChanges = useMemo(
    () => Boolean(
      type !== "clinic" || name || address || phone || secondaryPhone || whatsapp || website || responsiblePerson || licenseNumber || description || supportingDocumentUri
      || location.latitude !== DEFAULT_LOCATION.latitude || location.longitude !== DEFAULT_LOCATION.longitude
      || acceptsFreeCases || JSON.stringify(openingHours) !== JSON.stringify(defaultOpeningHours()),
    ),
    [acceptsFreeCases, address, description, licenseNumber, location, name, openingHours, phone, responsiblePerson, secondaryPhone, supportingDocumentUri, type, website, whatsapp],
  );
  const saveDraftBeforeExit = async () => {
    setValidationIntent("draft");
    const validationError = validateMapPlaceDraft(
      { requestedType: type, name, address, phone, latitude: location.latitude, longitude: location.longitude, responsiblePerson, licenseNumber, supportingDocumentUri, openingHours },
      { forSubmission: false },
    );
    if (validationError) {
      setShowValidation(true);
      focusFirstInvalidField(false);
      showFeedback({ title: "تعذر حفظ المسودة", message: validationError, tone: "warning" });
      return false;
    }
    if (!account || account.kind !== "user") return false;
    try {
      setSaving(true);
      await repositories.mapPlaceApplications.createDraft({
        applicantUserId: account.id,
        requestedType: type,
        name: name.trim(),
        description: description.trim() || undefined,
        address: address.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
        responsiblePerson: responsiblePerson.trim() || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        supportingDocumentUri,
        openingHours,
        acceptsFreeCases,
      });
      showFeedback({ title: "تم حفظ المسودة", message: "يمكنك استكمال طلب الجهة لاحقًا من صفحة جهاتي على الخريطة.", tone: "success" });
      return true;
    } catch (error) {
      showFeedback({ title: "تعذر حفظ المسودة", message: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المسودة. حاول مرة أخرى.", tone: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const { allowNextNavigation } = useUnsavedChangesGuard(hasUnsavedChanges && !saving, {
    message: "يمكنك حفظ طلب الجهة كمسودة قبل الخروج، أو تجاهل التغييرات الحالية.",
    saveDraftLabel: "حفظ كمسودة والخروج",
    onSaveDraft: saveDraftBeforeExit,
  });

  const chooseProof = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85, allowsEditing: false });
    if (!result.canceled && result.assets[0]?.uri) setSupportingDocumentUri(result.assets[0].uri);
  };

  const focusFirstInvalidField = (submit: boolean) => {
    if (!name.trim()) return fieldNavigation.focus("name");
    if (!address.trim()) return fieldNavigation.focus("address");
    if (!phone.trim()) return fieldNavigation.focus("phone");
    if (["clinic", "pet_hotel", "grooming", "shelter"].includes(type) && !responsiblePerson.trim()) return fieldNavigation.focus("responsiblePerson");
    if (submit && type === "clinic" && !licenseNumber.trim()) return fieldNavigation.focus("licenseNumber");
  };

  const create = async (submit: boolean) => {
    setValidationIntent(submit ? "submit" : "draft");
    const validationError = validateMapPlaceDraft(
      { requestedType: type, name, address, phone, latitude: location.latitude, longitude: location.longitude, responsiblePerson, licenseNumber, supportingDocumentUri, openingHours },
      { forSubmission: submit },
    );
    if (validationError) {
      setShowValidation(true);
      focusFirstInvalidField(submit);
      return;
    }
    if (!account || account.kind !== "user") return;
    try {
      setSaving(true);
      const draft = await repositories.mapPlaceApplications.createDraft({
        applicantUserId: account.id,
        requestedType: type,
        name: name.trim(),
        description: description.trim() || undefined,
        address: address.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
        responsiblePerson: responsiblePerson.trim() || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        supportingDocumentUri,
        openingHours,
        acceptsFreeCases,
      });
      if (submit) await repositories.mapPlaceApplications.submit(draft.id, account.id);
      allowNextNavigation();
      showFeedback({
        title: submit ? "تم إرسال الطلب" : "تم حفظ المسودة",
        message: submit ? "سيظهر الطلب بحالة قيد المراجعة حتى يتم اعتماده." : "يمكنك استكمال الطلب لاحقًا.",
        tone: "success",
      });
      router.replace(ROUTES.myMapPlaces);
    } catch (error) {
      showFeedback({ title: "تعذر الحفظ", message: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ الطلب. حاول مرة أخرى.", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      scroll
      padded={false}
      surface="app"
      footer={
        <StickyActionBar>
          <ActionStack>
            <Button title="إرسال للمراجعة" loading={saving} onPress={() => void create(true)} />
            <Button title="حفظ كمسودة" variant="outline" disabled={saving} onPress={() => void create(false)} />
          </ActionStack>
        </StickyActionBar>
      }
    >
      <ScreenHeader title="إضافة جهة إلى الخريطة" subtitle="اعتماد الجهة لا يغيّر نوع حسابك" onBack={() => router.back()} />
      <View style={styles.content}>
        <FormValidationSummary errors={showValidation ? validationMessages : []} />

        <FormSection title="نوع الجهة" subtitle="اختر التصنيف الأقرب؛ متطلبات التحقق تتغير حسب نوع الجهة.">
          <View style={styles.chips}>{USER_PLACE_TYPES.map((item) => <Chip key={item} label={SERVICE_PLACE_TYPE_META[item].label} icon={USER_PLACE_ICONS[item]} selected={type === item} onPress={() => setType(item)} />)}</View>
        </FormSection>

        <FormSection title="بيانات الجهة" subtitle="المعلومات الأساسية التي ستظهر للمستخدمين بعد الاعتماد.">
          <Input ref={fieldNavigation.ref("name")} label="اسم الجهة" required error={showValidation && !name.trim() ? "اسم الجهة مطلوب." : undefined} value={name} onChangeText={setName} placeholder="مثال: عيادة الأمل البيطرية" {...fieldNavigation.nextProps("name", "address")} />
          <Input ref={fieldNavigation.ref("address")} label="العنوان" required error={showValidation && !address.trim() ? "أدخل عنوان الجهة." : undefined} value={address} onChangeText={setAddress} placeholder="المدينة - المنطقة - الشارع" helperText="حدد العلامة على الخريطة أيضًا؛ العنوان والإحداثيات يعاملان كبيانات حساسة بعد الاعتماد." {...fieldNavigation.doneProps()} />
          <MapPlaceLocationPicker value={location} onChange={setLocation} />
        </FormSection>

        <FormSection title="التواصل" subtitle="أضف وسيلة اتصال أساسية، والباقي اختياري.">
          <Input ref={fieldNavigation.ref("phone")} label="رقم الهاتف" required error={showValidation && !phone.trim() ? "رقم الهاتف الأساسي مطلوب." : undefined} value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr" {...fieldNavigation.nextProps("phone", "secondaryPhone")} />
          <Input ref={fieldNavigation.ref("secondaryPhone")} label="رقم بديل" value={secondaryPhone} onChangeText={setSecondaryPhone} keyboardType="phone-pad" contentDirection="ltr" {...fieldNavigation.nextProps("secondaryPhone", "whatsapp")} />
          <Input ref={fieldNavigation.ref("whatsapp")} label="واتساب" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" contentDirection="ltr" {...fieldNavigation.nextProps("whatsapp", "website")} />
          <Input ref={fieldNavigation.ref("website")} label="الموقع الإلكتروني" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" contentDirection="ltr" {...fieldNavigation.nextProps("website", "responsiblePerson")} />
        </FormSection>

        <FormSection title="التحقق والمسؤول" subtitle={type === "clinic" ? "بيانات الترخيص مطلوبة قبل إرسال طلب العيادة." : "أدخل بيانات الشخص المسؤول عن الجهة."}>
          <Input ref={fieldNavigation.ref("responsiblePerson")} label={type === "clinic" ? "الطبيب / المسؤول" : "الشخص المسؤول"} required={["clinic", "pet_hotel", "grooming", "shelter"].includes(type)} error={showValidation && ["clinic", "pet_hotel", "grooming", "shelter"].includes(type) && !responsiblePerson.trim() ? "أدخل اسم الشخص المسؤول." : undefined} value={responsiblePerson} onChangeText={setResponsiblePerson} {...fieldNavigation.nextProps("responsiblePerson", type === "clinic" ? "licenseNumber" : undefined)} />
          {type === "clinic" ? <>
            <Input ref={fieldNavigation.ref("licenseNumber")} label="رقم الترخيص" required error={showValidation && validationIntent === "submit" && !licenseNumber.trim() ? "رقم الترخيص مطلوب للعيادة." : undefined} value={licenseNumber} onChangeText={setLicenseNumber} contentDirection="ltr" helperText="مطلوب عند إرسال طلب العيادة للمراجعة." {...fieldNavigation.doneProps()} />
            <AppText weight="bold">إثبات الترخيص</AppText>
            <AppText variant="caption" color={showValidation && validationIntent === "submit" && !supportingDocumentUri ? COLORS.danger : COLORS.textSecondary} style={styles.proofCopy}>{supportingDocumentUri ? "تم اختيار صورة إثبات." : showValidation && validationIntent === "submit" ? "صورة إثبات الترخيص مطلوبة قبل الإرسال." : "أرفق صورة واضحة للترخيص أو إثبات مزاولة النشاط."}</AppText>
            <Button title={supportingDocumentUri ? "تغيير صورة الإثبات" : "اختيار صورة الإثبات"} variant="outline" onPress={() => void chooseProof()} />
          </> : null}
        </FormSection>

        <FormSection title="الخدمات وأوقات العمل">
          <Input label="وصف الجهة والخدمات" value={description} onChangeText={setDescription} multiline placeholder="اذكر الخدمات الأساسية وأي معلومات مهمة للزوار." returnKeyType="default" />
          <ToggleField
            label="استقبال حالات مجانية"
            description="فعّل هذا الخيار فقط إذا كانت الجهة تستقبل بعض الحالات مجانًا أو ضمن مبادرات دعم."
            value={acceptsFreeCases}
            onValueChange={setAcceptsFreeCases}
          />
          <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        </FormSection>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: DENSITY.sectionGap, paddingBottom: SPACING.xl },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  proofCopy: { marginTop: SPACING.xs, marginBottom: SPACING.md },
});
