import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, View } from "react-native";

import { IMAGES } from "@/src/assets/images";
import AppText from "@/src/components/ui/AppText";
import type { useLaunchScreen } from "../hooks/useLaunchScreen";
import { styles } from "../screens/Launch.styles";

type LaunchModel = ReturnType<typeof useLaunchScreen>;

export function LaunchBackground({ model }: { model: LaunchModel }) {
  const { width, height, particleOneOpacity, particleOneTranslateY, particleTwoOpacity, particleTwoTranslateY, particleThreeOpacity, particleThreeTranslateY } = model;
  return (
    <>
      <View pointerEvents="none" style={[styles.leftGlow, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, left: -width * 0.68, top: height * 0.22 }]} />
      <View pointerEvents="none" style={[styles.topGlow, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, right: -width * 0.5, top: -width * 0.55 }]} />
      <Animated.View pointerEvents="none" style={[styles.particle, styles.particleOne, { opacity: particleOneOpacity, transform: [{ translateY: particleOneTranslateY }] }]} />
      <Animated.View pointerEvents="none" style={[styles.particle, styles.particleTwo, { opacity: particleTwoOpacity, transform: [{ translateY: particleTwoTranslateY }] }]} />
      <Animated.View pointerEvents="none" style={[styles.particle, styles.particleThree, { opacity: particleThreeOpacity, transform: [{ translateY: particleThreeTranslateY }] }]} />
    </>
  );
}

export function LaunchContent({ model }: { model: LaunchModel }) {
  const { height, isCompact, isTablet, illustrationSize, brandFontSize, subtitleFontSize, illustrationOpacity, illustrationScale, illustrationTranslateY, floatingTranslateY, pulseScale, pulseOpacity, brandOpacity, brandTranslateY, brandScale, subtitleOpacity, subtitleTranslateY } = model;
  return (
    <View style={[styles.content, { paddingHorizontal: isTablet ? 48 : 24 }]}>
      <View style={[styles.illustrationArea, { width: illustrationSize * 1.55, height: illustrationSize * 1.55, marginBottom: isCompact ? 30 : height * 0.045 }]}>
        <Animated.View style={[styles.pulseCircle, { width: illustrationSize * 1.15, height: illustrationSize * 1.15, borderRadius: illustrationSize, opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} />
        <View style={[styles.softCircle, { width: illustrationSize * 1.08, height: illustrationSize * 1.08, borderRadius: illustrationSize }]} />
        <Animated.View style={[styles.illustrationContainer, { width: illustrationSize, height: illustrationSize, opacity: illustrationOpacity, transform: [{ translateY: illustrationTranslateY }, { translateY: floatingTranslateY }, { scale: illustrationScale }] }]}>
          <Image source={IMAGES.resqDog} resizeMode="contain" style={styles.illustration} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.brandContainer, { opacity: brandOpacity, transform: [{ translateY: brandTranslateY }, { scale: brandScale }] }]}>
        <View style={styles.brandRow}>
          <View style={[styles.pawContainer, { width: brandFontSize * 0.9, height: brandFontSize * 0.9, borderRadius: brandFontSize * 0.3 }]}>
            <Ionicons name="paw" size={brandFontSize * 0.58} color="#222222" />
          </View>
          <AppText style={[styles.brandAccent, { fontSize: brandFontSize, lineHeight: brandFontSize * 1.2 }]}>Q</AppText>
          <View style={styles.brandNameRow}><AppText style={[styles.brandText, { fontSize: brandFontSize, lineHeight: brandFontSize * 1.2 }]}>Res</AppText></View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] }]}>
        <AppText style={[styles.subtitle, { fontSize: subtitleFontSize, lineHeight: subtitleFontSize * 1.65 }]}>لأن كل حياة تستحق فرصة.</AppText>
        <View style={styles.subtitleDecoration}><View style={styles.decorationDot} /><View style={styles.decorationLine} /><View style={styles.decorationDot} /></View>
      </Animated.View>
    </View>
  );
}

export function LaunchLoader({ model }: { model: LaunchModel }) {
  const { isCompact, loaderWidth, loaderOpacity, progressWidth, progressGlowOpacity } = model;
  return (
    <Animated.View style={[styles.loaderSection, { width: loaderWidth, bottom: isCompact ? 22 : 38, opacity: loaderOpacity }]}>
      <View style={styles.loaderTrack}>
        <Animated.View style={[styles.loaderFill, { width: progressWidth }]}>
          <Animated.View style={[styles.loaderGlow, { opacity: progressGlowOpacity }]} />
        </Animated.View>
      </View>
      <AppText style={styles.loadingText}>جاري التحضير...</AppText>
    </Animated.View>
  );
}
