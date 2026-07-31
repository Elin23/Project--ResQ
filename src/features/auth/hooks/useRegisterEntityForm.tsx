import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
      Switch,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "@/src/features/auth/screens/RegisterEntity.styles";

type EntityType = "clinic" | "organization";
type UploadKey = "logo" | "license" | "manager" | "extra";
type Errors = Partial<
  Record<
    | "fullName"
    | "email"
    | "birthDate"
    | "phone"
    | "entityName"
    | "entityCategory"
    | "licenseNumber"
    | "issuingAuthority"
    | "description"
    | "serviceGovernorate"
    | "serviceDistrict"
    | "mapLocation"
    | "activities"
    | "animals"
    | "workingHours"
    | "shelterCapacity"
    | "volunteerRequirements"
    | "licenseDocument"
    | "password"
    | "confirmPassword"
    | "information"
    | "verification"
    | "terms",
    string
  >
>;

type ChipOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const GOVERNORATES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة",
];

const ORGANIZATION_TYPES = [
  "جمعية مرخصة",
  "منظمة غير ربحية",
  "فريق إنقاذ مسجل",
  "مأوى حيوانات",
  "مبادرة مجتمعية",
];

const CLINIC_TYPES = [
  "عيادة بيطرية عامة",
  "مشفى بيطري",
  "مركز لقاحات ورعاية",
  "عيادة تخصصية",
  "مركز إسعاف بيطري",
];

const ORGANIZATION_ACTIVITIES: ChipOption[] = [
  { id: "rescue", label: "إنقاذ ميداني", icon: "paw-outline" },
  { id: "shelter", label: "إيواء", icon: "home-outline" },
  { id: "adoption", label: "تبنّي", icon: "heart-outline" },
  { id: "awareness", label: "توعية", icon: "megaphone-outline" },
  { id: "treatment", label: "علاج", icon: "medkit-outline" },
];

const CLINIC_SERVICES: ChipOption[] = [
  { id: "emergency", label: "إسعاف", icon: "medical-outline" },
  { id: "examination", label: "فحص", icon: "search-outline" },
  { id: "vaccination", label: "لقاحات", icon: "shield-checkmark-outline" },
  { id: "surgery", label: "جراحة", icon: "cut-outline" },
  { id: "laboratory", label: "تحاليل", icon: "flask-outline" },
  { id: "imaging", label: "تصوير", icon: "scan-outline" },
];

const ORGANIZATION_ANIMALS: ChipOption[] = [
  { id: "cats", label: "قطط", icon: "paw-outline" },
  { id: "dogs", label: "كلاب", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];

const CLINIC_ANIMALS: ChipOption[] = [
  { id: "pets", label: "حيوانات أليفة", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "farm", label: "حيوانات مزرعة", icon: "nutrition-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];

export function useRegisterEntityForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entityType?: string }>();
  const { width } = useWindowDimensions();

  const entityType: EntityType =
    params.entityType === "clinic" ? "clinic" : "organization";
  const isClinic = entityType === "clinic";
  const entityTitle = isClinic ? "عيادة" : "جمعية / منظمة";

  const horizontalPadding = Math.max(17, Math.min(width * 0.048, 30));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(1990, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [entityName, setEntityName] = useState("");
  const [entityCategory, setEntityCategory] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [description, setDescription] = useState("");
  const [serviceGovernorate, setServiceGovernorate] = useState("");
  const [serviceDistrict, setServiceDistrict] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);

  const [hasShelter, setHasShelter] = useState(false);
  const [shelterCapacity, setShelterCapacity] = useState("");
  const [acceptsVolunteers, setAcceptsVolunteers] = useState(true);
  const [volunteerRequirements, setVolunteerRequirements] = useState("");

  const [open24Hours, setOpen24Hours] = useState(false);
  const [workingHours, setWorkingHours] = useState("");
  const [homeVisits, setHomeVisits] = useState(false);
  const [emergencyService, setEmergencyService] = useState(false);

  const [logo, setLogo] = useState<string | null>(null);
  const [licenseDocument, setLicenseDocument] = useState<string | null>(null);
  const [managerDocument, setManagerDocument] = useState<string | null>(null);
  const [extraDocument, setExtraDocument] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [informationConfirmed, setInformationConfirmed] = useState(false);
  const [verificationConfirmed, setVerificationConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showServiceGovernorates, setShowServiceGovernorates] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 33.5138,
    longitude: 36.2765,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [temporaryLocation, setTemporaryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const maximumBirthDate = useMemo(() => new Date(), []);
  const minimumBirthDate = useMemo(() => new Date(1900, 0, 1), []);

  const formattedBirthDate = useMemo(() => {
    if (!birthDate) return "";
    return new Intl.DateTimeFormat("ar-SY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(birthDate);
  }, [birthDate]);

  const categories = isClinic ? CLINIC_TYPES : ORGANIZATION_TYPES;
  const activityOptions = isClinic ? CLINIC_SERVICES : ORGANIZATION_ACTIVITIES;
  const animalOptions = isClinic ? CLINIC_ANIMALS : ORGANIZATION_ANIMALS;

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Za-z\u0600-\u06FF]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    return score;
  }, [password]);

  const passwordStrengthLabel =
    passwordStrength === 3
      ? "قوية"
      : passwordStrength === 2
        ? "متوسطة"
        : "ضعيفة";
  const passwordStrengthColor =
    passwordStrength === 3
      ? "#18833B"
      : passwordStrength === 2
        ? "#E28B2D"
        : "#C92835";

  const canSubmit =
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    birthDate !== null &&
    /^9\d{8}$/.test(phone) &&
    entityName.trim().length >= 3 &&
    entityCategory.length > 0 &&
    licenseNumber.trim().length >= 3 &&
    issuingAuthority.trim().length >= 3 &&
    description.trim().length >= 20 &&
    serviceGovernorate.length > 0 &&
    serviceDistrict.trim().length >= 2 &&
    selectedLocation !== null &&
    selectedActivities.length > 0 &&
    selectedAnimals.length > 0 &&
    licenseDocument !== null &&
    passwordStrength === 3 &&
    confirmPassword === password &&
    (!isClinic || open24Hours || workingHours.trim().length >= 3) &&
    (isClinic || !hasShelter || Number(shelterCapacity) > 0) &&
    informationConfirmed &&
    verificationConfirmed &&
    termsAccepted &&
    !isSubmitting;

  const closeDropdowns = () => {
    setShowServiceGovernorates(false);
    setShowCategories(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/choose-account" as never);
  };

  const openBirthDatePicker = () => {
    setTemporaryBirthDate(birthDate ?? new Date(1990, 0, 1));
    closeDropdowns();
    setShowBirthDatePicker(true);
  };

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowBirthDatePicker(false);
      if (event.type === "set" && selectedDate) {
        setBirthDate(selectedDate);
        setErrors((current) => ({ ...current, birthDate: undefined }));
      }
      return;
    }
    if (selectedDate) setTemporaryBirthDate(selectedDate);
  };

  const confirmBirthDate = () => {
    setBirthDate(temporaryBirthDate);
    setShowBirthDatePicker(false);
    setErrors((current) => ({ ...current, birthDate: undefined }));
  };

  const toggleValue = (
    value: string,
    current: string[],
    setter: (value: string[]) => void,
    key: "activities" | "animals",
  ) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setErrors((state) => ({ ...state, [key]: undefined }));
  };

  const pickImage = async (key: UploadKey) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: key === "logo" ? [1, 1] : [4, 3],
      quality: 0.85,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) return;

    if (key === "logo") setLogo(uri);
    if (key === "license") {
      setLicenseDocument(uri);
      setErrors((current) => ({ ...current, licenseDocument: undefined }));
    }
    if (key === "manager") setManagerDocument(uri);
    if (key === "extra") setExtraDocument(uri);
  };

  const openMapPicker = () => {
    closeDropdowns();

    const initialLocation = selectedLocation ?? {
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
    };

    setTemporaryLocation(initialLocation);
    setMapRegion((current) => ({
      ...current,
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
    }));
    setShowMapPicker(true);
  };

  const handleMapPress = (event: MapPressEvent) => {
    setTemporaryLocation(event.nativeEvent.coordinate);
  };

  const useCurrentLocation = async () => {
    try {
      setIsLocating(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinate = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setTemporaryLocation(coordinate);
      setMapRegion({
        ...coordinate,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } finally {
      setIsLocating(false);
    }
  };

  const confirmMapLocation = () => {
    if (!temporaryLocation) {
      return;
    }

    setSelectedLocation(temporaryLocation);
    setShowMapPicker(false);
    setErrors((current) => ({ ...current, mapLocation: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!fullName.trim()) nextErrors.fullName = "الاسم الكامل مطلوب";
    else if (fullName.trim().length < 3)
      nextErrors.fullName = "يجب أن يتكون الاسم من 3 أحرف على الأقل";
    if (!email.trim()) nextErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email =
        "صيغة البريد الإلكتروني غير صحيحة، مثال: name@example.com";
    if (!birthDate) nextErrors.birthDate = "يرجى اختيار تاريخ الميلاد";
    if (!phone) nextErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^9\d{8}$/.test(phone))
      nextErrors.phone = "أدخل 9 أرقام ويجب أن يبدأ الرقم بالرقم 9";
    if (entityName.trim().length < 3)
      nextErrors.entityName = `يرجى إدخال اسم ${entityTitle}`;
    if (!entityCategory)
      nextErrors.entityCategory = `يرجى اختيار نوع ${entityTitle}`;
    if (!licenseNumber.trim()) nextErrors.licenseNumber = "رقم الترخيص مطلوب";
    else if (licenseNumber.trim().length < 3)
      nextErrors.licenseNumber = "رقم الترخيص قصير جدًا";
    if (!issuingAuthority.trim())
      nextErrors.issuingAuthority = "جهة إصدار الترخيص مطلوبة";
    else if (issuingAuthority.trim().length < 3)
      nextErrors.issuingAuthority = "يرجى كتابة اسم جهة الإصدار بشكل أوضح";
    if (description.trim().length < 20)
      nextErrors.description = "يرجى إضافة نبذة لا تقل عن 20 حرفًا";
    if (!serviceGovernorate)
      nextErrors.serviceGovernorate = "يرجى اختيار محافظة موقع الجهة";
    if (!serviceDistrict.trim())
      nextErrors.serviceDistrict = "المنطقة أو الحي مطلوب";
    else if (serviceDistrict.trim().length < 2)
      nextErrors.serviceDistrict = "يرجى كتابة اسم المنطقة أو الحي بشكل صحيح";
    if (!selectedLocation)
      nextErrors.mapLocation = "يرجى تحديد الموقع بدقة على الخريطة";
    if (selectedActivities.length === 0)
      nextErrors.activities = isClinic
        ? "يرجى اختيار خدمة واحدة على الأقل"
        : "يرجى اختيار نشاط واحد على الأقل";
    if (selectedAnimals.length === 0)
      nextErrors.animals = "يرجى اختيار الحيوانات التي تخدمها الجهة";
    if (isClinic && !open24Hours && workingHours.trim().length < 3)
      nextErrors.workingHours =
        "يرجى إدخال أوقات دوام العيادة أو تفعيل خيار 24 ساعة";
    if (!isClinic && hasShelter && Number(shelterCapacity) <= 0)
      nextErrors.shelterCapacity = "يرجى إدخال سعة صحيحة لمنشأة الإيواء";
    if (
      !isClinic &&
      acceptsVolunteers &&
      volunteerRequirements.trim().length > 0 &&
      volunteerRequirements.trim().length < 10
    )
      nextErrors.volunteerRequirements =
        "اكتب متطلبات التطوع بشكل أوضح أو اترك الحقل فارغًا";
    if (!licenseDocument)
      nextErrors.licenseDocument = "صورة الترخيص مطلوبة للتحقق";
    if (passwordStrength < 3)
      nextErrors.password =
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف ورقم";
    if (!confirmPassword) nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    else if (confirmPassword !== password)
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    if (!informationConfirmed)
      nextErrors.information = "يجب تأكيد صحة المعلومات";
    if (!verificationConfirmed)
      nextErrors.verification = "يجب الموافقة على مراجعة واعتماد الجهة";
    if (!termsAccepted)
      nextErrors.terms = "يجب الموافقة على الشروط وسياسة الخصوصية";

    setErrors(nextErrors);

    const isValid = Object.keys(nextErrors).length === 0;

    if (!isValid) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      });
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setSubmitAttempted(true);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const sharedPayload = {
        accountType: "entity-admin",
        entityType,
        manager: {
          fullName: fullName.trim(),
          email: email.trim(),
          birthDate: birthDate?.toISOString() ?? "",
          phone: `+963${phone}`,
        },
        entity: {
          name: entityName.trim(),
          category: entityCategory,
          licenseNumber: licenseNumber.trim(),
          issuingAuthority: issuingAuthority.trim(),
          description: description.trim(),
          serviceGovernorate,
          serviceDistrict: serviceDistrict.trim(),
          location: selectedLocation,
          supportedAnimals: selectedAnimals,
          logo,
          licenseDocument,
          managerDocument,
        },
        password,
      };

      const payload = isClinic
        ? {
            ...sharedPayload,
            clinicDetails: {
              services: selectedActivities,
              open24Hours,
              workingHours: open24Hours ? "24/7" : workingHours.trim(),
              homeVisits,
              emergencyService,
              doctorLicenseDocument: extraDocument,
            },
          }
        : {
            ...sharedPayload,
            organizationDetails: {
              activities: selectedActivities,
              hasShelter,
              shelterCapacity: hasShelter ? shelterCapacity : "",
              acceptsVolunteers,
              volunteerRequirements: acceptsVolunteers
                ? volunteerRequirements.trim()
                : "",
              policyDocument: extraDocument,
            },
          };

      await new Promise((resolve) => setTimeout(resolve, 900));
      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: `+963${phone}`,
          accountType: "entity",
          entityType,
          name: entityName.trim(),
          email: email.trim(),
        },
      } as never);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (message?: string) =>
    message ? <AppText style={styles.errorText}>{message}</AppText> : null;

  const renderSectionHeader = (title: string, spaced = false) => (
    <View style={[styles.sectionHeader, spaced && styles.spacedHeader]}>
      <View style={styles.sectionMarker} />
      <AppText style={styles.sectionTitle}>{title}</AppText>
    </View>
  );

  const renderDropdown = (
    items: string[],
    value: string,
    onSelect: (item: string) => void,
  ) => (
    <View style={styles.dropdown}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.dropdownContent}
      >
        {items.map((item) => (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.dropdownItem,
              value === item && styles.selectedDropdownItem,
              pressed && styles.dropdownItemPressed,
            ]}
          >
            <AppText style={styles.dropdownItemText}>{item}</AppText>
            {value === item ? (
              <Ionicons name="checkmark-circle" size={20} color="#16833A" />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderChips = (
    options: ChipOption[],
    selected: string[],
    onToggle: (id: string) => void,
  ) => (
    <View style={styles.choiceWrap}>
      {options.map((item) => {
        const active = selected.includes(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={[styles.choiceChip, active && styles.selectedChoiceChip]}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={active ? "#FFFFFF" : "#646A64"}
            />
            <AppText
              style={[styles.choiceText, active && styles.selectedChoiceText]}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );

  const renderUploadCard = (
    key: UploadKey,
    title: string,
    subtitle: string,
    uri: string | null,
    required = false,
  ) => (
    <Pressable
      onPress={() => pickImage(key)}
      style={[
        styles.uploadCard,
        required && errors.licenseDocument && styles.uploadCardError,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.uploadPreview} />
      ) : (
        <Ionicons name="document-attach-outline" size={30} color="#7B877B" />
      )}
      <View style={styles.uploadTextWrap}>
        <AppText style={styles.uploadTitle}>{title}</AppText>
        <AppText style={styles.uploadSubtitle}>{subtitle}</AppText>
      </View>
      <View style={styles.uploadButton}>
        <AppText style={styles.uploadButtonText}>
          {uri ? "تم الرفع" : "رفع الملف"}
        </AppText>
      </View>
    </Pressable>
  );

  const form = {
    router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES
  };

  return { ...form, scrollViewRef, horizontalPadding, contentWidth, entityTitle, handleBack };
}

export type RegisterEntityForm = ReturnType<typeof useRegisterEntityForm>;
