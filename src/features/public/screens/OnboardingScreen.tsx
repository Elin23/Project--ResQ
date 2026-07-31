import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./Onboarding.styles";
import Button from "@/src/components/ui/Button";
import OnboardingSlide from "../components/onboarding/OnboardingSlide";
import OnboardingFooter from "../components/onboarding/OnboardingFooter";
import { ONBOARDING_ITEMS } from "../constants/onboarding";
import { completeOnboarding } from "@/src/utils/onboardingStorage";

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const contentScale = useRef(new Animated.Value(0.96)).current;
  const imageFloat = useRef(new Animated.Value(0)).current;
  const backgroundGlow = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const currentItem = ONBOARDING_ITEMS[currentIndex];
  const isLastSlide = currentIndex === ONBOARDING_ITEMS.length - 1;

  const isCompact = height < 700;
  const isTablet = width >= 600;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.14, 90)
    : Math.max(24, width * 0.06);

  const cardWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 410,
  );

  const cardHeight = isTablet
    ? Math.min(height * 0.48, 490)
    : Math.min(cardWidth, isCompact ? height * 0.42 : height * 0.44);

  const titleSize = isTablet ? 34 : Math.max(25, Math.min(width * 0.068, 30));

  const descriptionSize = isTablet
    ? 19
    : Math.max(15, Math.min(width * 0.041, 17));

  const buttonHeight = isTablet ? 62 : isCompact ? 52 : 57;

  const brandSize = Math.max(27, Math.min(width * 0.075, 34));

  const startEntranceAnimation = () => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    contentScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startEntranceAnimation();

    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(imageFloat, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundGlow, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(backgroundGlow, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    floatingAnimation.start();
    glowAnimation.start();

    return () => {
      floatingAnimation.stop();
      glowAnimation.stop();
    };
  }, [
    backgroundGlow,
    buttonOpacity,
    buttonTranslateY,
    contentOpacity,
    contentScale,
    contentTranslateY,
    imageFloat,
  ]);

  const glowScale = backgroundGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.12],
  });

  const glowOpacity = backgroundGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  const indicatorWidths = useMemo(
    () => ONBOARDING_ITEMS.map((_, index) => (index === currentIndex ? 32 : 8)),
    [currentIndex],
  );

  const animateToSlide = (nextIndex: number) => {
    if (
      isChanging ||
      isCompleting ||
      nextIndex === currentIndex ||
      nextIndex < 0 ||
      nextIndex >= ONBOARDING_ITEMS.length
    ) {
      return;
    }

    setIsChanging(true);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: -12,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.98,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        setIsChanging(false);
        return;
      }

      setCurrentIndex(nextIndex);
      contentTranslateY.setValue(24);
      contentScale.setValue(0.96);

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsChanging(false);
      });
    });
  };

  const navigateToWelcome = async () => {
    if (isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);
      await completeOnboarding();
      router.replace("/welcome" as never);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNext = async () => {
    if (isChanging || isCompleting) {
      return;
    }

    if (isLastSlide) {
      await navigateToWelcome();
      return;
    }

    animateToSlide(currentIndex + 1);
  };

  const handleSkip = async () => {
    await navigateToWelcome();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <Animated.View pointerEvents="none" style={[styles.topGlow, { width: width * 1.15, height: width * 1.15, borderRadius: width, top: -width * 0.78, right: -width * 0.28, opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
        <Animated.View pointerEvents="none" style={[styles.bottomGlow, { width: width * 1.35, height: width * 1.35, borderRadius: width, bottom: -width * 0.82, left: -width * 0.44, opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
        <View style={[styles.header, { paddingHorizontal: horizontalPadding, paddingTop: isCompact ? 4 : 10 }]}>
          <Button title="تخطي" onPress={handleSkip} variant="text" size="small" fullWidth={false} disabled={isChanging || isCompleting} textColor="#A94D12" radius={16} style={styles.skipButton} textStyle={styles.skipText} />
        </View>
        <View style={{ paddingHorizontal: horizontalPadding, flex: 1 }}>
          <OnboardingSlide item={currentItem} index={currentIndex} cardWidth={cardWidth} cardHeight={cardHeight} isTablet={isTablet} isCompact={isCompact} brandSize={brandSize} titleSize={titleSize} descriptionSize={descriptionSize} opacity={contentOpacity} translateY={contentTranslateY} scale={contentScale} imageFloat={imageFloat} />
        </View>
        <View style={{ paddingHorizontal: horizontalPadding, paddingBottom: isCompact ? 8 : 16 }}>
          <OnboardingFooter currentIndex={currentIndex} indicatorWidths={indicatorWidths} isChanging={isChanging} isCompleting={isCompleting} isLastSlide={isLastSlide} cardWidth={cardWidth} buttonHeight={buttonHeight} opacity={buttonOpacity} translateY={buttonTranslateY} onSelect={animateToSlide} onNext={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
