import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "@/src/features/auth/screens/RegisterUser.styles";

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

  const maximumBirthDate = useMemo(() => new Date(), []);
  const minimumBirthDate = useMemo(() => new Date(1900, 0, 1), []);

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

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Za-z]/.test(password)) {
      score += 1;
    }

    if (/\d/.test(password)) {
      score += 1;
    }

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
      ? "#17823A"
      : passwordStrength === 2
        ? "#E38A2E"
        : "#C92335";

  const canSubmit =
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    birthDate !== null &&
    phone.length >= 8 &&
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

    router.replace("/choose-account" as never);
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

    if (fullName.trim().length < 3) {
      nextErrors.fullName = "يرجى إدخال الاسم الكامل";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!birthDate) {
      nextErrors.birthDate = "يرجى اختيار تاريخ الميلاد";
    }

    if (phone.length < 8) {
      nextErrors.phone = "يرجى إدخال رقم هاتف صحيح";
    }

    if (!governorate) {
      nextErrors.governorate = "يرجى اختيار المحافظة";
    }

    if (passwordStrength < 3) {
      nextErrors.password =
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف ورقم";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
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
        phone: `+963${phone}`,
        governorate,
        password,
        acceptedUpdates,
      };

      await new Promise((resolve) => setTimeout(resolve, 900));

      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: `+963${phone}`,
          accountType: "user",
        },
      } as never);
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
    phone, setPhone, governorate, setGovernorate, showGovernorates, setShowGovernorates, showBirthDatePicker,
    password, setPassword, showPassword, setShowPassword, passwordStrength, passwordStrengthLabel,
    passwordStrengthColor, confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword,
    acceptedTerms, setAcceptedTerms, acceptedUpdates, setAcceptedUpdates, errors, setErrors, renderError,
    handleSubmit, isSubmitting, canSubmit, setShowBirthDatePicker, confirmBirthDate,
    temporaryBirthDate, minimumBirthDate, maximumBirthDate, handleBirthDateChange,
  };

  return { ...form, horizontalPadding, contentWidth, accountTitle, handleBack };
}

export type RegisterUserForm = ReturnType<typeof useRegisterUserForm>;
