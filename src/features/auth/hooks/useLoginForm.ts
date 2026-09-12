import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard } from "react-native";
import { useSession } from "@/src/features/session/SessionContext";
import { authApi } from "@/src/services/api/authApi";
import { authAccountDtoToSession } from "@/src/services/api/authMapper";
import { ApiError } from "@/src/services/api/client";
import { saveAuthTokens } from "@/src/services/api/authTokens";
import { defaultRouteForPrincipal } from "@/src/features/session/sessionNavigation";

import {
  LoginFormErrors,
  validateEmail,
  validateLoginForm,
  validatePassword,
} from "../utils/authValidation";

type NavigationPath = "/forgot-password" | "/choose-account" | "/(user)/(tabs)/(home)";

export function useLoginForm() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { continueAsGuest, startAuthenticatedSession } = useSession();
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

  const clearNavigationTimer = useCallback(() => {
    const timer = navigationTimer.current;
    if (!timer) return;
    clearTimeout(timer);
    navigationTimer.current = null;
  }, []);

  // The login screen remains mounted when another auth route is pushed.
  // Reset the navigation lock whenever this screen becomes active again so
  // Android hardware-back cannot leave the form controls disabled.
  useFocusEffect(
    useCallback(() => {
      clearNavigationTimer();
      setIsNavigating(false);
    }, [clearNavigationTimer]),
  );

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
      clearNavigationTimer();
      entranceAnimation.stop();
      glowAnimation.stop();
      [screenOpacity, screenTranslateY, headerOpacity, headerTranslateY, formOpacity, formTranslateY, footerOpacity, footerTranslateY, glowScale, glowOpacity]
        .forEach((value) => value.stopAnimation());
    };
  }, [clearNavigationTimer, footerOpacity, footerTranslateY, formOpacity, formTranslateY, glowOpacity, glowScale, headerOpacity, headerTranslateY, screenOpacity, screenTranslateY]);

  const disabled = isSubmitting || isNavigating;

  const navigateWithFade = useCallback((path: NavigationPath) => {
    if (disabled) return;
    Keyboard.dismiss();
    setIsNavigating(true);
    router.push(path);
  }, [disabled, router]);

  const handleBack = useCallback(() => {
    if (disabled) return;
    Keyboard.dismiss();
    if (router.canGoBack()) router.back();
    else router.replace("/welcome");
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
      const response = await authApi.login(email.trim(), password);
      if (!response.accessToken || !response.refreshToken || !response.account?.id) {
        throw new ApiError("استجابة تسجيل الدخول غير مكتملة. يرجى المحاولة مرة أخرى.");
      }
      await saveAuthTokens({
        accessToken: response.accessToken,
        accessTokenExpiresAt: response.accessTokenExpiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      });

      const nextAccount = authAccountDtoToSession(response.account);
      if (response.account.phone && response.account.phoneVerified === false) {
        router.replace({
          pathname: "/verify-registration-phone",
          params: {
            accountType: nextAccount.kind,
            flow: "login",
            phone: response.account.phone,
            name: response.account.displayName ?? "",
            email: response.account.email ?? email.trim(),
          },
        });
        return;
      }

      await startAuthenticatedSession(nextAccount);
      const safeReturnTo = nextAccount.kind === "user" && returnTo?.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : null;
      const workspaceRoute = defaultRouteForPrincipal({ kind: "authenticated", account: nextAccount });
      router.replace((safeReturnTo ?? workspaceRoute) as Href);
    } catch (error) {
      setErrors({
        general: error instanceof ApiError
          ? error.message
          : "تعذر تسجيل الدخول. تحقق من بياناتك واتصالك بالإنترنت ثم حاول مجددًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [disabled, email, password, returnTo, router, startAuthenticatedSession]);

  const handleContinueAsGuest = useCallback(async () => {
    if (disabled) return;
    await continueAsGuest();
    router.replace("/(user)/(tabs)/(home)");
  }, [continueAsGuest, disabled, router]);

  return {
    email, password, errors, isSubmitting, isNavigating, disabled,
    animations: { screenOpacity, screenTranslateY, headerOpacity, headerTranslateY, formOpacity, formTranslateY, footerOpacity, footerTranslateY, glowScale, glowOpacity },
    handleEmailChange, handlePasswordChange, handleEmailBlur, handlePasswordBlur, handleLogin, handleBack, navigateWithFade, handleContinueAsGuest,
  };
}
