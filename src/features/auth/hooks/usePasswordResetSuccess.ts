import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";


type NavigationPath = "/login" | "/welcome";

export function usePasswordResetSuccess() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.78)).current;
  const illustrationTranslateY = useRef(new Animated.Value(22)).current;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(22)).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(new Animated.Value(20)).current;

  const shieldFloat = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.08)).current;
  const successScale = useRef(new Animated.Value(0.82)).current;

  const isTablet = width >= 600;
  const isCompact = height < 720;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(27, Math.min(width * 0.073, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet
    ? 210
    : Math.min(width * 0.52, isCompact ? 160 : 190);

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
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(illustrationOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(illustrationScale, {
            toValue: 1,
            friction: 7,
            tension: 52,
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
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(actionsOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(actionsTranslateY, {
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
        Animated.timing(shieldFloat, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shieldFloat, {
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
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.15,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.92,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.08,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const successPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(successScale, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(successScale, {
          toValue: 0.82,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    entranceAnimation.start(() => {
      floatingAnimation.start();
      successPulseAnimation.start();
    });

    glowAnimation.start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      entranceAnimation.stop();
      floatingAnimation.stop();
      glowAnimation.stop();
      successPulseAnimation.stop();

      screenOpacity.stopAnimation();
      screenTranslateY.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      headerOpacity.stopAnimation();
      headerTranslateY.stopAnimation();
      cardOpacity.stopAnimation();
      cardTranslateY.stopAnimation();
      actionsOpacity.stopAnimation();
      actionsTranslateY.stopAnimation();
      shieldFloat.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
      successScale.stopAnimation();
    };
  }, [
    actionsOpacity,
    actionsTranslateY,
    cardOpacity,
    cardTranslateY,
    glowOpacity,
    glowScale,
    headerOpacity,
    headerTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    screenOpacity,
    screenTranslateY,
    shieldFloat,
    successScale,
  ]);

  const navigateWithFade = (path: NavigationPath) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace(path as never);
    }, 200);
  };

  const handleBack = () => {
    if (isNavigating) {
      return;
    }

    navigateWithFade("/login");
  };

  const handleLogin = () => {
    navigateWithFade("/login");
  };

  const handleHome = () => {
    navigateWithFade("/welcome");
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
    isNavigating,
    screenOpacity,
    screenTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    headerOpacity,
    headerTranslateY,
    cardOpacity,
    cardTranslateY,
    actionsOpacity,
    actionsTranslateY,
    shieldFloat,
    glowScale,
    glowOpacity,
    successScale,
    handleBack,
    handleLogin,
    handleHome,
  };
}
