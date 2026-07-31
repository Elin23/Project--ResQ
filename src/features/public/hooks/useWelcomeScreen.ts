import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";

type NavigationPath = "/choose-account" | "/login" | "/(tabs)";

export function useWelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoTranslateY = useRef(new Animated.Value(-18)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateY = useRef(new Animated.Value(12)).current;

  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(90)).current;
  const panelScale = useRef(new Animated.Value(0.96)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(22)).current;

  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(18)).current;

  const createButtonOpacity = useRef(new Animated.Value(0)).current;
  const createButtonTranslateY = useRef(new Animated.Value(24)).current;

  const loginButtonOpacity = useRef(new Animated.Value(0)).current;
  const loginButtonTranslateY = useRef(new Animated.Value(24)).current;

  const guestOpacity = useRef(new Animated.Value(0)).current;
  const guestTranslateY = useRef(new Animated.Value(18)).current;

  const termsOpacity = useRef(new Animated.Value(0)).current;

  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.12)).current;

  const shimmerTranslateX = useRef(new Animated.Value(-180)).current;

  const isCompact = height < 720;
  const isTablet = width >= 600;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 110)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const illustrationSize = isTablet
    ? 185
    : Math.min(width * 0.34, isCompact ? 118 : 150);

  const panelTopMargin = isCompact ? 20 : 34;

  const titleSize = isTablet ? 34 : Math.max(27, Math.min(width * 0.072, 31));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const buttonHeight = isTablet ? 64 : isCompact ? 56 : 62;

  useEffect(() => {
    const logoFloatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1700,
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
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.2,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.12,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1500),
        Animated.timing(shimmerTranslateX, {
          toValue: 420,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslateX, {
          toValue: -180,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1700),
      ]),
    );

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(sloganOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sloganTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(panelTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 48,
          useNativeDriver: true,
        }),
        Animated.spring(panelScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(90, [
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
          Animated.timing(descriptionOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(descriptionTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(createButtonOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(createButtonTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(loginButtonOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(loginButtonTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(guestOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(guestTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(termsOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      logoFloatingAnimation.start();
      glowAnimation.start();
      shimmerAnimation.start();
    });

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      logoFloatingAnimation.stop();
      glowAnimation.stop();
      shimmerAnimation.stop();

      screenOpacity.stopAnimation();
      logoOpacity.stopAnimation();
      logoScale.stopAnimation();
      logoTranslateY.stopAnimation();
      logoFloat.stopAnimation();
      sloganOpacity.stopAnimation();
      sloganTranslateY.stopAnimation();
      panelOpacity.stopAnimation();
      panelTranslateY.stopAnimation();
      panelScale.stopAnimation();
      titleOpacity.stopAnimation();
      titleTranslateY.stopAnimation();
      descriptionOpacity.stopAnimation();
      descriptionTranslateY.stopAnimation();
      createButtonOpacity.stopAnimation();
      createButtonTranslateY.stopAnimation();
      loginButtonOpacity.stopAnimation();
      loginButtonTranslateY.stopAnimation();
      guestOpacity.stopAnimation();
      guestTranslateY.stopAnimation();
      termsOpacity.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
      shimmerTranslateX.stopAnimation();
    };
  }, [
    createButtonOpacity,
    createButtonTranslateY,
    descriptionOpacity,
    descriptionTranslateY,
    glowOpacity,
    glowScale,
    guestOpacity,
    guestTranslateY,
    loginButtonOpacity,
    loginButtonTranslateY,
    logoFloat,
    logoOpacity,
    logoScale,
    logoTranslateY,
    panelOpacity,
    panelScale,
    panelTranslateY,
    screenOpacity,
    shimmerTranslateX,
    sloganOpacity,
    sloganTranslateY,
    termsOpacity,
    titleOpacity,
    titleTranslateY,
  ]);

  const navigateWithFade = (path: NavigationPath) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 220,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.push(path as never);
    }, 220);
  };


  return {
    width, height, isCompact, horizontalPadding, contentWidth, illustrationSize, panelTopMargin,
    titleSize, descriptionSize, buttonHeight, isNavigating, screenOpacity, logoOpacity, logoScale,
    logoTranslateY, logoFloat, sloganOpacity, sloganTranslateY, panelOpacity, panelTranslateY,
    panelScale, titleOpacity, titleTranslateY, descriptionOpacity, descriptionTranslateY,
    createButtonOpacity, createButtonTranslateY, loginButtonOpacity, loginButtonTranslateY,
    guestOpacity, guestTranslateY, termsOpacity, glowScale, glowOpacity, shimmerTranslateX,
    navigateWithFade, router,
  };
}
