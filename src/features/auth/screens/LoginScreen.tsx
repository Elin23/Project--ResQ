import { Ionicons } from "@expo/vector-icons";
import { Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginFooter, LoginFormSection, LoginHeader } from "../components/login";
import { useLoginForm } from "../hooks/useLoginForm";
import { loginStyles as styles } from "./Login.styles";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const form = useLoginForm();
  const isTablet = width >= 600;
  const isCompact = height < 740;
  const horizontalPadding = isTablet ? Math.min(width * 0.15, 120) : Math.max(20, width * 0.055);
  const contentWidth = Math.min(width - horizontalPadding * 2, isTablet ? 520 : 440);
  const titleSize = isTablet ? 38 : Math.max(29, Math.min(width * 0.08, 34));
  const subtitleSize = isTablet ? 18 : Math.max(14, Math.min(width * 0.04, 16));
  const buttonHeight = isTablet ? 64 : 58;
  const animation = form.animations;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.screen, { opacity: animation.screenOpacity, transform: [{ translateY: animation.screenTranslateY }] }]}> 
            <Animated.View pointerEvents="none" style={[styles.topGlow, { width: width * 1.08, height: width * 1.08, borderRadius: width, top: -width * 0.7, right: -width * 0.26, opacity: animation.glowOpacity, transform: [{ scale: animation.glowScale }] }]} />
            <Animated.View pointerEvents="none" style={[styles.bottomGlow, { width: width * 1.12, height: width * 1.12, borderRadius: width, bottom: -width * 0.82, left: -width * 0.35, opacity: animation.glowOpacity, transform: [{ scale: animation.glowScale }] }]} />
            <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
              <Pressable accessibilityRole="button" accessibilityLabel="العودة" disabled={form.disabled} hitSlop={10} onPress={form.handleBack} style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
                <Ionicons name="arrow-back-outline" size={25} color="#332D2A" />
              </Pressable>
              <View style={styles.topBarSpacer} />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding, paddingTop: isCompact ? 10 : 24, paddingBottom: isCompact ? 24 : 36 }]}> 
              <View style={[styles.content, { width: contentWidth }]}> 
                <LoginHeader opacity={animation.headerOpacity} translateY={animation.headerTranslateY} titleSize={titleSize} subtitleSize={subtitleSize} />
                <LoginFormSection opacity={animation.formOpacity} translateY={animation.formTranslateY} email={form.email} password={form.password} errors={form.errors} isSubmitting={form.isSubmitting} disabled={form.disabled} buttonHeight={buttonHeight} onEmailChange={form.handleEmailChange} onPasswordChange={form.handlePasswordChange} onEmailBlur={form.handleEmailBlur} onPasswordBlur={form.handlePasswordBlur} onForgotPassword={() => form.navigateWithFade("/forgot-password")} onSubmit={form.handleLogin} />
                <LoginFooter opacity={animation.footerOpacity} translateY={animation.footerTranslateY} disabled={form.disabled} buttonHeight={buttonHeight} onContinueAsGuest={() => form.navigateWithFade("/(tabs)")} onRegister={() => form.navigateWithFade("/choose-account")} />
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
