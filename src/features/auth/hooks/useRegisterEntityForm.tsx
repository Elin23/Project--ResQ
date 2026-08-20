import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Platform, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import type { MapPressEvent, Region } from "react-native-maps";
import AppText from "@/src/components/ui/AppText";
import { COLORS } from "@/src/theme";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import { styles } from "@/src/features/auth/screens/RegisterEntity.styles";
import { SYRIAN_GOVERNORATES } from "@/src/features/auth/constants/governorates";
import { ENTITY_CLINIC_ANIMALS, ENTITY_CLINIC_SERVICES, ENTITY_CLINIC_TYPES, ENTITY_ORGANIZATION_ACTIVITIES, ENTITY_ORGANIZATION_ANIMALS, ENTITY_ORGANIZATION_TYPES } from "@/src/features/auth/constants/registerEntity";
import type { RegisterEntityChipOption, RegisterEntityErrors, RegisterEntityType, RegisterEntityUploadKey } from "@/src/features/auth/types/registerEntity";
import { buildRegisterEntityPayload, getRegisterEntityErrors } from "@/src/features/auth/utils/registerEntityForm";
import { ENTITY_MANAGER_MINIMUM_AGE, getMaximumBirthDate, getMinimumBirthDate, getRegistrationPasswordRequirements, getRegistrationPasswordStrength, normalizeSyrianMobile } from "@/src/features/auth/utils/registrationValidation";

export function useRegisterEntityForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entityType?: string }>();
  const { width } = useWindowDimensions();
  const { handlePermission } = usePermissionFeedback();

  const entityType: RegisterEntityType = "organization";
  const isClinic = false;
  const entityTitle = "جمعية / منظمة";

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
  const [errors, setErrors] = useState<RegisterEntityErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const maximumBirthDate = useMemo(
    () => getMaximumBirthDate(ENTITY_MANAGER_MINIMUM_AGE),
    [],
  );
  const minimumBirthDate = useMemo(() => getMinimumBirthDate(), []);

  const formattedBirthDate = useMemo(() => {
    if (!birthDate) return "";
    return new Intl.DateTimeFormat("ar-SY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(birthDate);
  }, [birthDate]);

  const categories = isClinic ? ENTITY_CLINIC_TYPES : ENTITY_ORGANIZATION_TYPES;
  const activityOptions = isClinic
    ? ENTITY_CLINIC_SERVICES
    : ENTITY_ORGANIZATION_ACTIVITIES;
  const animalOptions = isClinic
    ? ENTITY_CLINIC_ANIMALS
    : ENTITY_ORGANIZATION_ANIMALS;

  const passwordRequirements = useMemo(
    () => getRegistrationPasswordRequirements(password),
    [password],
  );

  const passwordStrength = useMemo(
    () => getRegistrationPasswordStrength(password),
    [password],
  );

  const passwordStrengthLabel =
    passwordStrength === 3
      ? "قوية"
      : passwordStrength === 2
        ? "متوسطة"
        : "ضعيفة";
  const passwordStrengthColor =
    passwordStrength === 3
      ? COLORS.strengthStrong
      : passwordStrength === 2
        ? COLORS.strengthMedium
        : COLORS.strengthWeak;

  const validationInput = {
    entityType,
    entityTitle,
    fullName,
    email,
    birthDate,
    phone,
    entityName,
    entityCategory,
    licenseNumber,
    issuingAuthority,
    description,
    serviceGovernorate,
    serviceDistrict,
    selectedLocation,
    selectedActivities,
    selectedAnimals,
    open24Hours,
    workingHours,
    hasShelter,
    shelterCapacity,
    acceptsVolunteers,
    volunteerRequirements,
    licenseDocument,
    password,
    confirmPassword,
    informationConfirmed,
    verificationConfirmed,
    termsAccepted,
  };

  const canSubmit =
    Object.values(getRegisterEntityErrors(validationInput)).every(
      (message) => !message,
    ) &&
    passwordStrength === 3 &&
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
    router.replace("/choose-account");
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

  const pickImage = async (key: RegisterEntityUploadKey) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, { title: "صلاحية الصور مطلوبة", message: "اسمح بالوصول إلى الصور لإرفاق المستندات المطلوبة للتسجيل." })) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
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

      if (!handlePermission(permission, { title: "صلاحية الموقع مطلوبة", message: "اسمح بالوصول إلى الموقع لتحديد موقع الجمعية بدقة." })) return;

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
    const nextErrors = getRegisterEntityErrors(validationInput);
    setErrors(nextErrors);

    const isValid = Object.values(nextErrors).every((message) => !message);

    if (!isValid) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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

      const payload = buildRegisterEntityPayload({
        ...validationInput,
        logo,
        managerDocument,
        extraDocument,
        homeVisits,
        emergencyService,
      });

      await new Promise((resolve) => setTimeout(resolve, 900));
      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: payload.manager.phone,
          accountType: "entity",
          entityType,
          name: entityName.trim(),
          email: email.trim(),
        },
      });
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
    items: readonly string[],
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
              <Ionicons name="checkmark-circle" size={20} color={COLORS.strengthStrong} />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderChips = (
    options: RegisterEntityChipOption[],
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
              color={active ? COLORS.onColor : COLORS.textMuted}
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
    key: RegisterEntityUploadKey,
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
        <Ionicons name="document-attach-outline" size={30} color={COLORS.iconMuted} />
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
    router,
    entityType,
    isClinic,
    entityTitle,
    horizontalPadding,
    contentWidth,
    fullName,
    setFullName,
    email,
    setEmail,
    birthDate,
    setBirthDate,
    temporaryBirthDate,
    setTemporaryBirthDate,
    phone,
    setPhone,
    normalizeSyrianMobile,
    entityName,
    setEntityName,
    entityCategory,
    setEntityCategory,
    licenseNumber,
    setLicenseNumber,
    issuingAuthority,
    setIssuingAuthority,
    description,
    setDescription,
    serviceGovernorate,
    setServiceGovernorate,
    serviceDistrict,
    setServiceDistrict,
    selectedActivities,
    setSelectedActivities,
    selectedAnimals,
    setSelectedAnimals,
    hasShelter,
    setHasShelter,
    shelterCapacity,
    setShelterCapacity,
    acceptsVolunteers,
    setAcceptsVolunteers,
    volunteerRequirements,
    setVolunteerRequirements,
    open24Hours,
    setOpen24Hours,
    workingHours,
    setWorkingHours,
    homeVisits,
    setHomeVisits,
    emergencyService,
    setEmergencyService,
    logo,
    setLogo,
    licenseDocument,
    setLicenseDocument,
    managerDocument,
    setManagerDocument,
    extraDocument,
    setExtraDocument,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    informationConfirmed,
    setInformationConfirmed,
    verificationConfirmed,
    setVerificationConfirmed,
    termsAccepted,
    setTermsAccepted,
    showBirthDatePicker,
    setShowBirthDatePicker,
    showServiceGovernorates,
    setShowServiceGovernorates,
    showCategories,
    setShowCategories,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showMapPicker,
    setShowMapPicker,
    mapRegion,
    setMapRegion,
    selectedLocation,
    setSelectedLocation,
    temporaryLocation,
    setTemporaryLocation,
    isLocating,
    errors,
    setErrors,
    isSubmitting,
    submitAttempted,
    maximumBirthDate,
    minimumBirthDate,
    formattedBirthDate,
    categories,
    activityOptions,
    animalOptions,
    passwordRequirements,
    passwordStrength,
    passwordStrengthLabel,
    passwordStrengthColor,
    canSubmit,
    closeDropdowns,
    handleBack,
    openBirthDatePicker,
    handleBirthDateChange,
    confirmBirthDate,
    toggleValue,
    pickImage,
    openMapPicker,
    handleMapPress,
    useCurrentLocation,
    confirmMapLocation,
    validateForm,
    handleSubmit,
    renderError,
    renderSectionHeader,
    renderDropdown,
    renderChips,
    renderUploadCard,
    GOVERNORATES: SYRIAN_GOVERNORATES,
  };

  return { ...form, scrollViewRef };
}

export type RegisterEntityForm = ReturnType<typeof useRegisterEntityForm>;
