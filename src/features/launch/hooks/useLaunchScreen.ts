import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";

import { hasCompletedOnboarding } from "@/src/utils/onboardingStorage";

export function useLaunchScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.65)).current;
  const illustrationTranslateY = useRef(new Animated.Value(30)).current;
  const floatingTranslateY = useRef(new Animated.Value(0)).current;

  const pulseScale = useRef(new Animated.Value(0.7)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(18)).current;
  const brandScale = useRef(new Animated.Value(0.9)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(14)).current;

  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const particleOne = useRef(new Animated.Value(0)).current;
  const particleTwo = useRef(new Animated.Value(0)).current;
  const particleThree = useRef(new Animated.Value(0)).current;

  const isCompact = height < 700;
  const isTablet = width >= 600;

  const illustrationSize = isTablet
    ? Math.min(width * 0.32, 230)
    : Math.min(width * 0.46, isCompact ? 155 : 190);

  const brandFontSize = isTablet
    ? 44
    : Math.max(30, Math.min(width * 0.085, 38));

  const subtitleFontSize = isTablet
    ? 20
    : Math.max(15, Math.min(width * 0.042, 18));

  const loaderWidth = Math.min(width * 0.38, 155);

  useEffect(() => {
    let isMounted = true;

    const navigateFromSplash = async () => {
      const onboardingCompleted = await hasCompletedOnboarding();

      if (!isMounted) {
        return;
      }

      if (onboardingCompleted) {
        router.replace("/login");
        return;
      }

      router.replace("/onboarding");
    };

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingTranslateY, {
          toValue: -8,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingTranslateY, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 1400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.22,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 0.7,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    const createParticleAnimation = (
      value: Animated.Value,
      duration: number,
      delay: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

    const particleAnimationOne = createParticleAnimation(
      particleOne,
      1400,
      200,
    );

    const particleAnimationTwo = createParticleAnimation(
      particleTwo,
      1700,
      500,
    );

    const particleAnimationThree = createParticleAnimation(
      particleThree,
      1200,
      800,
    );

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(illustrationOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(illustrationScale, {
          toValue: 1,
          friction: 6,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(illustrationTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(brandScale, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(brandTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loaderOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      floatingAnimation.start();
      pulseAnimation.start();
      particleAnimationOne.start();
      particleAnimationTwo.start();
      particleAnimationThree.start();
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 3400,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const navigationTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          void navigateFromSplash();
        }
      });
    }, 3600);

    return () => {
      isMounted = false;

      clearTimeout(navigationTimer);

      floatingAnimation.stop();
      pulseAnimation.stop();
      particleAnimationOne.stop();
      particleAnimationTwo.stop();
      particleAnimationThree.stop();

      screenOpacity.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      floatingTranslateY.stopAnimation();
      pulseScale.stopAnimation();
      pulseOpacity.stopAnimation();
      brandOpacity.stopAnimation();
      brandTranslateY.stopAnimation();
      brandScale.stopAnimation();
      subtitleOpacity.stopAnimation();
      subtitleTranslateY.stopAnimation();
      loaderOpacity.stopAnimation();
      progress.stopAnimation();
      particleOne.stopAnimation();
      particleTwo.stopAnimation();
      particleThree.stopAnimation();
    };
  }, [
    brandOpacity,
    brandScale,
    brandTranslateY,
    floatingTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    loaderOpacity,
    particleOne,
    particleThree,
    particleTwo,
    progress,
    pulseOpacity,
    pulseScale,
    router,
    screenOpacity,
    subtitleOpacity,
    subtitleTranslateY,
  ]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, loaderWidth],
  });

  const progressGlowOpacity = progress.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0.6],
  });

  const particleOneTranslateY = particleOne.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -14],
  });

  const particleTwoTranslateY = particleTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -18],
  });

  const particleThreeTranslateY = particleThree.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -10],
  });

  const particleOneOpacity = particleOne.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.7, 0.15],
  });

  const particleTwoOpacity = particleTwo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.55, 0.1],
  });

  const particleThreeOpacity = particleThree.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.65, 0.1],
  });


  return {
    width, height, isCompact, isTablet, illustrationSize, brandFontSize, subtitleFontSize, loaderWidth,
    screenOpacity, illustrationOpacity, illustrationScale, illustrationTranslateY, floatingTranslateY,
    pulseScale, pulseOpacity, brandOpacity, brandTranslateY, brandScale, subtitleOpacity,
    subtitleTranslateY, loaderOpacity, progressWidth, progressGlowOpacity, particleOneTranslateY,
    particleTwoTranslateY, particleThreeTranslateY, particleOneOpacity, particleTwoOpacity,
    particleThreeOpacity,
  };
}
