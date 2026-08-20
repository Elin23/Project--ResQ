import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/src/components/ui/Button";
import { MOTION } from "@/src/theme";
import { completeOnboarding } from "@/src/utils/onboardingStorage";
import OnboardingFooter from "../components/onboarding/OnboardingFooter";
import OnboardingSlide from "../components/onboarding/OnboardingSlide";
import { ONBOARDING_ITEMS } from "../constants/onboarding";
import { styles } from "./Onboarding.styles";

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.985)).current;
  const imageFloat = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(12)).current;

  const currentItem = ONBOARDING_ITEMS[currentIndex];
  const isLastSlide = currentIndex === ONBOARDING_ITEMS.length - 1;
  const isCompact = height < 700;
  const isTablet = width >= 600;
  const horizontalPadding = isTablet ? Math.min(width * 0.14, 90) : Math.max(24, width * 0.06);
  const cardWidth = Math.min(width - horizontalPadding * 2, isTablet ? 520 : 410);
  const cardHeight = isTablet ? Math.min(height * 0.48, 490) : Math.min(cardWidth, isCompact ? height * 0.42 : height * 0.44);
  const titleSize = isTablet ? 34 : Math.max(25, Math.min(width * 0.068, 30));
  const descriptionSize = isTablet ? 19 : Math.max(15, Math.min(width * 0.041, 17));
  const buttonHeight = isTablet ? 62 : isCompact ? 52 : 57;
  const brandSize = Math.max(27, Math.min(width * 0.075, 34));
  const indicatorWidths = useMemo(
    () => ONBOARDING_ITEMS.map((_, index) => (index === currentIndex ? 32 : 8)),
    [currentIndex],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: MOTION.duration.standard,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: MOTION.onboarding.initialEnter,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: MOTION.onboarding.initialEnter,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 9,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(MOTION.duration.fast),
        Animated.parallel([
          Animated.timing(footerOpacity, {
            toValue: 1,
            duration: MOTION.duration.standard,
            useNativeDriver: true,
          }),
          Animated.timing(footerTranslateY, {
            toValue: 0,
            duration: MOTION.duration.standard,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [footerOpacity, footerTranslateY, opacity, scale, screenOpacity, translateY]);

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
      Animated.timing(opacity, {
        toValue: 0,
        duration: MOTION.onboarding.slideOut,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -8,
        duration: MOTION.onboarding.slideOut,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.985,
        duration: MOTION.onboarding.slideOut,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        setIsChanging(false);
        return;
      }

      setCurrentIndex(nextIndex);
      translateY.setValue(12);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: MOTION.onboarding.slideIn,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: MOTION.onboarding.slideIn,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 9,
          tension: 72,
          useNativeDriver: true,
        }),
      ]).start(() => setIsChanging(false));
    });
  };

  const finish = async () => {
    if (isCompleting || isChanging) return;
    setIsCompleting(true);

    await completeOnboarding();

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: MOTION.onboarding.completionExit,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -10,
        duration: MOTION.onboarding.completionExit,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) router.replace("/welcome");
    });
  };

  const handleNext = () => (isLastSlide ? void finish() : animateToSlide(currentIndex + 1));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
        <View pointerEvents="none" style={[styles.topGlow, { width: width * 1.15, height: width * 1.15, borderRadius: width, top: -width * 0.78, right: -width * 0.28, opacity: 0.14 }]} />
        <View pointerEvents="none" style={[styles.bottomGlow, { width: width * 1.35, height: width * 1.35, borderRadius: width, bottom: -width * 0.82, left: -width * 0.44, opacity: 0.12 }]} />
        <View style={[styles.header, { paddingHorizontal: horizontalPadding, paddingTop: isCompact ? 4 : 10 }]}>
          <Button title="تخطي" onPress={finish} variant="text" size="small" fullWidth={false} disabled={isChanging || isCompleting} style={styles.skipButton} textStyle={styles.skipText} />
        </View>
        <View style={{ paddingHorizontal: horizontalPadding, flex: 1 }}>
          <OnboardingSlide item={currentItem} index={currentIndex} cardWidth={cardWidth} cardHeight={cardHeight} isTablet={isTablet} isCompact={isCompact} brandSize={brandSize} titleSize={titleSize} descriptionSize={descriptionSize} opacity={opacity} translateY={translateY} scale={scale} imageFloat={imageFloat} />
        </View>
        <View style={{ paddingHorizontal: horizontalPadding, paddingBottom: isCompact ? 8 : 16 }}>
          <OnboardingFooter currentIndex={currentIndex} indicatorWidths={indicatorWidths} isChanging={isChanging} isCompleting={isCompleting} isLastSlide={isLastSlide} cardWidth={cardWidth} buttonHeight={buttonHeight} opacity={footerOpacity} translateY={footerTranslateY} onSelect={animateToSlide} onNext={handleNext} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
