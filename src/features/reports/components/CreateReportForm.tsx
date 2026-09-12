import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState, type ComponentProps } from "react";
import {
    ScrollView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AppText from "@/src/components/ui/AppText";
import IconButton from "@/src/components/ui/IconButton";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SelectionSheet from "@/src/components/ui/SelectionSheet";
import Input from "@/src/components/ui/Input";
import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";
import { useSubmitReport } from "../hooks/useSubmitReport";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from "@/src/theme";
import CreateReportLocationMap from "./CreateReportLocationMap";


// حالات الحيوان
const ANIMAL_STATUSES = [
  {
    id: "injured",
    label: "مصاب",
    icon: "medical-bag",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "sick",
    label: "مريض",
    icon: "emoticon-sad-outline",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "trapped",
    label: "عالق",
    icon: "lock-outline",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "lost",
    label: "ضائع",
    icon: "help-box-outline",
    lib: "MaterialCommunityIcons",
  },
  { id: "food", label: "يحتاج طعاماً", icon: "utensils", lib: "FontAwesome5" },
  {
    id: "dead",
    label: "متوفى",
    icon: "heart-broken-outline",
    lib: "MaterialCommunityIcons",
  },
];

// درجات الخطورة
const SEVERITY_LEVELS = [
  {
    id: "critical",
    title: "حرجة",
    desc: "الحيوان في خطر داهم ويحتاج تدخل فوري",
    isUrgent: true,
  },
  {
    id: "high",
    title: "عالية",
    desc: "إصابة شديدة تتطلب عناية طبية سريعة",
  },
  {
    id: "medium",
    title: "متوسطة",
    desc: "حالة غير مستقرة ولكن لا تشكل خطراً فورياً",
  },
  {
    id: "low",
    title: "منخفضة",
    desc: "يحتاج مساعدة بسيطة أو توفير طعام",
  },
];

export default function CreateReportForm() {
  const router = useRouter();

  const { account } = useSession();
  const { submit, submitting, error: submitError } = useSubmitReport();
  const { showFeedback } = useFeedback();
  const { handlePermission } = usePermissionFeedback();
  const [count, setCount] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("injured");
  const [selectedAnimalType, setSelectedAnimalType] = useState("كلب");
  const [animalTypeSheetVisible, setAnimalTypeSheetVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("medium");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [governorateId, setGovernorateId] = useState("");
  const [governorateName, setGovernorateName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regionName, setRegionName] = useState("");
  const [address, setAddress] = useState("");
  const [governorateSheetVisible, setGovernorateSheetVisible] = useState(false);
  const [regionSheetVisible, setRegionSheetVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const locationLookups = useLocationLookups(governorateId);

  const informationComplete =
    Boolean(selectedAnimalType) &&
    Boolean(selectedStatus) &&
    Boolean(selectedSeverity) &&
    count > 0 &&
    description.trim().length >= 5;
  const locationComplete =
    Boolean(governorateId) && Boolean(regionId) && address.trim().length > 0;
  const currentStep = !informationComplete ? 1 : !locationComplete ? 2 : 3;

  const [region, setRegion] = useState({
    latitude: 33.5138,
    longitude: 36.2765,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleChooseAnimalType = () => setAnimalTypeSheetVisible(true);

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, {
      title: "صلاحية الصور مطلوبة",
      message: "اسمح بالوصول إلى الصور لإرفاق صور الحالة بالبلاغ.",
    })) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.85,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.slice(0, 5).map((asset) => asset.uri));
    }
  };

  const handleUseCurrentLocation = async () => {
    if (locating) return;
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!handlePermission(permission, {
        title: "صلاحية الموقع مطلوبة",
        message: "اسمح بالوصول إلى الموقع لتحديد مكان الحالة تلقائيًا.",
      })) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setRegion((previous) => ({
        ...previous,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }));
    } catch {
      showFeedback({ title: "تعذر تحديد الموقع", message: "يمكنك تحريك الخريطة يدويًا وتحديد الموقع المطلوب.", tone: "warning" });
    } finally {
      setLocating(false);
    }
  };

  const renderStatusIcon = (item: (typeof ANIMAL_STATUSES)[0]) => {
    const iconColor = COLORS.brown;
    if (item.lib === "FontAwesome5") {
      return (
        <FontAwesome5 name={item.icon as ComponentProps<typeof FontAwesome5>["name"]} size={20} color={iconColor} />
      );
    }
    return (
      <MaterialCommunityIcons
        name={item.icon as ComponentProps<typeof MaterialCommunityIcons>["name"]}
        size={24}
        color={iconColor}
      />
    );
  };

  return (
    <Screen padded={false} safeAreaEdges={["top", "bottom"]} style={styles.screen}>
      <ScreenHeader
        title="إرسال بلاغ جديد"
        onBack={() => router.back()}
        right={
          <IconButton
            icon="help-circle-outline"
            accessibilityLabel="فتح مركز المساعدة"
            onPress={() => router.push(ROUTES.helpCenter)}
          />
        }
      />

      <View style={styles.container}>

        {/* Stepper / شريط الخطوات */}
        <View style={styles.stepperContainer}>
          {[
            { number: 1, label: "المعلومات", complete: informationComplete },
            { number: 2, label: "الموقع", complete: locationComplete },
            { number: 3, label: "المراجعة", complete: false },
          ].map((step, index, steps) => {
            const active = currentStep === step.number;
            const reached = currentStep >= step.number;

            return (
              <React.Fragment key={step.number}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      (active || step.complete) && styles.stepCircleActive,
                    ]}
                  >
                    {step.complete ? (
                      <Ionicons name="checkmark" size={17} color={COLORS.white} />
                    ) : (
                      <AppText
                        variant="label"
                        color={reached ? COLORS.white : COLORS.textSecondary}
                        weight={active ? "bold" : undefined}
                      >
                        {step.number}
                      </AppText>
                    )}
                  </View>
                  <AppText
                    variant="caption"
                    color={reached ? COLORS.brown : COLORS.textSecondary}
                    weight={active ? "bold" : undefined}
                  >
                    {step.label}
                  </AppText>
                </View>

                {index < steps.length - 1 ? (
                  <View
                    style={[
                      styles.stepLine,
                      currentStep > step.number && styles.stepLineActive,
                    ]}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.formScrollView}
        >
          {/* صور الحالة */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            صور الحالة
          </AppText>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="إرفاق صور الحالة" onPress={() => void handlePickImages()} activeOpacity={0.7} style={styles.uploadBox}>
            <View style={styles.uploadIconsRow}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={28}
                color={COLORS.brown}
              />
              <Ionicons
                name="image-outline"
                size={28}
                color={COLORS.brown}
                style={{ marginStart: 8 }}
              />
            </View>
            <AppText
              variant="bodySmall"
              weight="bold"
              color={COLORS.text}
              style={{ marginTop: 8, flexShrink: 0}}
            >
              اضغط هنا لرفع الصور
            </AppText>
            <AppText
              variant="caption"
              color={COLORS.textSecondary}
              style={{ marginTop: 2 }}
            >
              يمكنك رفع حتى 5 صور
            </AppText>
          </TouchableOpacity>
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesRow}>
              {selectedImages.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.selectedImagePreview} />
              ))}
            </View>
          )}

          {/* نوع الحيوان */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            نوع الحيوان
          </AppText>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="اختيار نوع الحيوان" onPress={handleChooseAnimalType} style={styles.dropdownBox}>
            <AppText variant="body" color={COLORS.text}>
              {selectedAnimalType}
            </AppText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* عدد الحيوانات */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            عدد الحيوانات
          </AppText>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
              style={styles.counterBtn}
            >
              <Ionicons name="remove" size={20} color={COLORS.brown} />
            </TouchableOpacity>

            <AppText variant="h3" weight="bold" color={COLORS.text}>
              {count}
            </AppText>

            <TouchableOpacity
              onPress={() => setCount((prev) => prev + 1)}
              style={styles.counterBtn}
            >
              <Ionicons name="add" size={20} color={COLORS.brown} />
            </TouchableOpacity>
          </View>

          {/* حالة الحيوان */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            حالة الحيوان
          </AppText>
          <View style={styles.statusGrid}>
            {ANIMAL_STATUSES.map((item) => {
              const isSelected = selectedStatus === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.statusCard,
                    isSelected && styles.statusCardSelected,
                  ]}
                  onPress={() => setSelectedStatus(item.id)}
                >
                  {renderStatusIcon(item)}
                  <AppText
                    variant="bodySmall"
                    color={COLORS.text}
                    style={{ marginTop: 6 }}
                  >
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* درجة الخطورة */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            درجة الخطورة
          </AppText>
          <View style={styles.severityContainer}>
            {SEVERITY_LEVELS.map((item) => {
              const isSelected = selectedSeverity === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={[
                    styles.severityCardFirstImage,
                    isSelected && styles.severityCardSelected,
                  ]}
                  onPress={() => setSelectedSeverity(item.id)}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={isSelected ? COLORS.brown : COLORS.brownMuted}
                  />

                  <View style={styles.severityTextWrapper}>
                    <AppText
                      variant="label"
                      weight="bold"
                      color={
                        item.isUrgent && !isSelected
                          ? COLORS.urgent
                          : COLORS.text
                      }
                    >
                      {item.title}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={COLORS.textSecondary}
                      style={{ marginTop: 2, textAlign: "auto" }}
                    >
                      {item.desc}
                    </AppText>
                  </View>

                  {item.isUrgent && (
                    <AppText
                      variant="h2"
                      weight="bold"
                      color={COLORS.urgent}
                      style={styles.urgentAsterisk}
                    >
                      *
                    </AppText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* وصف الحالة */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            وصف الحالة
          </AppText>
          <View style={styles.textareaContainer}>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="اشرح ما شاهدته بالتفصيل لمساعدتنا في التقييم..."
              placeholderTextColor={COLORS.placeholder}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              style={styles.textareaInput}
            />
            <AppText
              variant="caption"
              color={COLORS.textSecondary}
              style={styles.charCounter}
            >
              {description.length} / 500
            </AppText>
          </View>

          {/* الموقع */}
          <AppText
            variant="label"
            weight="bold"
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            الموقع
          </AppText>
          <View style={styles.locationFields}>
            <LocationLookupSelect
              label="المحافظة"
              placeholder="اختر المحافظة"
              value={governorateId}
              selectedLabel={governorateName}
              options={locationLookups.governorateOptions}
              visible={governorateSheetVisible}
              required
              loading={locationLookups.loadingGovernorates}
              onOpen={() => setGovernorateSheetVisible(true)}
              onClose={() => setGovernorateSheetVisible(false)}
              onSelect={(value) => {
                const selected = locationLookups.governorates.find((item) => item.id === value);
                setGovernorateId(value);
                setGovernorateName(selected?.name ?? "");
                setRegionId("");
                setRegionName("");
                setGovernorateSheetVisible(false);
                setFormError(null);
              }}
            />
            <LocationLookupSelect
              label="المنطقة"
              placeholder={governorateId ? "اختر المنطقة" : "اختر المحافظة أولًا"}
              value={regionId}
              selectedLabel={regionName}
              options={locationLookups.regionOptions}
              visible={regionSheetVisible}
              required
              disabled={!governorateId}
              loading={locationLookups.loadingRegions}
              onOpen={() => setRegionSheetVisible(true)}
              onClose={() => setRegionSheetVisible(false)}
              onSelect={(value) => {
                const selected = locationLookups.regions.find((item) => item.id === value);
                setRegionId(value);
                setRegionName(selected?.name ?? "");
                setRegionSheetVisible(false);
                setFormError(null);
              }}
            />
            <Input
              label="العنوان / أقرب معلم"
              required
              value={address}
              onChangeText={(value) => { setAddress(value); setFormError(null); }}
              placeholder="مثال: شارع بغداد - قرب الحديقة"
            />
            {locationLookups.error ? <AppText variant="bodySmall" color={COLORS.urgent}>{locationLookups.error}</AppText> : null}
          </View>

          <View style={styles.mapCard}>
            <View style={styles.mapContainer}>
              <CreateReportLocationMap style={styles.map} region={region} onRegionChange={setRegion} />
            </View>

            <View style={styles.mapActions}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="استخدام موقعي الحالي" disabled={locating} onPress={() => void handleUseCurrentLocation()} style={[styles.currentLocationBtn, locating && styles.disabledAction]}>
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color={COLORS.white}
                />
                <AppText
                  variant="label"
                  color={COLORS.white}
                  weight="bold"
                  style={{ marginStart: 6 }}
                >
                  {locating ? "جارٍ تحديد الموقع..." : "حدد الموقع الحالي"}
                </AppText>
              </TouchableOpacity>

              <View style={styles.mapPickerHint}>
                <Ionicons name="move-outline" size={18} color={COLORS.brown} />
                <AppText variant="caption" color={COLORS.brown} style={{ marginStart: 6 }}>
                  حرّك الخريطة لتثبيت العلامة على موقع الحالة
                </AppText>
              </View>
            </View>

            <View style={styles.privacyNoteRow}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <AppText
                variant="caption"
                color={COLORS.textSecondary}
                style={{ marginStart: 4, flex: 1, textAlign: "auto" }}
              >
                لن يتم مشاركة موقعك الدقيق مع أي جهة، سيستخدم فقط لتوجيه فرق
                الإنقاذ.
              </AppText>
            </View>
          </View>

          {/* تنبيه هام */}
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={COLORS.urgent}
              />
              <AppText
                variant="label"
                weight="bold"
                color={COLORS.urgent}
                style={{ marginStart: 6 }}
              >
                تنبيه هام
              </AppText>
            </View>
            <AppText variant="bodySmall" color={COLORS.urgent} style={styles.warningText}>
              إذا كان الحيوان يشكل خطراً مباشراً على نفسه أو على المارة (على
              طريق سريع مثلاً)، يرجى الاتصال المباشر برقم الطوارئ المتاح في
              واجهة المساعدة.
            </AppText>
          </View>

          {/* زر إرسال البلاغ المعدل */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.submitBtn}
            disabled={submitting}
            onPress={async () => {
              const statusLabel = ANIMAL_STATUSES.find((item) => item.id === selectedStatus)?.label ?? "حالة حيوان";
              if (!governorateId || !regionId || !address.trim()) {
                setFormError("يرجى اختيار المحافظة والمنطقة وإدخال عنوان واضح للحالة.");
                return;
              }
              if ((description.trim() || statusLabel).length < 5) {
                setFormError("يرجى كتابة وصف أوضح للحالة.");
                return;
              }
              setFormError(null);
              try {
                const createdReport = await submit({
                  title: `${statusLabel} • ${count > 1 ? `${count} حيوانات` : "حيوان واحد"}`,
                  description: description.trim() || statusLabel,
                  subtitle: description.trim() || `بلاغ ${statusLabel} • ${selectedAnimalType}`,
                  animalType: selectedAnimalType === "قط" ? "cat" : selectedAnimalType === "طائر" ? "bird" : selectedAnimalType === "أرنب" ? "rabbit" : selectedAnimalType === "أخرى" ? "other" : "dog",
                  imageUrl: selectedImages[0],
                  mediaLocalUris: selectedImages,
                  locationName: regionName || governorateName || address.trim(),
                  governorateId,
                  governorateName,
                  regionId,
                  regionName,
                  address: address.trim(),
                  latitude: region.latitude,
                  longitude: region.longitude,
                  priority: selectedSeverity === "critical" || selectedSeverity === "high" ? "urgent" : "normal",
                  userId: account?.id ?? "",
                });
                router.push({ pathname: ROUTES.reportSuccess, params: { id: createdReport.id, code: createdReport.code } });
              } catch {
                // Error text is rendered below the button.
              }
            }}
          >
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={COLORS.white}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
            <AppText
              variant="h3"
              color={COLORS.white}
              weight="bold"
              style={{ marginStart: 8 }}
            >
              {submitting ? "جاري الإرسال..." : "إرسال البلاغ"}
            </AppText>
          </TouchableOpacity>
          {formError ? <AppText variant="bodySmall" color={COLORS.urgent} style={{ marginTop: SPACING.sm }}>{formError}</AppText> : null}
          {submitError ? <AppText variant="bodySmall" color={COLORS.urgent} style={{ marginTop: SPACING.sm }}>{submitError}</AppText> : null}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
      <SelectionSheet
        visible={animalTypeSheetVisible}
        title="نوع الحيوان"
        selectedValue={selectedAnimalType}
        options={[
          { value: "كلب", label: "كلب" },
          { value: "قط", label: "قط" },
          { value: "طائر", label: "طائر" },
          { value: "أرنب", label: "أرنب" },
          { value: "أخرى", label: "أخرى" },
        ]}
        onSelect={setSelectedAnimalType}
        onClose={() => setAnimalTypeSheetVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: LAYOUT.screenPadding },
  header: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  headerBtn: { padding: 4 },
  stepperContainer: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.sm,
    paddingHorizontal: 10,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.darkgray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: COLORS.brown },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: { backgroundColor: COLORS.brown },
  formScrollView: { flex: 1 },
  selectedImagesRow: {
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  selectedImagePreview: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  fieldLabel: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  uploadBox: {
    borderWidth: 1.6,
    borderColor: COLORS.tan,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    height: 140,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  uploadIconsRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dropdownBox: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  counterContainer: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  counterBtn: { padding: 4 },
  statusGrid: {
    flexDirection: "row", direction: "rtl",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  statusCard: {
    width: "48%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCardSelected: {
    borderColor: COLORS.brown,
    borderWidth: 1.5,
    elevation: 1,
  },
  severityContainer: { gap: 10 },
  severityCardFirstImage: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 12,
  },
  severityCardSelected: {
    backgroundColor: COLORS.peach,
    borderColor: COLORS.brown,
    borderWidth: 1.5,
  },
  severityTextWrapper: { flex: 1, marginStart: 10 },
  urgentAsterisk: { marginEnd: 6 },
  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 12,
    minHeight: 110,
    justifyContent: "space-between",
  },
  textareaInput: {
    textAlign: "right",
    textAlignVertical: "top",
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
    color: COLORS.text,
  },
  charCounter: { textAlign: "auto", marginTop: 6 },
  locationFields: { gap: SPACING.md, marginBottom: SPACING.md },
  mapCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 10,
    overflow: "hidden",
  },
  mapContainer: {
    height: 180,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapActions: { gap: 8, marginTop: 6 },
  currentLocationBtn: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 10,
  },
  mapPickerHint: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    width: "100%",
  },
  disabledAction: { opacity: 0.6 },
  privacyNoteRow: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
  },
  textInput: { textAlign: "right", writingDirection: "rtl", fontFamily: FONTS.regular, fontSize: TYPOGRAPHY.body.fontSize, lineHeight: TYPOGRAPHY.body.lineHeight, color: COLORS.text },
  warningBox: {
    backgroundColor: COLORS.peach,
    borderRadius: RADIUS.md,
    padding: 14,
    marginTop: 20,
  },
  warningHeader: { flexDirection: "row", direction: "rtl", alignItems: "center" },
  warningText: { textAlign: "auto", marginTop: 6, lineHeight: 18 },
  submitBtn: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: 20,
  },
});
