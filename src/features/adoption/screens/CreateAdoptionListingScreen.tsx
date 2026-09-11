import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
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
import type { AdoptionAgeUnit, AdoptionGender, AdoptionHealthItem, AdoptionHealthStatus, AdoptionSize } from "@/src/domain/adoption/adoption";
import { useSession } from "@/src/features/session/SessionContext";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { adoptionMyListingDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, DENSITY, RADIUS, SPACING } from "@/src/theme";
import AdoptionLocationPicker, { type AdoptionLocationValue } from "../components/AdoptionLocationPicker";
import { useCreateAdoptionListing } from "../hooks/useCreateAdoptionListing";
import { useOwnedAdoptionListingDetails } from "../hooks/useOwnedAdoptionListingDetails";

const DEFAULT_LOCATION: AdoptionLocationValue = { latitude: 33.5138, longitude: 36.2765 };
const FIELD_KEYS = ["animalName", "age", "description", "weight", "color", "breed", "healthCondition", "address"] as const;
const DEFAULT_HEALTH: AdoptionHealthItem[] = [
  { id: "vaccinated", label: "مطعّم", checked: false },
  { id: "disease-free", label: "خالٍ من الأمراض المعدية", checked: false },
  { id: "examined", label: "تم فحصه بيطريًا", checked: false },
];
const ANIMAL_TYPE_OPTIONS = ["قطة", "كلب", "طائر", "أرنب", "أخرى"] as const;
const HEALTH_STATUS_OPTIONS: { value: AdoptionHealthStatus; label: string }[] = [
  { value: "good", label: "جيدة" },
  { value: "needs_care", label: "تحتاج رعاية" },
  { value: "under_treatment", label: "تحت العلاج" },
  { value: "special_needs", label: "احتياجات خاصة" },
  { value: "unknown", label: "غير محددة" },
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
  const [animalType, setAnimalType] = useState<(typeof ANIMAL_TYPE_OPTIONS)[number]>("قطة");
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
  const [healthStatus, setHealthStatus] = useState<AdoptionHealthStatus>("good");
  const [healthCondition, setHealthCondition] = useState("");
  const [healthChecklist, setHealthChecklist] = useState<AdoptionHealthItem[]>(DEFAULT_HEALTH);
  const [location, setLocation] = useState<AdoptionLocationValue>(DEFAULT_LOCATION);
  const [governorateId, setGovernorateId] = useState("");
  const [governorateName, setGovernorateName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regionName, setRegionName] = useState("");
  const [governorateSheetVisible, setGovernorateSheetVisible] = useState(false);
  const [regionSheetVisible, setRegionSheetVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const locationLookups = useLocationLookups(governorateId);

  const formSignature = JSON.stringify({
    images, animalName, animalType, age, ageUnit, gender, traits, description, weight, color, size, breed,
    healthStatus, healthCondition, healthChecklist, location, governorateId, regionId, address,
  });

  useEffect(() => {
    if (!editingListing || hydratedEditId === editingListing.id) return;
    setImages([...editingListing.images]);
    setAnimalName(editingListing.animalName);
    setAnimalType(ANIMAL_TYPE_OPTIONS.includes(editingListing.animalType as (typeof ANIMAL_TYPE_OPTIONS)[number]) ? editingListing.animalType as (typeof ANIMAL_TYPE_OPTIONS)[number] : "أخرى");
    setAge(String(editingListing.age));
    setAgeUnit(editingListing.ageUnit);
    setGender(editingListing.gender);
    setTraits([...editingListing.traits]);
    setDescription(editingListing.description);
    setWeight(editingListing.weight ? String(editingListing.weight) : "");
    setColor(editingListing.color);
    setSize(editingListing.size);
    setBreed(editingListing.breed ?? "");
    setHealthStatus(editingListing.healthStatus);
    setHealthCondition(editingListing.healthCondition);
    setHealthChecklist(DEFAULT_HEALTH.map((item) => ({ ...item, checked: !!editingListing.healthChecklist.find((existing) => existing.id === item.id)?.checked })));
    setLocation({
      latitude: editingListing.location.latitude,
      longitude: editingListing.location.longitude,
    });
    setGovernorateId(editingListing.location.governorateId ?? "");
    setGovernorateName(editingListing.location.governorateName ?? "");
    setRegionId(editingListing.location.regionId ?? "");
    setRegionName(editingListing.location.regionName ?? "");
    setAddress(editingListing.location.address);
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

    if (!(ageNumber > 0)) next.push("أدخل عمرًا صحيحًا أكبر من صفر.");
    if (!description.trim()) next.push("أضف نبذة عن الحيوان.");
    if (weightNumber !== undefined && (!Number.isFinite(weightNumber) || weightNumber <= 0)) next.push("الوزن يجب أن يكون رقمًا أكبر من صفر أو يترك فارغًا.");
    if (!color.trim()) next.push("لون الحيوان مطلوب.");
    if (!healthCondition.trim()) next.push("أدخل وصفًا للحالة الصحية.");
    if (!governorateId) next.push("اختر المحافظة من القائمة المعتمدة.");
    if (!regionId) next.push("اختر المنطقة التابعة للمحافظة.");
    if (!address.trim()) next.push("عنوان الحيوان مطلوب.");
    return next;
  }, [address, ageNumber, animalName, color, description, governorateId, healthCondition, images.length, regionId, weightNumber]);

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

      } catch { /* Coordinates remain valid. */ }
    } catch {
      showFeedback({ title: "تعذر تحديد الموقع", message: "يمكنك اختيار الموقع يدويًا من الخريطة.", tone: "error" });
    } finally { setLocating(false); }
  };

  const handleSubmit = async () => {
    if (!account || submitting) return;
    const firstMissing = !images.length ? null
      : !animalName.trim() ? "animalName"
      : !(ageNumber > 0) ? "age"
      : !description.trim() ? "description"
      : !color.trim() ? "color"
      : !healthCondition.trim() ? "healthCondition"
      : !address.trim() ? "address"
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
        healthStatus,
        healthCondition: healthCondition.trim(),
        healthChecklist,
        images,
        location: {
          governorateId,
          governorateName,
          regionId,
          regionName,
          latitude: location.latitude,
          longitude: location.longitude,
          address: address.trim(),
          area: regionName || undefined,
        },
        contact: {
          name: account.displayName ?? "",
          phone: account.phone ?? "",
          preferredMethod: "phone" as const,
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
        <Input ref={fieldNavigation.ref("animalName")} label="اسم الحيوان" required error={showValidation && !animalName.trim() ? "اسم الحيوان مطلوب." : undefined} value={animalName} onChangeText={setAnimalName} placeholder="مثال: لولو" {...fieldNavigation.nextProps("animalName", "age")} />
        <AppText variant="label" weight="medium">نوع الحيوان</AppText>
        <View style={styles.chipsRow}>{ANIMAL_TYPE_OPTIONS.map((option) => <Chip key={option} label={option} selected={animalType === option} onPress={() => setAnimalType(option)} />)}</View>
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
        <AppText variant="label" weight="medium">التقييم الصحي العام</AppText>
        <View style={styles.chipsRow}>{HEALTH_STATUS_OPTIONS.map((option) => <Chip key={option.value} label={option.label} selected={healthStatus === option.value} onPress={() => setHealthStatus(option.value)} />)}</View>
        <Input ref={fieldNavigation.ref("healthCondition")} label="تفاصيل الحالة الصحية" required error={showValidation && !healthCondition.trim() ? "صف الحالة الصحية الحالية." : undefined} value={healthCondition} onChangeText={setHealthCondition} multiline placeholder="صف الحالة الحالية، الأدوية أو أي متابعة مطلوبة" returnKeyType="default" />
        <View style={styles.checklist}>
          {healthChecklist.map((item) => (
            <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{ checked: item.checked }} onPress={() => toggleHealth(item.id)} style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}>
              <Ionicons name={item.checked ? "checkbox" : "square-outline"} size={22} color={item.checked ? COLORS.primaryStrong : COLORS.textMuted} />
              <AppText variant="bodySmall" style={styles.flexCopy}>{item.label}</AppText>
            </Pressable>
          ))}
        </View>
        </FormSection>

        <FormSection title="الموقع الدقيق" subtitle="يُستخدم الموقع لعرض الحيوان للمتبنين القريبين وتسهيل التنسيق.">
        <LocationLookupSelect
          label="المحافظة" placeholder="اختر المحافظة" value={governorateId} selectedLabel={governorateName}
          options={locationLookups.governorateOptions} visible={governorateSheetVisible} required loading={locationLookups.loadingGovernorates}
          error={showValidation && !governorateId ? "المحافظة مطلوبة." : undefined}
          onOpen={() => setGovernorateSheetVisible(true)} onClose={() => setGovernorateSheetVisible(false)}
          onSelect={(value) => { const selected = locationLookups.governorates.find((item) => item.id === value); setGovernorateId(value); setGovernorateName(selected?.name ?? ""); setRegionId(""); setRegionName(""); setGovernorateSheetVisible(false); }}
        />
        <LocationLookupSelect
          label="المنطقة" placeholder={governorateId ? "اختر المنطقة" : "اختر المحافظة أولًا"} value={regionId} selectedLabel={regionName}
          options={locationLookups.regionOptions} visible={regionSheetVisible} required disabled={!governorateId} loading={locationLookups.loadingRegions}
          error={showValidation && !regionId ? "المنطقة مطلوبة." : undefined}
          onOpen={() => setRegionSheetVisible(true)} onClose={() => setRegionSheetVisible(false)}
          onSelect={(value) => { const selected = locationLookups.regions.find((item) => item.id === value); setRegionId(value); setRegionName(selected?.name ?? ""); setRegionSheetVisible(false); }}
        />
        {locationLookups.error ? <AppText variant="caption" color={COLORS.danger}>{locationLookups.error}</AppText> : null}
        <Input ref={fieldNavigation.ref("address")} label="العنوان التفصيلي" required error={showValidation && !address.trim() ? "العنوان مطلوب." : undefined} value={address} onChangeText={setAddress} placeholder="الحي - الشارع - أقرب معلم" {...fieldNavigation.doneProps()} />
        <Button title={locating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"} icon="locate-outline" variant="outline" loading={locating} onPress={() => void handleUseCurrentLocation()} />
        <AdoptionLocationPicker value={location} onChange={setLocation} />
        </FormSection>

        <FormSection title="معلومات التواصل" subtitle="يستخدم النظام بيانات الحساب الموثقة ولا يخزن رقمًا مختلفًا داخل إعلان التبني.">
          <Card disabled style={styles.contactCard}>
            <View style={styles.flexCopy}>
              <AppText variant="label" weight="bold">{account?.displayName || "بيانات الحساب"}</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>{account?.phone || "أضف رقم هاتف إلى ملفك الشخصي ليظهر بعد قبول الطلب."}</AppText>
            </View>
            <Button title="تعديل الملف" variant="outline" fullWidth={false} onPress={() => router.push(ROUTES.editProfile)} />
          </Card>
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
  contactCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  pressed: { opacity: 0.82 },
});
