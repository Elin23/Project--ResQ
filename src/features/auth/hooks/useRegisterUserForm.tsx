import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS } from "@/src/theme";
import { styles } from "@/src/features/auth/screens/RegisterUser.styles";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { authApi } from "@/src/services/api/authApi";
import { saveAuthTokens } from "@/src/services/api/authTokens";
import { ApiError } from "@/src/services/api/client";
import { formatSyrianMobileInternational, getMaximumBirthDate, getMinimumBirthDate, getRegistrationPasswordRequirements, getRegistrationPasswordStrength, normalizeSyrianMobile, USER_MINIMUM_AGE, validateBirthDate, validateEmail, validateFullName, validatePasswordConfirmation, validateRegistrationPassword, validateSyrianMobile } from "@/src/features/auth/utils/registrationValidation";

type FormErrors = {
  fullName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  governorate?: string;
  region?: string;
  general?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};


export function useRegisterUserForm() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(2000, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [regionId, setRegionId] = useState("");
  const [region, setRegion] = useState("");
  const [showRegions, setShowRegions] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGovernorates, setShowGovernorates] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedUpdates, setAcceptedUpdates] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationLookups = useLocationLookups(governorateId);

  const selectGovernorate = (id: string) => {
    const selected = locationLookups.governorates.find((item) => item.id === id);
    setGovernorateId(id);
    setGovernorate(selected?.name ?? "");
    setRegionId("");
    setRegion("");
    setShowRegions(false);
    setShowGovernorates(false);
    setErrors((current) => ({ ...current, governorate: undefined, region: undefined, general: undefined }));
  };

  const selectRegion = (id: string) => {
    const selected = locationLookups.regions.find((item) => item.id === id);
    setRegionId(id);
    setRegion(selected?.name ?? "");
    setShowRegions(false);
    setErrors((current) => ({ ...current, region: undefined, general: undefined }));
  };

  const horizontalPadding = Math.max(20, Math.min(width * 0.055, 34));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const accountTitle = "إنشاء حساب مستخدم";

  const maximumBirthDate = useMemo(
    () => getMaximumBirthDate(USER_MINIMUM_AGE),
    [],
  );
  const minimumBirthDate = useMemo(() => getMinimumBirthDate(), []);

  const formattedBirthDate = useMemo(() => {
    if (!birthDate) {
      return "";
    }

    return new Intl.DateTimeFormat("ar-SY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(birthDate);
  }, [birthDate]);

  const passwordRequirements = useMemo(
    () => getRegistrationPasswordRequirements(password),
    [password],
  );

  const passwordStrength = useMemo(
    () => getRegistrationPasswordStrength(password),
    [password],
  );

  const passwordStrengthLabel =
    passwordStrength === 4
      ? "قوية"
      : passwordStrength >= 2
        ? "متوسطة"
        : "ضعيفة";

  const passwordStrengthColor =
    passwordStrength === 4
      ? COLORS.strengthStrong
      : passwordStrength >= 2
        ? COLORS.strengthMedium
        : COLORS.strengthWeak;

  const canSubmit =
    !validateFullName(fullName) &&
    !validateEmail(email) &&
    !validateBirthDate(birthDate, USER_MINIMUM_AGE) &&
    !validateSyrianMobile(phone) &&
    governorateId.length > 0 && governorate.length > 0 &&
    regionId.length > 0 && region.length > 0 &&
    passwordStrength === 4 &&
    confirmPassword === password &&
    acceptedTerms &&
    !isSubmitting;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/choose-account");
  };

  const openBirthDatePicker = () => {
    const initialDate = birthDate ?? new Date(2000, 0, 1);

    setTemporaryBirthDate(initialDate);
    setShowGovernorates(false);
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
        setErrors((current) => ({
          ...current,
          birthDate: undefined,
        }));
      }

      return;
    }

    if (selectedDate) {
      setTemporaryBirthDate(selectedDate);
    }
  };

  const confirmBirthDate = () => {
    setBirthDate(temporaryBirthDate);
    setShowBirthDatePicker(false);
    setErrors((current) => ({
      ...current,
      birthDate: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    nextErrors.fullName = validateFullName(fullName);
    nextErrors.email = validateEmail(email);
    nextErrors.birthDate = validateBirthDate(birthDate, USER_MINIMUM_AGE);
    nextErrors.phone = validateSyrianMobile(phone);

    if (!governorateId || !governorate) {
      nextErrors.governorate = "يرجى اختيار المحافظة";
    }
    if (!regionId || !region) {
      nextErrors.region = "يرجى اختيار المنطقة";
    }

    nextErrors.password = validateRegistrationPassword(password);
    nextErrors.confirmPassword = validatePasswordConfirmation(
      confirmPassword,
      password,
    );

    if (!acceptedTerms) {
      nextErrors.terms = "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية";
    }

    setErrors(nextErrors);

    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authApi.registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: formatSyrianMobileInternational(phone),
        password,
        birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : undefined,
        governorateId: governorateId ? Number(governorateId) : undefined,
        regionId: regionId ? Number(regionId) : undefined,
      });
      if (!response.accessToken || !response.refreshToken || !response.account?.id) {
        throw new ApiError("استجابة إنشاء الحساب غير مكتملة. يرجى المحاولة مرة أخرى.");
      }
      await saveAuthTokens({
        accessToken: response.accessToken,
        accessTokenExpiresAt: response.accessTokenExpiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      });
      router.replace({
        pathname: "/verify-registration-phone",
        params: {
          accountType: "user",
          flow: "registration",
          phone: response.account.phone ?? formatSyrianMobileInternational(phone),
          name: response.account.displayName ?? fullName.trim(),
          email: response.account.email ?? email.trim(),
        },
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "تعذر إنشاء الحساب. تحقق من اتصالك ثم حاول مرة أخرى.";
      setErrors((current) => ({ ...current, general: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (message?: string) => {
    if (!message) {
      return null;
    }

    return <AppText style={styles.errorText}>{message}</AppText>;
  };

  const form = {
    router, fullName, setFullName, email, setEmail, birthDate, formattedBirthDate, openBirthDatePicker,
    phone, setPhone, normalizeSyrianMobile, governorateId, governorate, setGovernorate, selectGovernorate, regionId, region, selectRegion, showRegions, setShowRegions, locationLookups, showGovernorates, setShowGovernorates, showBirthDatePicker,
    password, setPassword, showPassword, setShowPassword, passwordRequirements, passwordStrength, passwordStrengthLabel,
    passwordStrengthColor, confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword,
    acceptedTerms, setAcceptedTerms, acceptedUpdates, setAcceptedUpdates, errors, setErrors, renderError,
    handleSubmit, isSubmitting, canSubmit, setShowBirthDatePicker, confirmBirthDate,
    temporaryBirthDate, minimumBirthDate, maximumBirthDate, handleBirthDateChange,
  };

  return { ...form, horizontalPadding, contentWidth, accountTitle, handleBack };
}

export type RegisterUserForm = ReturnType<typeof useRegisterUserForm>;
