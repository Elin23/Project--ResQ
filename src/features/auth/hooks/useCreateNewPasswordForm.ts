import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Keyboard, useWindowDimensions } from "react-native";

import { getPasswordRequirements } from "../utils/passwordRequirements";
import { validateNewPassword, validatePasswordConfirmation } from "../utils/passwordResetValidation";

type FormErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export function useCreateNewPasswordForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    code?: string;
  }>();

  const { width, height } = useWindowDimensions();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.88)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const requirementsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const isTablet = width >= 600;
  const isCompact = height < 740;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.074, 32));

  const subtitleSize = isTablet ? 18 : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet ? 176 : isCompact ? 120 : 148;
  const buttonHeight = isTablet ? 64 : 58;

  const passwordRequirements = useMemo(
    () => getPasswordRequirements(password),
    [password],
  );

  const doPasswordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(70, [
        Animated.spring(illustrationScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(illustrationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(requirementsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      screenOpacity.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      headerOpacity.stopAnimation();
      formOpacity.stopAnimation();
      requirementsOpacity.stopAnimation();
      buttonOpacity.stopAnimation();
    };
  }, [
    buttonOpacity,
    formOpacity,
    headerOpacity,
    illustrationOpacity,
    illustrationScale,
    requirementsOpacity,
    screenOpacity,
  ]);

  const validateForm = () => {
    const passwordError = validateNewPassword(password);
    const confirmPasswordError = validatePasswordConfirmation(confirmPassword, password);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !passwordError && !confirmPasswordError;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    setErrors((current) => ({
      ...current,
      password: undefined,
      confirmPassword:
        confirmPassword && value !== confirmPassword
          ? "كلمتا المرور غير متطابقتين"
          : undefined,
      general: undefined,
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    setErrors((current) => ({
      ...current,
      confirmPassword: undefined,
      general: undefined,
    }));
  };

  const handlePasswordBlur = () => {
    if (!password) {
      return;
    }

    setErrors((current) => ({
      ...current,
      password: validateNewPassword(password),
    }));
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      return;
    }

    setErrors((current) => ({
      ...current,
      confirmPassword: validatePasswordConfirmation(confirmPassword, password),
    }));
  };

  const handleBack = () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/forgot-password" as never);
  };

  const navigateToSuccess = () => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 180,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace("/password-reset-success" as never);
    }, 180);
  };

  const handleSavePassword = async () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const resetPayload = {
        phone: params.phone ?? "",
        code: params.code ?? "",
        newPassword: password,
      };

      await new Promise((resolve) => setTimeout(resolve, 700));

      void resetPayload;
      navigateToSuccess();
    } catch {
      setErrors({
        general:
          "تعذر حفظ كلمة المرور الجديدة. تحقق من اتصالك بالإنترنت ثم حاول مجددًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    width,
    isCompact,
    horizontalPadding,
    contentWidth,
    titleSize,
    subtitleSize,
    illustrationSize,
    buttonHeight,
    password,
    confirmPassword,
    errors,
    isSubmitting,
    isNavigating,
    screenOpacity,
    illustrationOpacity,
    illustrationScale,
    headerOpacity,
    formOpacity,
    requirementsOpacity,
    buttonOpacity,
    passwordRequirements,
    doPasswordsMatch,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleBack,
    handleSavePassword,
  };
}
