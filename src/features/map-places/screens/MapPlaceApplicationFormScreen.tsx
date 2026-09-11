import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import ActionStack from "@/src/components/ui/ActionStack";
import Button from "@/src/components/ui/Button";
import Chip from "@/src/components/ui/Chip";
import FormSection from "@/src/components/ui/FormSection";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import {
  SERVICE_PLACE_TYPE_META,
  validateMapPlaceDraft,
  type DailyOpeningHours,
  type ServicePlaceType,
} from "@/src/domain/service-places";
import MapPlaceLocationPicker, { type MapPlaceLocationValue } from "@/src/features/map-places/components/MapPlaceLocationPicker";
import OpeningHoursEditor, { defaultOpeningHours } from "@/src/features/map-places/components/OpeningHoursEditor";
import { useSession } from "@/src/features/session/SessionContext";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { ROUTES } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { DENSITY, RADIUS, SPACING } from "@/src/theme";

const USER_PLACE_TYPES = ["clinic", "animal_pharmacy", "pet_store", "pet_hotel", "cat_cafe", "grooming", "shelter", "other"] as const satisfies readonly Exclude<ServicePlaceType, "organization" | "feeding_point">[];
type UserPlaceType = (typeof USER_PLACE_TYPES)[number];
const USER_PLACE_ICONS: Record<UserPlaceType, keyof typeof Ionicons.glyphMap> = {
  clinic: "medical-outline",
  animal_pharmacy: "medkit-outline",
  pet_store: "bag-handle-outline",
  pet_hotel: "bed-outline",
  cat_cafe: "cafe-outline",
  grooming: "cut-outline",
  shelter: "home-outline",
  other: "location-outline",
};
const FIELD_KEYS = ["name", "address", "phone", "website"] as const;

export default function MapPlaceApplicationFormScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account } = useSession();
  const fieldNavigation = useFormFieldNavigation(FIELD_KEYS);

  const [type, setType] = useState<UserPlaceType>("clinic");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [supportingDocumentUri, setSupportingDocumentUri] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [governorateName, setGovernorateName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regionName, setRegionName] = useState("");
  const [location, setLocation] = useState<MapPlaceLocationValue | null>(null);
  const [openingHours, setOpeningHours] = useState<DailyOpeningHours[]>(() => defaultOpeningHours());
  const [governorateOpen, setGovernorateOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const lookups = useLocationLookups(governorateId || undefined);

  const validationMessages = useMemo(() => {
    const next: string[] = [];
    if (!name.trim()) next.push("اسم الجهة مطلوب.");
    if (!governorateId) next.push("اختر المحافظة.");
    if (!regionId) next.push("اختر المنطقة التابعة للمحافظة.");
    if (!address.trim()) next.push("عنوان الجهة مطلوب.");
    if (!location) next.push("حدد موقع الجهة على الخريطة.");
    if (!phone.trim()) next.push("رقم الهاتف الأساسي مطلوب.");
    if (type === "clinic" && !licenseNumber.trim()) next.push("رقم ترخيص العيادة مطلوب.");
    if (type === "clinic" && !supportingDocumentUri) next.push("أرفق صورة ترخيص العيادة للتحقق.");
    return next;
  }, [address, governorateId, licenseNumber, location, name, phone, regionId, supportingDocumentUri, type]);

  const hasUnsavedChanges = useMemo(
    () => Boolean(type !== "clinic" || name || description || address || phone || website || governorateId || regionId || location || licenseNumber || supportingDocumentUri || openingHours.some((item) => item.open || item.close)),
    [address, description, governorateId, licenseNumber, location, name, openingHours, phone, regionId, supportingDocumentUri, type, website],
  );

  const focusFirstInvalidField = () => {
    if (!name.trim()) return fieldNavigation.focus("name");
    if (!address.trim()) return fieldNavigation.focus("address");
    if (!phone.trim()) return fieldNavigation.focus("phone");
  };

  const buildInput = () => {
    if (!account || account.kind !== "user" || !location) return null;
    return {
      applicantUserId: account.id,
      requestedType: type,
      name: name.trim(),
      description: description.trim() || undefined,
      governorateId,
      governorateName,
      regionId,
      regionName,
      address: address.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      phone: phone.trim(),
      website: website.trim() || undefined,
      openingHours,
      licenseNumber: type === "clinic" ? licenseNumber.trim() : undefined,
      supportingDocumentUri: type === "clinic" ? supportingDocumentUri : undefined,
    };
  };

  const validate = () => {
    const input = buildInput();
    const validationError = input
      ? validateMapPlaceDraft(input, { forSubmission: true })
      : !account || account.kind !== "user"
        ? "يجب تسجيل الدخول بحساب مستخدم لإضافة جهة إلى الخريطة."
        : "حدد موقع الجهة على الخريطة.";
    if (validationError) {
      setShowValidation(true);
      focusFirstInvalidField();
      showFeedback({ title: "راجع البيانات", message: validationError, tone: "warning" });
      return null;
    }
    return input;
  };

  const saveDraftBeforeExit = async () => {
    const input = validate();
    if (!input) return false;
    try {
      setSaving(true);
      await repositories.mapPlaceApplications.createDraft(input);
      showFeedback({ title: "تم حفظ المسودة", message: "يمكنك استكمال طلب الجهة لاحقًا من صفحة جهاتي على الخريطة.", tone: "success" });
      return true;
    } catch (error) {
      showFeedback({ title: "تعذر حفظ المسودة", message: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المسودة.", tone: "error" });
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

  const create = async (submit: boolean) => {
    const input = validate();
    if (!input || !account || account.kind !== "user") return;
    try {
      setSaving(true);
      const draft = await repositories.mapPlaceApplications.createDraft(input);
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


  const pickVerificationEvidence = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showFeedback({ title: "صلاحية الصور مطلوبة", message: "اسمح بالوصول للصور لاختيار صورة الترخيص.", tone: "warning" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.9, allowsEditing: false });
    if (!result.canceled && result.assets[0]?.uri) setSupportingDocumentUri(result.assets[0].uri);
  };

  const chooseGovernorate = (value: string) => {
    const option = lookups.governorateOptions.find((item) => item.value === value);
    setGovernorateId(value);
    setGovernorateName(option?.label ?? "");
    setRegionId("");
    setRegionName("");
    setGovernorateOpen(false);
  };
  const chooseRegion = (value: string) => {
    const option = lookups.regionOptions.find((item) => item.value === value);
    setRegionId(value);
    setRegionName(option?.label ?? "");
    setRegionOpen(false);
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
      <ScreenHeader title="إضافة جهة إلى الخريطة" subtitle="تُرسل البيانات المدعومة فعليًا إلى الخادم فقط" onBack={() => router.back()} />
      <View style={styles.content}>
        <FormValidationSummary errors={showValidation ? validationMessages : []} />

        <FormSection title="نوع الجهة" subtitle="اختر التصنيف الأقرب للجهة.">
          <View style={styles.chips}>
            {USER_PLACE_TYPES.map((item) => (
              <Chip key={item} label={SERVICE_PLACE_TYPE_META[item].label} icon={USER_PLACE_ICONS[item]} selected={type === item} onPress={() => setType(item)} />
            ))}
          </View>
        </FormSection>

        <FormSection title="بيانات الجهة" subtitle="هذه المعلومات تُحفظ في طلب المراجعة وتظهر بعد الاعتماد.">
          <Input ref={fieldNavigation.ref("name")} label="اسم الجهة" required error={showValidation && !name.trim() ? "اسم الجهة مطلوب." : undefined} value={name} onChangeText={setName} placeholder="مثال: عيادة الأمل البيطرية" {...fieldNavigation.nextProps("name", "address")} />
          <Input label="وصف الجهة والخدمات" value={description} onChangeText={setDescription} multiline placeholder="اذكر الخدمات الأساسية وأي معلومات مهمة للزوار." returnKeyType="default" />
        </FormSection>

        <FormSection title="الموقع" subtitle="اختر المحافظة والمنطقة ثم حدّد النقطة الفعلية على الخريطة. لا يتم إرسال موقع افتراضي.">
          <LocationLookupSelect
            label="المحافظة"
            placeholder="اختر المحافظة"
            required
            value={governorateId}
            selectedLabel={governorateName}
            options={lookups.governorateOptions}
            visible={governorateOpen}
            loading={lookups.loadingGovernorates}
            error={showValidation && !governorateId ? "المحافظة مطلوبة." : undefined}
            onOpen={() => setGovernorateOpen(true)}
            onClose={() => setGovernorateOpen(false)}
            onSelect={chooseGovernorate}
          />
          <LocationLookupSelect
            label="المنطقة"
            placeholder={governorateId ? "اختر المنطقة" : "اختر المحافظة أولًا"}
            required
            value={regionId}
            selectedLabel={regionName}
            options={lookups.regionOptions}
            visible={regionOpen}
            disabled={!governorateId}
            loading={lookups.loadingRegions}
            error={showValidation && !regionId ? "المنطقة مطلوبة." : undefined}
            onOpen={() => setRegionOpen(true)}
            onClose={() => setRegionOpen(false)}
            onSelect={chooseRegion}
          />
          <Input ref={fieldNavigation.ref("address")} label="العنوان" required error={showValidation && !address.trim() ? "أدخل عنوان الجهة." : undefined} value={address} onChangeText={setAddress} placeholder="المنطقة - الشارع - وصف مختصر" helperText="العنوان النصي والإحداثيات يُرسلان معًا إلى الخادم." {...fieldNavigation.nextProps("address", "phone")} />
          <MapPlaceLocationPicker value={location} onChange={setLocation} />
        </FormSection>

        <FormSection title="التواصل" subtitle="رقم الهاتف أساسي؛ الموقع الإلكتروني اختياري.">
          <Input ref={fieldNavigation.ref("phone")} label="رقم الهاتف" required error={showValidation && !phone.trim() ? "رقم الهاتف الأساسي مطلوب." : undefined} value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr" {...fieldNavigation.nextProps("phone", "website")} />
          <Input ref={fieldNavigation.ref("website")} label="الموقع الإلكتروني" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" contentDirection="ltr" {...fieldNavigation.doneProps()} />
        </FormSection>


        {type === "clinic" ? (
          <FormSection title="التحقق من العيادة" subtitle="هذه البيانات مطلوبة لمراجعة العيادات البيطرية قبل نشرها على الخريطة.">
            <Input label="رقم الترخيص" required value={licenseNumber} onChangeText={setLicenseNumber} placeholder="رقم الترخيص المهني أو ترخيص المنشأة" />
            {supportingDocumentUri ? <Image source={{ uri: supportingDocumentUri }} style={styles.evidenceImage} resizeMode="cover" /> : null}
            <Button title={supportingDocumentUri ? "تغيير صورة الترخيص" : "إرفاق صورة الترخيص"} variant="outline" icon="document-attach-outline" onPress={() => void pickVerificationEvidence()} />
          </FormSection>
        ) : null}

        <FormSection title="أوقات العمل" subtitle="اختيارية. نموذج الخادم الحالي يحفظ وقت فتح وإغلاق يومي موحّدًا.">
          <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        </FormSection>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: DENSITY.sectionGap, paddingBottom: SPACING.xl },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  evidenceImage: { width: "100%", height: 180, borderRadius: RADIUS.lg },
});
