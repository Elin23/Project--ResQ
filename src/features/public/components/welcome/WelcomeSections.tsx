import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, View } from "react-native";

import { IMAGES } from "@/src/assets/images";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import type { useWelcomeScreen } from "../../hooks/useWelcomeScreen";
import { styles } from "../../screens/Welcome.styles";

type WelcomeModel = ReturnType<typeof useWelcomeScreen>;

export function WelcomeBackground({ model }: { model: WelcomeModel }) {
  const { width, height, glowOpacity, glowScale } = model;
  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.topGlow, { width: width * 1.05, height: width * 1.05, borderRadius: width, top: -width * 0.56, left: -width * 0.03, opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
      <Animated.View pointerEvents="none" style={[styles.sideGlow, { width: width * 0.75, height: width * 0.75, borderRadius: width, right: -width * 0.58, top: height * 0.15, opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
    </>
  );
}

export function WelcomeHero({ model }: { model: WelcomeModel }) {
  const { isCompact, horizontalPadding, illustrationSize, logoOpacity, logoScale, logoTranslateY, logoFloat, sloganOpacity, sloganTranslateY } = model;
  return (
    <View style={[styles.heroSection, { paddingHorizontal: horizontalPadding, paddingTop: isCompact ? 24 : 42 }]}>
      <Animated.View style={[styles.logoWrapper, { width: illustrationSize * 1.35, height: illustrationSize * 1.35, opacity: logoOpacity, transform: [{ translateY: logoTranslateY }, { translateY: logoFloat }, { scale: logoScale }] }]}>
        <View style={[styles.logoHalo, { width: illustrationSize * 1.18, height: illustrationSize * 1.18, borderRadius: illustrationSize }]} />
        <Image source={IMAGES.resqDog} resizeMode="contain" style={[styles.logoImage, { width: illustrationSize, height: illustrationSize }]} />
      </Animated.View>
      <Animated.View style={[styles.sloganRow, { opacity: sloganOpacity, transform: [{ translateY: sloganTranslateY }] }]}>
        <Ionicons name="heart-half-outline" size={19} color="#B95415" />
        <AppText style={styles.slogan}>معاً لانقاذ الارواح</AppText>
      </Animated.View>
    </View>
  );
}

export function WelcomePanel({ model }: { model: WelcomeModel }) {
  const { isCompact, horizontalPadding, contentWidth, panelTopMargin, titleSize, descriptionSize, buttonHeight, panelOpacity, panelTranslateY, panelScale, titleOpacity, titleTranslateY, descriptionOpacity, descriptionTranslateY, createButtonOpacity, createButtonTranslateY, loginButtonOpacity, loginButtonTranslateY, guestOpacity, guestTranslateY, termsOpacity, shimmerTranslateX, isNavigating, navigateWithFade, router } = model;
  return (
    <Animated.View style={[styles.panel, { width: "100%", marginTop: panelTopMargin, paddingHorizontal: horizontalPadding, paddingTop: isCompact ? 34 : 42, paddingBottom: isCompact ? 24 : 34, opacity: panelOpacity, transform: [{ translateY: panelTranslateY }, { scale: panelScale }] }]}>
      <Animated.View style={[styles.titleContainer, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}>
        <View style={styles.titleRow}>
          <View style={styles.brandRow}>
            <Ionicons name="paw" size={titleSize * 0.68} color="#222222" />
            <View style={styles.brandNameRow}>
              <AppText style={[styles.brandAccent, { fontSize: titleSize, lineHeight: titleSize * 1.35 }]}>Q</AppText>
              <AppText style={[styles.brandText, { fontSize: titleSize, lineHeight: titleSize * 1.35 }]}>Res</AppText>
            </View>
          </View>
          <AppText style={[styles.welcomeTitle, { fontSize: titleSize, lineHeight: titleSize * 1.4 }]}>مرحباً بك في</AppText>
        </View>
      </Animated.View>

      <Animated.View style={[styles.descriptionContainer, { width: contentWidth, opacity: descriptionOpacity, transform: [{ translateY: descriptionTranslateY }] }]}>
        <AppText style={[styles.description, { fontSize: descriptionSize, lineHeight: descriptionSize * 1.8 }]}>ساهم في إنقاذ الحيوانات، تابع البلاغات، وانضم إلى مجتمع يهتم بالحياة.</AppText>
      </Animated.View>

      <View style={[styles.actions, { width: contentWidth, marginTop: isCompact ? 38 : 66 }]}>
        <Animated.View style={[styles.fullWidth, { opacity: createButtonOpacity, transform: [{ translateY: createButtonTranslateY }] }]}>
          <View style={[styles.primaryButtonWrapper, { height: buttonHeight }]}>
            <Button title="إنشاء حساب" onPress={() => navigateWithFade("/choose-account")} variant="custom" size="large" icon="person-add-outline" iconPosition="end" iconSize={23} disabled={isNavigating} fullWidth backgroundColor="#FF8849" borderColor="#FF8849" borderWidth={0} textColor="#5F2B12" radius={17} style={[styles.primaryButton, { height: buttonHeight, minHeight: buttonHeight }]} textStyle={styles.primaryButtonText} />
            <Animated.View pointerEvents="none" style={[styles.buttonShimmer, { transform: [{ translateX: shimmerTranslateX }, { rotate: "18deg" }] }]} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.fullWidth, { opacity: loginButtonOpacity, transform: [{ translateY: loginButtonTranslateY }] }]}>
          <Button title="تسجيل الدخول" onPress={() => navigateWithFade("/login")} variant="custom" size="large" icon="log-in-outline" iconPosition="end" iconSize={23} disabled={isNavigating} fullWidth backgroundColor="#FAFAFE" borderColor="#FFD0BA" borderWidth={1.5} textColor="#FF7945" radius={17} style={[styles.secondaryButton, { height: buttonHeight, minHeight: buttonHeight }]} textStyle={styles.secondaryButtonText} />
        </Animated.View>
        <Animated.View style={[styles.guestContainer, { opacity: guestOpacity, transform: [{ translateY: guestTranslateY }] }]}>
          <Button title="المتابعة كزائر" onPress={() => navigateWithFade("/(tabs)")} variant="text" size="small" icon="arrow-forward-outline" iconPosition="end" iconSize={18} disabled={isNavigating} fullWidth={false} textColor="#554842" radius={14} style={styles.guestButton} textStyle={styles.guestText} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.termsContainer, { width: contentWidth, opacity: termsOpacity }]}>
        <AppText style={styles.termsText}>باستمرارك فإنك توافق على</AppText>
        <Pressable accessibilityRole="link" accessibilityLabel="عرض الشروط" onPress={() => router.push("/terms-and-conditions" as never)} style={({ pressed, hovered }) => [styles.inlineLink, hovered && styles.inlineLinkHovered, pressed && styles.inlineLinkPressed]}><AppText style={styles.termsLink}>الشروط</AppText></Pressable>
        <AppText style={styles.termsText}>و</AppText>
        <Pressable accessibilityRole="link" accessibilityLabel="عرض سياسة الخصوصية" onPress={() => router.push("/privacy-policy" as never)} style={({ pressed, hovered }) => [styles.inlineLink, hovered && styles.inlineLinkHovered, pressed && styles.inlineLinkPressed]}><AppText style={styles.termsLink}>سياسة الخصوصية</AppText></Pressable>
      </Animated.View>
    </Animated.View>
  );
}
