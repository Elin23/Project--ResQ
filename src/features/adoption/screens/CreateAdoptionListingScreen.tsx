import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import FormSection from "@/src/components/ui/FormSection";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import type { AdoptionAgeUnit, AdoptionGender, AdoptionHealthItem, AdoptionSize } from "@/src/domain/adoption/adoption";
import { useSession } from "@/src/features/session/SessionContext";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { adoptionMyListingDetailsRoute } from "@/src/navigation/routes";
import { COLORS, DENSITY, RADIUS, SPACING } from "@/src/theme";
import AdoptionLocationPicker, { type AdoptionLocationValue } from "../components/AdoptionLocationPicker";
import { useCreateAdoptionListing } from "../hooks/useCreateAdoptionListing";
import { useOwnedAdoptionListingDetails } from "../hooks/useOwnedAdoptionListingDetails";

const DEFAULT_LOCATION: AdoptionLocationValue = { latitude: 33.5138, longitude: 36.2765 };
const FIELD_KEYS = ["animalName", "animalType", "age", "description", "weight", "color", "breed", "healthCondition", "address", "area", "contactName", "phone", "alternatePhone"] as const;
const DEFAULT_HEALTH: AdoptionHealthItem[] = [
  { id: "vaccinated", label: "مطعّم", checked: false },
  { id: "sterilized", label: "معقّم", checked: false },
  { id: "parasites", label: "علاج طفيليات", checked: false },
  { id: "vet-check", label: "فحص بيطري", checked: false },
  { id: "medical-record", label: "لديه سجل طبي", checked: false },
  { id: "needs-followup", label: "يحتاج متابعة طبية", checked: false },
];

export default function CreateAdoptionListingScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { handlePermission } = usePermissionFeedback();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const { account, accountKind } = useSession();
  const { submit, updateAndResubmit, submitting, error } = useCreateAdoptionListing();
  const fieldNavigation = useFormFieldNavigation(FIELD_KEYS);
  const baselineSignatureRef = useRef<string | null>(null);
  const {
    listing: editingListing,
    loading: editLoading,
    error: editLoadError,
  } = useOwnedAdoptionListingDetails(editId, account?.id);
  const [hydratedEditId, setHydratedEditId] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [animalName, setAnimalName] = useState("");
  const [animalType, setAnimalType] = useState("قطة");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<AdoptionAgeUnit>("years");
  const [gender, setGender] = useState<AdoptionGender>("unknown");
  const [traits, setTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState<AdoptionSize>("medium");
  const [breed, setBreed] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [healthChecklist, setHealthChecklist] = useState<AdoptionHealthItem[]>(DEFAULT_HEALTH);
  const [newHealthItem, setNewHealthItem] = useState("");
  const [location, setLocation] = useState<AdoptionLocationValue>(DEFAULT_LOCATION);
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [locating, setLocating] = useState(false);
  const [contactName, setContactName] = useState(account?.displayName ?? "");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [preferredMethod, setPreferredMethod] = useState<"phone" | "whatsapp">("phone");

  const formSignature = JSON.stringify({
    images, animalName, animalType, age, ageUnit, gender, traits, description, weight, color, size, breed,
    healthCondition, healthChecklist, location, address, area, contactName, phone, alternatePhone, preferredMethod,
  });

  useEffect(() => {
    if (!editingListing || hydratedEditId === editingListing.id) return;
    setImages([...editingListing.images]);
    setAnimalName(editingListing.animalName);
    setAnimalType(editingListing.animalType);
    setAge(String(editingListing.age));
    setAgeUnit(editingListing.ageUnit);
    setGender(editingListing.gender);
    setTraits([...editingListing.traits]);
    setDescription(editingListing.description);
    setWeight(editingListing.weight ? String(editingListing.weight) : "");
    setColor(editingListing.color);
    setSize(editingListing.size);
    setBreed(editingListing.breed ?? "");
    setHealthCondition(editingListing.healthCondition);
    setHealthChecklist(editingListing.healthChecklist.map((item) => ({ ...item })));
    setLocation({
      latitude: editingListing.location.latitude,
      longitude: editingListing.location.longitude,
    });
    setAddress(editingListing.location.address);
    setArea(editingListing.location.area ?? "");
    setContactName(editingListing.contact.name);
    setPhone(editingListing.contact.phone);
    setAlternatePhone(editingListing.contact.alternatePhone ?? "");
    setPreferredMethod(editingListing.contact.preferredMethod);
    setHydratedEditId(editingListing.id);
  }, [editingListing, hydratedEditId]);

  useEffect(() => {
    const readyForBaseline = !editId || (editingListing && hydratedEditId === editingListing.id);
    if (readyForBaseline && baselineSignatureRef.current === null) baselineSignatureRef.current = formSignature;
  }, [editId, editingListing, formSignature, hydratedEditId]);

  const hasUnsavedChanges = baselineSignatureRef.current !== null && formSignature !== baselineSignatureRef.current;
  const { allowNextNavigation } = useUnsavedChangesGuard(hasUnsavedChanges && !submitting);

  const ageNumber = Number(age);
  const weightNumber = weight.trim() ? Number(weight) : undefined;
  const validationErrors = useMemo(() => {
    const next: string[] = [];
    if (!images.length) next.push("أضف صورة واحدة على الأقل للحيوان.");
    if (!animalName.trim()) next.push("اسم الحيوان مطلوب.");
    if (!animalType.trim()) next.push("نوع الحيوان مطلوب.");
    if (!(ageNumber > 0)) next.push("أدخل عمرًا صحيحًا أكبر من صفر.");
    if (!description.trim()) next.push("أضف نبذة عن الحيوان.");
    if (weightNumber !== undefined && (!Number.isFinite(weightNumber) || weightNumber <= 0)) next.push("الوزن يجب أن يكون رقمًا أكبر من صفر أو يترك فارغًا.");
    if (!color.trim()) next.push("لون الحيوان مطلوب.");
    if (!healthCondition.trim()) next.push("أدخل وصفًا للحالة الصحية.");
    if (!address.trim()) next.push("عنوان الحيوان مطلوب.");
    if (!contactName.trim()) next.push("اسم جهة التواصل مطلوب.");
    if (!phone.trim()) next.push("رقم الهاتف مطلوب.");
    return next;
  }, [address, ageNumber, animalName, animalType, color, contactName, description, healthCondition, images.length, phone, weightNumber]);

  const canSubmit = useMemo(() => Boolean(
    account && images.length > 0 && animalName.trim() && animalType.trim() && ageNumber > 0 && description.trim()
    && color.trim() && healthCondition.trim() && address.trim() && contactName.trim() && phone.trim() && !submitting,
  ), [account, ageNumber, animalName, animalType, color, contactName, description, healthCondition, images.length, phone, address, submitting]);

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, { title: "صلاحية الصور مطلوبة", message: "اسمح بالوصول إلى الصور لإضافة صور واضحة للحيوان." })) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsMultipleSelection: true, selectionLimit: Math.max(1, 6 - images.length), quality: 0.85,
    });
    if (!result.canceled) {
      const next = result.assets.map((asset) => asset.uri).filter(Boolean);
      setImages((current) => [...current, ...next].slice(0, 6));
    }
  };

  const removeImage = (uri: string) => setImages((current) => current.filter((item) => item !== uri));
  const makePrimary = (uri: string) => setImages((current) => [uri, ...current.filter((item) => item !== uri)]);

  const addTrait = () => {
    const value = newTrait.trim();
    if (!value || traits.includes(value)) return;
    setTraits((current) => [...current, value]); setNewTrait("");
  };

  const toggleHealth = (id: string) => setHealthChecklist((current) => current.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  const addHealthItem = () => {
    const label = newHealthItem.trim();
    if (!label) return;
    setHealthChecklist((current) => [...current, { id: `custom-${Date.now()}`, label, checked: true }]);
    setNewHealthItem("");
  };

  const handleUseCurrentLocation = async () => {
    if (locating) return;
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!handlePermission(permission, { title: "صلاحية الموقع مطلوبة", message: "اسمح بالوصول إلى الموقع لتحديد مكان الحيوان بدقة." })) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      setLocation(next);
      try {
        const [place] = await Location.reverseGeocodeAsync(next);
        const parts = [place?.city, place?.district, place?.street].filter(Boolean);
        if (parts.length) setAddress(parts.join(" - "));
        if (!area.trim() && place?.district) setArea(place.district);
      } catch { /* Coordinates remain valid. */ }
    } catch {
      showFeedback({ title: "تعذر تحديد الموقع", message: "يمكنك اختيار الموقع يدويًا من الخريطة.", tone: "error" });
    } finally { setLocating(false); }
  };

  const handleSubmit = async () => {
    if (!account || submitting) return;
    const firstMissing = !images.length ? null
      : !animalName.trim() ? "animalName"
      : !animalType.trim() ? "animalType"
      : !(ageNumber > 0) ? "age"
      : !description.trim() ? "description"
      : !color.trim() ? "color"
      : !healthCondition.trim() ? "healthCondition"
      : !address.trim() ? "address"
      : !contactName.trim() ? "contactName"
      : !phone.trim() ? "phone"
      : null;
    setShowValidation(true);
    if (validationErrors.length) {
      if (firstMissing) fieldNavigation.focus(firstMissing);
      else if (weightNumber !== undefined && (!Number.isFinite(weightNumber) || weightNumber <= 0)) fieldNavigation.focus("weight");
      return;
    }
    try {
      const payload = {
        animalName: animalName.trim(),
        animalType: animalType.trim(),
        age: ageNumber,
        ageUnit,
        gender,
        traits,
        description: description.trim(),
        weight: weightNumber,
        color: color.trim(),
        size,
        breed: breed.trim() || undefined,
        healthCondition: healthCondition.trim(),
        healthChecklist,
        images,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: address.trim(),
          area: area.trim() || undefined,
        },
        contact: {
          name: contactName.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim() || undefined,
          preferredMethod,
        },
        organizationId: account.kind === "organization" ? account.id : undefined,
      };

      const listing = editId
        ? await updateAndResubmit(editId, account.id, payload)
        : await submit({
            ownerAccountId: account.id,
            ownerAccountKind: account.kind,
            ...payload,
          });

      allowNextNavigation();
      showFeedback({
        title: editId ? "تم تحديث الإعلان" : "تم إرسال الإعلان للمراجعة",
        message: "سيبقى الإعلان قيد المراجعة ولن يظهر للعامة حتى تتم الموافقة عليه.",
        tone: "success",
      });
      router.replace(adoptionMyListingDetailsRoute(listing.id, accountKind));
    } catch { /* localized hook error is rendered below */ }
  };

  if (editId && editLoading) {
    return (
      <Screen centered>
        <LoadingState label="جاري تحميل الإعلان..." />
      </Screen>
    );
  }

  if (editId && (editLoadError || !editingListing)) {
    return (
      <Screen>
        <ScreenHeader title="تعديل إعلان التبني" onBack={() => router.back()} />
        <View style={styles.content}>
          <ErrorState description={editLoadError ?? "الإعلان غير موجود أو لا يمكن تعديله."} />
        </View>
      </Screen>
    );
  }

  if (editId && editingListing && !["rejected", "draft"].includes(editingListing.moderationStatus)) {
    return (
      <Screen>
        <ScreenHeader title="تعديل إعلان التبني" onBack={() => router.back()} />
        <View style={styles.content}>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>
            يمكن تعديل الإعلانات المرفوضة أو المسودات فقط قبل إعادة إرسالها للمراجعة.
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      padded={false}
      safeAreaEdges={["top", "right", "bottom", "left"]}
      footer={
        <StickyActionBar>
          <ActionStack>
            <Button
              title={editId ? "حفظ وإعادة الإرسال" : "إرسال الإعلان للمراجعة"}
              icon="paper-plane-outline"
              loading={submitting}
              disabled={submitting}
              onPress={() => void handleSubmit()}
            />
            <Button title="إلغاء" variant="ghost" onPress={() => router.back()} />
          </ActionStack>
        </StickyActionBar>
      }
    >
      <ScreenHeader
        title={editId ? "تعديل إعلان التبني" : "عرض حيوان للتبني"}
        subtitle={editId ? "عدّل البيانات ثم أعد إرسال الإعلان للمراجعة" : "سيتم نشر الإعلان بعد مراجعة الإدارة"}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <Card disabled style={styles.noticeCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primaryStrong} />
          <View style={styles.flexCopy}>
            <AppText variant="label" weight="bold">مراجعة قبل النشر</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>أدخل معلومات دقيقة وصورًا واضحة. الإعلان سيبقى قيد المراجعة حتى موافقة الإدارة.</AppText>
          </View>
        </Card>

        <FormValidationSummary errors={showValidation ? validationErrors : []} />

        <FormSection title="صور الحيوان" subtitle="اختر صورًا واضحة ومتنوعة؛ الصورة الأولى ستكون الرئيسية.">
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={uri} style={styles.imageTile}>
              <Image source={{ uri }} style={styles.image} />
              {index === 0 ? <View style={styles.primaryBadge}><AppText variant="caption" color={COLORS.textInverse}>الصورة الرئيسية</AppText></View> : null}
              <View style={styles.imageActions}>
                {index > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="تعيين كصورة رئيسية" onPress={() => makePrimary(uri)} style={styles.imageAction}><Ionicons name="star-outline" size={17} color={COLORS.text} /></Pressable> : null}
                <Pressable accessibilityRole="button" accessibilityLabel="حذف الصورة" onPress={() => removeImage(uri)} style={styles.imageAction}><Ionicons name="trash-outline" size={17} color={COLORS.danger} /></Pressable>
              </View>
            </View>
          ))}
          {images.length < 6 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="إضافة صور للحيوان" onPress={() => void pickImages()} style={({ pressed }) => [styles.addImage, pressed && styles.pressed]}>
              <Ionicons name="images-outline" size={28} color={COLORS.primaryStrong} />
              <AppText variant="label" weight="medium">إضافة صور</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>{images.length}/6</AppText>
            </Pressable>
          ) : null}
        </View>
        {showValidation && !images.length ? <AppText variant="caption" color={COLORS.danger}>أضف صورة واحدة على الأقل قبل إرسال الإعلان.</AppText> : null}
        </FormSection>

        <FormSection title="المعلومات الأساسية" subtitle="بيانات مختصرة تساعد المتبني على فهم الحيوان بسرعة.">
        <Input ref={fieldNavigation.ref("animalName")} label="اسم الحيوان" required error={showValidation && !animalName.trim() ? "اسم الحيوان مطلوب." : undefined} value={animalName} onChangeText={setAnimalName} placeholder="مثال: لولو" {...fieldNavigation.nextProps("animalName", "animalType")} />
        <Input ref={fieldNavigation.ref("animalType")} label="النوع" required error={showValidation && !animalType.trim() ? "نوع الحيوان مطلوب." : undefined} value={animalType} onChangeText={setAnimalType} placeholder="قطة، كلب، أرنب..." {...fieldNavigation.nextProps("animalType", "age")} />
        <View style={styles.inlineFields}>
          <Input ref={fieldNavigation.ref("age")} containerStyle={styles.inlineField} label="العمر" required error={showValidation && !(ageNumber > 0) ? "أدخل عمرًا صحيحًا." : undefined} value={age} onChangeText={setAge} keyboardType="decimal-pad" contentDirection="ltr" placeholder="2" {...fieldNavigation.doneProps()} />
          <View style={styles.inlineField}><AppText variant="label" weight="medium" style={styles.fieldLabel}>وحدة العمر</AppText><View style={styles.chipsRow}><Chip label="سنة" selected={ageUnit === "years"} onPress={() => setAgeUnit("years")} /><Chip label="شهر" selected={ageUnit === "months"} onPress={() => setAgeUnit("months")} /></View></View>
        </View>
        <AppText variant="label" weight="medium">الجنس</AppText>
        <View style={styles.chipsRow}>
          <Chip label="ذكر" selected={gender === "male"} onPress={() => setGender("male")} />
          <Chip label="أنثى" selected={gender === "female"} onPress={() => setGender("female")} />
          <Chip label="غير محدد" selected={gender === "unknown"} onPress={() => setGender("unknown")} />
        </View>
        <Input ref={fieldNavigation.ref("description")} label="النبذة عن الحيوان" required error={showValidation && !description.trim() ? "أضف نبذة تساعد المتبني على فهم الحيوان." : undefined} value={description} onChangeText={setDescription} multiline placeholder="صف شخصية الحيوان وقصته وما يحتاجه في المنزل الجديد" returnKeyType="default" />
        </FormSection>

        <FormSection title="الصفات" subtitle="أضف صفات تساعد المتبني على فهم شخصية الحيوان">
        <View style={styles.chipsRow}>{traits.map((trait) => <Chip key={trait} label={`${trait} ×`} soft onPress={() => setTraits((current) => current.filter((item) => item !== trait))} />)}</View>
        <View style={styles.addRow}><View style={styles.flexCopy}><Input value={newTrait} onChangeText={setNewTrait} placeholder="مثال: ودود، هادئ" containerStyle={styles.noMargin} /></View><Button title="إضافة صفة" icon="add-outline" fullWidth={false} onPress={addTrait} disabled={!newTrait.trim()} /></View>
        </FormSection>

        <FormSection title="المواصفات">
        <Input ref={fieldNavigation.ref("weight")} label="الوزن (كغ)" error={showValidation && weightNumber !== undefined && (!Number.isFinite(weightNumber) || weightNumber <= 0) ? "أدخل رقمًا أكبر من صفر أو اترك الحقل فارغًا." : undefined} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" contentDirection="ltr" placeholder="اختياري" {...fieldNavigation.nextProps("weight", "color")} />
        <Input ref={fieldNavigation.ref("color")} label="اللون" required error={showValidation && !color.trim() ? "لون الحيوان مطلوب." : undefined} value={color} onChangeText={setColor} placeholder="مثال: أبيض وبني" {...fieldNavigation.nextProps("color", "breed")} />
        <Input ref={fieldNavigation.ref("breed")} label="السلالة" value={breed} onChangeText={setBreed} placeholder="اختياري" {...fieldNavigation.doneProps()} />
        <AppText variant="label" weight="medium">الحجم</AppText>
        <View style={styles.chipsRow}><Chip label="صغير" selected={size === "small"} onPress={() => setSize("small")} /><Chip label="متوسط" selected={size === "medium"} onPress={() => setSize("medium")} /><Chip label="كبير" selected={size === "large"} onPress={() => setSize("large")} /></View>
        </FormSection>

        <FormSection title="الحالة والسجل الصحي" subtitle="اذكر أي معلومات صحية قد تؤثر على قرار التبني أو الرعاية.">
        <Input ref={fieldNavigation.ref("healthCondition")} label="الحالة الصحية" required error={showValidation && !healthCondition.trim() ? "صف الحالة الصحية الحالية." : undefined} value={healthCondition} onChangeText={setHealthCondition} multiline placeholder="صف الحالة الحالية، الأدوية أو أي متابعة مطلوبة" returnKeyType="default" />
        <View style={styles.checklist}>
          {healthChecklist.map((item) => (
            <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{ checked: item.checked }} onPress={() => toggleHealth(item.id)} style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}>
              <Ionicons name={item.checked ? "checkbox" : "square-outline"} size={22} color={item.checked ? COLORS.primaryStrong : COLORS.textMuted} />
              <AppText variant="bodySmall" style={styles.flexCopy}>{item.label}</AppText>
            </Pressable>
          ))}
        </View>
        <View style={styles.addRow}><View style={styles.flexCopy}><Input value={newHealthItem} onChangeText={setNewHealthItem} placeholder="إضافة بند صحي" containerStyle={styles.noMargin} /></View><Button title="إضافة بند" icon="add-outline" fullWidth={false} onPress={addHealthItem} disabled={!newHealthItem.trim()} /></View>
        </FormSection>

        <FormSection title="الموقع الدقيق" subtitle="يُستخدم الموقع لعرض الحيوان للمتبنين القريبين وتسهيل التنسيق.">
        <Input ref={fieldNavigation.ref("address")} label="العنوان" required error={showValidation && !address.trim() ? "العنوان مطلوب." : undefined} value={address} onChangeText={setAddress} placeholder="المدينة - المنطقة - أقرب معلم" {...fieldNavigation.nextProps("address", "area")} />
        <Input ref={fieldNavigation.ref("area")} label="المنطقة" value={area} onChangeText={setArea} placeholder="اختياري" {...fieldNavigation.doneProps()} />
        <Button title={locating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"} icon="locate-outline" variant="outline" loading={locating} onPress={() => void handleUseCurrentLocation()} />
        <AdoptionLocationPicker value={location} onChange={setLocation} />
        </FormSection>

        <FormSection title="معلومات التواصل" subtitle="لن تُستخدم هذه البيانات إلا ضمن تدفق طلبات التبني.">
        <Input ref={fieldNavigation.ref("contactName")} label="اسم جهة التواصل" required error={showValidation && !contactName.trim() ? "اسم جهة التواصل مطلوب." : undefined} value={contactName} onChangeText={setContactName} placeholder="الاسم الذي سيظهر بعد قبول طلب التبني" {...fieldNavigation.nextProps("contactName", "phone")} />
        <Input ref={fieldNavigation.ref("phone")} label="رقم الهاتف" required error={showValidation && !phone.trim() ? "رقم الهاتف مطلوب." : undefined} value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr" placeholder="09xxxxxxxx" {...fieldNavigation.nextProps("phone", "alternatePhone")} />
        <Input ref={fieldNavigation.ref("alternatePhone")} label="رقم بديل" value={alternatePhone} onChangeText={setAlternatePhone} keyboardType="phone-pad" contentDirection="ltr" placeholder="اختياري" {...fieldNavigation.doneProps()} />
        <AppText variant="label" weight="medium">طريقة التواصل المفضلة</AppText>
        <View style={styles.chipsRow}><Chip label="اتصال" icon="call-outline" selected={preferredMethod === "phone"} onPress={() => setPreferredMethod("phone")} /><Chip label="واتساب" icon="logo-whatsapp" selected={preferredMethod === "whatsapp"} onPress={() => setPreferredMethod("whatsapp")} /></View>
        </FormSection>

        {error ? <AppText variant="bodySmall" color={COLORS.danger}>{error}</AppText> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: DENSITY.sectionGap },
  noticeCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary + "33" },
  flexCopy: { flex: 1, minWidth: 0 },
  imageGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  imageTile: { width: "48%", aspectRatio: 1.2, borderRadius: RADIUS.lg, overflow: "hidden", backgroundColor: COLORS.surfaceSubtle, position: "relative" },
  image: { width: "100%", height: "100%" },
  primaryBadge: { position: "absolute", top: SPACING.sm, right: SPACING.sm, backgroundColor: COLORS.primaryStrong, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  imageActions: { position: "absolute", bottom: SPACING.sm, left: SPACING.sm, flexDirection: "row", direction: "rtl", gap: SPACING.xs },
  imageAction: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  addImage: { width: "48%", aspectRatio: 1.2, borderRadius: RADIUS.lg, borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center", gap: SPACING.xs, padding: SPACING.md },
  inlineFields: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  inlineField: { flex: 1, minWidth: 0 },
  fieldLabel: { marginBottom: SPACING.sm },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  addRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  noMargin: { marginBottom: 0 },
  checklist: { gap: SPACING.xs },
  checkRow: { minHeight: 46, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.surfaceSubtle, borderWidth: 1, borderColor: COLORS.border },
  pressed: { opacity: 0.82 },
});
