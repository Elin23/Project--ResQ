import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard } from "react-native";

import {
  LoginFormErrors,
  validateEmail,
  validateLoginForm,
  validatePassword,
} from "../utils/authValidation";

type NavigationPath = "/forgot-password" | "/choose-account" | "/(tabs)";

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(24)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(20)).current;
  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    const entranceAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(screenOpacity, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(screenTranslateY, { toValue: 0, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.stagger(90, [
        Animated.parallel([
          Animated.timing(headerOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(headerTranslateY, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(formOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(formTranslateY, { toValue: 0, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(footerOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(footerTranslateY, { toValue: 0, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]),
    ]);
    const glowAnimation = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(glowScale, { toValue: 1.08, duration: 2300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.17, duration: 2300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(glowScale, { toValue: 0.92, duration: 2300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.1, duration: 2300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ]));
    entranceAnimation.start();
    glowAnimation.start();
    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      entranceAnimation.stop();
      glowAnimation.stop();
      [screenOpacity, screenTranslateY, headerOpacity, headerTranslateY, formOpacity, formTranslateY, footerOpacity, footerTranslateY, glowScale, glowOpacity]
        .forEach((value) => value.stopAnimation());
    };
  }, [footerOpacity, footerTranslateY, formOpacity, formTranslateY, glowOpacity, glowScale, headerOpacity, headerTranslateY, screenOpacity, screenTranslateY]);

  const disabled = isSubmitting || isNavigating;

  const navigateWithFade = useCallback((path: NavigationPath) => {
    if (disabled) return;
    Keyboard.dismiss();
    setIsNavigating(true);
    Animated.timing(screenOpacity, { toValue: 0, duration: 200, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start();
    navigationTimer.current = setTimeout(() => router.push(path as never), 200);
  }, [disabled, router, screenOpacity]);

  const handleBack = useCallback(() => {
    if (disabled) return;
    Keyboard.dismiss();
    if (router.canGoBack()) router.back();
    else router.replace("/welcome" as never);
  }, [disabled, router]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((current) => current.email || current.general ? { ...current, email: undefined, general: undefined } : current);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((current) => current.password || current.general ? { ...current, password: undefined, general: undefined } : current);
  }, []);

  const handleEmailBlur = useCallback(() => {
    if (email.trim()) setErrors((current) => ({ ...current, email: validateEmail(email) }));
  }, [email]);

  const handlePasswordBlur = useCallback(() => {
    if (password) setErrors((current) => ({ ...current, password: validatePassword(password) }));
  }, [password]);

  const handleLogin = useCallback(async () => {
    if (disabled) return;
    Keyboard.dismiss();
    const nextErrors = validateLoginForm(email, password);
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    try {
      setIsSubmitting(true);
      setErrors({});
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.replace("/(tabs)" as never);
    } catch {
      setErrors({ general: "تعذر تسجيل الدخول. تحقق من بياناتك واتصالك بالإنترنت ثم حاول مجددًا." });
    } finally {
      setIsSubmitting(false);
    }
  }, [disabled, email, password, router]);

  return {
    email, password, errors, isSubmitting, isNavigating, disabled,
    animations: { screenOpacity, screenTranslateY, headerOpacity, headerTranslateY, formOpacity, formTranslateY, footerOpacity, footerTranslateY, glowScale, glowOpacity },
    handleEmailChange, handlePasswordChange, handleEmailBlur, handlePasswordBlur, handleLogin, handleBack, navigateWithFade,
  };
}
