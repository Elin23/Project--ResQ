import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Keyboard, TextInput, useWindowDimensions } from "react-native";

import { useCountdown } from "./useCountdown";
import { normalizeResetCode, RESET_CODE_LENGTH, validateResetCode } from "../utils/passwordResetValidation";

const RESEND_SECONDS = 45;

type VerificationError = {
  code?: string;
  general?: string;
};

type VerificationStatus = "idle" | "verifying" | "success" | "error";

export function useVerifyResetCode() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
  }>();

  const { width, height } = useWindowDimensions();

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<VerificationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { seconds: resendSeconds, formatted: formattedTimer, reset: resetCountdown } = useCountdown(RESEND_SECONDS);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  const codeInputRef = useRef<TextInput>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const isTablet = width >= 600;
  const isCompact = height < 740;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.06);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.074, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet ? 190 : isCompact ? 145 : 172;
  const buttonHeight = isTablet ? 64 : 58;

  const normalizedPhone = useMemo(() => {
    const value = Array.isArray(params.phone) ? params.phone[0] : params.phone;

    return value || "+963 9XX XXX XXX";
  }, [params.phone]);

  const maskedPhone = useMemo(() => {
    const digits = normalizedPhone.replace(/\D/g, "");

    if (digits.length < 8) {
      return normalizedPhone;
    }

    const countryCode = digits.startsWith("963") ? "+963" : "";
    const localNumber = digits.startsWith("963") ? digits.slice(3) : digits;

    if (localNumber.length < 5) {
      return normalizedPhone;
    }

    const firstPart = localNumber.slice(0, 2);
    const lastPart = localNumber.slice(-2);

    return `${countryCode} ${firstPart} XXX XX${lastPart}`;
  }, [normalizedPhone]);

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      if (verificationTimer.current) {
        clearTimeout(verificationTimer.current);
      }

      screenOpacity.stopAnimation();

    };
  }, [screenOpacity]);

  const resetCodeBoxAnimations = () => undefined;

  const animateVerificationResult = async (status: "success" | "error") => {
    setVerificationStatus(status);
    await new Promise<void>((resolve) => setTimeout(resolve, 250));
  };

  const handleCodeChange = (value: string) => {
    if (isSubmitting || isNavigating) {
      return;
    }

    const normalizedCode = normalizeResetCode(value);

    setCode(normalizedCode);
    setVerificationStatus("idle");
    resetCodeBoxAnimations();

    if (errors.code || errors.general) {
      setErrors({});
    }
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

  const handleChangePhone = () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();
    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace("/forgot-password" as never);
    }, 200);
  };

  const handleResendCode = async () => {
    if (resendSeconds > 0 || isSubmitting || isNavigating) {
      return;
    }

    try {
      setErrors({});
      resetCountdown();

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      setErrors({
        general:
          "تعذر إعادة إرسال الرمز. تحقق من اتصالك بالإنترنت ثم حاول مجددًا.",
      });
      resetCountdown(0);
    }
  };

  const handleVerifyCode = async () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    const codeError = validateResetCode(code);

    if (codeError) {
      setVerificationStatus("error");
      setErrors({
        code: codeError,
      });
      await animateVerificationResult("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setVerificationStatus("verifying");
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 700));

      const isCodeCorrect = true;

      if (!isCodeCorrect) {
        setErrors({
          code: "رمز التحقق غير صحيح. تحقق من الرمز وحاول مجددًا.",
        });
        await animateVerificationResult("error");
        return;
      }

      await animateVerificationResult("success");

      verificationTimer.current = setTimeout(() => {
        setIsNavigating(true);
        router.push({
          pathname: "/create-new-password",
          params: {
            phone: normalizedPhone,
            code,
          },
        } as never);
      }, 850);
    } catch {
      setErrors({
        general:
          "تعذر التحقق من الرمز. تأكد من الرمز واتصالك بالإنترنت ثم حاول مجددًا.",
      });
      await animateVerificationResult("error");
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
    descriptionSize,
    illustrationSize,
    buttonHeight,
    code,
    errors,
    isSubmitting,
    isNavigating,
    resendSeconds,
    formattedTimer,
    verificationStatus,
    codeInputRef,
    screenOpacity,
    maskedPhone,
    handleCodeChange,
    handleBack,
    handleChangePhone,
    handleResendCode,
    handleVerifyCode,
  };
}
