import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS } from "@/src/theme";
import { styles } from "@/src/features/auth/screens/RegisterUser.styles";
import { formatSyrianMobileInternational, getMaximumBirthDate, getMinimumBirthDate, getRegistrationPasswordRequirements, getRegistrationPasswordStrength, normalizeSyrianMobile, USER_MINIMUM_AGE, validateBirthDate, validateEmail, validateFullName, validatePasswordConfirmation, validateRegistrationPassword, validateSyrianMobile } from "@/src/features/auth/utils/registrationValidation";

type FormErrors = {
  fullName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  governorate?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};


export function useRegisterUserForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountType?: "user";
  }>();

  const { width } = useWindowDimensions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(2000, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
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

  const canSubmit =
    !validateFullName(fullName) &&
    !validateEmail(email) &&
    !validateBirthDate(birthDate, USER_MINIMUM_AGE) &&
    !validateSyrianMobile(phone) &&
    governorate.length > 0 &&
    passwordStrength === 3 &&
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

    if (!governorate) {
      nextErrors.governorate = "يرجى اختيار المحافظة";
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

      const payload = {
        accountType: params.accountType ?? "user",
        fullName: fullName.trim(),
        email: email.trim(),
        birthDate: birthDate?.toISOString() ?? "",
        phone: formatSyrianMobileInternational(phone),
        governorate,
        password,
        acceptedUpdates,
      };

      await new Promise((resolve) => setTimeout(resolve, 900));

      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: formatSyrianMobileInternational(phone),
          accountType: "user",
        },
      });
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
    phone, setPhone, normalizeSyrianMobile, governorate, setGovernorate, showGovernorates, setShowGovernorates, showBirthDatePicker,
    password, setPassword, showPassword, setShowPassword, passwordRequirements, passwordStrength, passwordStrengthLabel,
    passwordStrengthColor, confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword,
    acceptedTerms, setAcceptedTerms, acceptedUpdates, setAcceptedUpdates, errors, setErrors, renderError,
    handleSubmit, isSubmitting, canSubmit, setShowBirthDatePicker, confirmBirthDate,
    temporaryBirthDate, minimumBirthDate, maximumBirthDate, handleBirthDateChange,
  };

  return { ...form, horizontalPadding, contentWidth, accountTitle, handleBack };
}

export type RegisterUserForm = ReturnType<typeof useRegisterUserForm>;
