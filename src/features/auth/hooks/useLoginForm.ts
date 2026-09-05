import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard } from "react-native";
import { APP_CONFIG } from "@/src/constants/config";
import { findMockAccountByEmail } from "@/src/data/mockAccounts.seed";
import { useSession } from "@/src/features/session/SessionContext";
import { defaultRouteForPrincipal } from "@/src/features/session/sessionNavigation";
import type { AuthenticatedAccount } from "@/src/types/accounts";

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
      await new Promise((resolve) => setTimeout(resolve, 900));
      // In production the API response must provide the canonical account kind.
      // While mock mode is on, the local directory plays that role; any other
      // address keeps signing in as a personal user account.
      const matchedAccount = APP_CONFIG.useMockApi ? findMockAccountByEmail(email) : undefined;
      if (matchedAccount && password !== matchedAccount.password) {
        setErrors({ general: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
        return;
      }
      const nextAccount: AuthenticatedAccount = matchedAccount
        ? {
            id: matchedAccount.id,
            kind: matchedAccount.kind,
            status: matchedAccount.status,
            displayName: matchedAccount.displayName,
            email: matchedAccount.email,
          }
        : { id: "local-user", kind: "user", status: "active", email: email.trim() };
      await startAuthenticatedSession(nextAccount);
      // Only personal accounts resume the gated destination; organization shells
      // start from the route their own account status allows.
      const safeReturnTo = nextAccount.kind === "user" && returnTo?.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : null;
      const workspaceRoute = defaultRouteForPrincipal({ kind: "authenticated", account: nextAccount });
      router.replace((safeReturnTo ?? workspaceRoute) as Href);
    } catch {
      setErrors({ general: "تعذر تسجيل الدخول. تحقق من بياناتك واتصالك بالإنترنت ثم حاول مجددًا." });
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
