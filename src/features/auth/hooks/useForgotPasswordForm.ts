import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard, useWindowDimensions } from "react-native";

import { normalizeSyrianMobile, validateSyrianMobile } from "../utils/passwordResetValidation";

type FormErrors = {
  phone?: string;
  general?: string;
};

export function useForgotPasswordForm() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.78)).current;
  const illustrationTranslateY = useRef(new Animated.Value(20)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(18)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(24)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(18)).current;

  const lockFloat = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.09)).current;

  const isTablet = width >= 600;
  const isCompact = height < 720;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.07);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.075, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet
    ? 190
    : Math.min(width * 0.46, isCompact ? 145 : 175);

  const buttonHeight = isTablet ? 64 : 58;

  useEffect(() => {
    const entranceAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(90, [
        Animated.parallel([
          Animated.timing(illustrationOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(illustrationScale, {
            toValue: 1,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(illustrationTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(formOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(formTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(footerOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(footerTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(lockFloat, {
          toValue: -7,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(lockFloat, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.08,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.16,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.09,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    entranceAnimation.start(() => {
      floatingAnimation.start();
    });

    glowAnimation.start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      entranceAnimation.stop();
      floatingAnimation.stop();
      glowAnimation.stop();

      screenOpacity.stopAnimation();
      screenTranslateY.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      titleOpacity.stopAnimation();
      titleTranslateY.stopAnimation();
      formOpacity.stopAnimation();
      formTranslateY.stopAnimation();
      footerOpacity.stopAnimation();
      footerTranslateY.stopAnimation();
      lockFloat.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
    };
  }, [
    footerOpacity,
    footerTranslateY,
    formOpacity,
    formTranslateY,
    glowOpacity,
    glowScale,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    lockFloat,
    screenOpacity,
    screenTranslateY,
    titleOpacity,
    titleTranslateY,
  ]);

  const handlePhoneChange = (value: string) => {
    const normalizedPhone = normalizeSyrianMobile(value);

    setPhone(normalizedPhone);

    if (errors.phone || errors.general) {
      setErrors((current) => ({
        ...current,
        phone: undefined,
        general: undefined,
      }));
    }
  };

  const handlePhoneBlur = () => {
    if (!phone) {
      return;
    }

    setErrors((current) => ({
      ...current,
      phone: validateSyrianMobile(phone),
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

    router.replace("/login" as never);
  };

  const navigateToLogin = () => {
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
      router.replace("/login" as never);
    }, 200);
  };

  const handleSendCode = () => {
    if (isNavigating) {
      return;
    }

    const phoneError = validateSyrianMobile(phone);

    if (phoneError) {
      setErrors({
        phone: phoneError,
      });
      return;
    }

    Keyboard.dismiss();
    setErrors({});
    setIsNavigating(true);

    const normalizedPhone = normalizeSyrianMobile(phone);

    router.push({
      pathname: "/verify-reset-code",
      params: {
        phone: `+963${normalizedPhone}`,
      },
    });
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
    phone,
    errors,
    isSubmitting,
    isNavigating,
    screenOpacity,
    screenTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    titleOpacity,
    titleTranslateY,
    formOpacity,
    formTranslateY,
    footerOpacity,
    footerTranslateY,
    lockFloat,
    glowScale,
    glowOpacity,
    handlePhoneChange,
    handlePhoneBlur,
    handleBack,
    navigateToLogin,
    handleSendCode,
  };
}
