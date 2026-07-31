import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import styles from "./ForgotPassword.styles";

import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
export default function ForgotPasswordScreen() {
  const {
    width,
    isCompact,
    horizontalPadding,
    contentWidth,
    titleSize,
    descriptionSize,
    illustrationSize,
    buttonHeight,
    phone,
    errors,
    isSubmitting,
    isNavigating,
    screenOpacity,
    screenTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    titleOpacity,
    titleTranslateY,
    formOpacity,
    formTranslateY,
    footerOpacity,
    footerTranslateY,
    lockFloat,
    glowScale,
    glowOpacity,
    handlePhoneChange,
    handlePhoneBlur,
    handleBack,
    navigateToLogin,
    handleSendCode,
  } = useForgotPasswordForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
          <Animated.View
            style={[
              styles.screen,
              {
                opacity: screenOpacity,
                transform: [{ translateY: screenTranslateY }],
              },
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.topGlow,
                {
                  width: width * 1.08,
                  height: width * 1.08,
                  borderRadius: width,
                  top: -width * 0.78,
                  right: -width * 0.3,
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.bottomGlow,
                {
                  width: width * 1.18,
                  height: width * 1.18,
                  borderRadius: width,
                  bottom: -width * 0.88,
                  left: -width * 0.4,
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            <View
              style={[
                styles.topBar,
                {
                  paddingHorizontal: horizontalPadding,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="العودة إلى تسجيل الدخول"
                disabled={isSubmitting || isNavigating}
                hitSlop={10}
                onPress={handleBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
              >
                <Ionicons name="arrow-back-outline" size={25} color="#332D2A" />
              </Pressable>

              <View style={styles.topBarSpacer} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: isCompact ? 4 : 14,
                  paddingBottom: isCompact ? 24 : 34,
                },
              ]}
            >
              <View
                style={[
                  styles.content,
                  {
                    width: contentWidth,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.illustrationContainer,
                    {
                      width: illustrationSize,
                      height: illustrationSize,
                      opacity: illustrationOpacity,
                      transform: [
                        { translateY: illustrationTranslateY },
                        { translateY: lockFloat },
                        { scale: illustrationScale },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.illustrationHalo,
                      {
                        width: illustrationSize,
                        height: illustrationSize,
                        borderRadius: illustrationSize / 2,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.lockShackle,
                      {
                        width: illustrationSize * 0.44,
                        height: illustrationSize * 0.45,
                        borderRadius: illustrationSize * 0.22,
                        borderWidth: Math.max(8, illustrationSize * 0.06),
                        top: illustrationSize * 0.13,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.lockBody,
                      {
                        width: illustrationSize * 0.62,
                        height: illustrationSize * 0.48,
                        borderRadius: illustrationSize * 0.1,
                        bottom: illustrationSize * 0.14,
                      },
                    ]}
                  >
                    <View style={styles.keyholeCircle} />

                    <View style={styles.keyholeStem} />
                  </View>

                  <View
                    style={[
                      styles.passwordBadge,
                      {
                        left: illustrationSize * 0.02,
                        bottom: illustrationSize * 0.08,
                      },
                    ]}
                  >
                    <AppText style={styles.passwordStars}>* * * *</AppText>
                  </View>

                  <View
                    style={[
                      styles.refreshBadge,
                      {
                        right: illustrationSize * 0.01,
                        bottom: illustrationSize * 0.03,
                      },
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={illustrationSize * 0.25}
                      color="#603117"
                    />
                  </View>

                  <View
                    style={[
                      styles.sparkleOne,
                      {
                        top: illustrationSize * 0.2,
                        right: illustrationSize * 0.02,
                      },
                    ]}
                  >
                    <Ionicons name="sparkles" size={18} color="#F2A13B" />
                  </View>

                  <View
                    style={[
                      styles.sparkleTwo,
                      {
                        top: illustrationSize * 0.34,
                        left: illustrationSize * 0.02,
                      },
                    ]}
                  >
                    <Ionicons name="star" size={13} color="#F2A13B" />
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.header,
                    {
                      opacity: titleOpacity,
                      transform: [{ translateY: titleTranslateY }],
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.title,
                      {
                        fontSize: titleSize,
                        lineHeight: titleSize * 1.35,
                      },
                    ]}
                  >
                    نسيت كلمة المرور؟
                  </AppText>

                  <AppText
                    style={[
                      styles.description,
                      {
                        fontSize: descriptionSize,
                        lineHeight: descriptionSize * 1.75,
                      },
                    ]}
                  >
                    أدخل رقم هاتفك المسجل وسنرسل إليك رمز تحقق لإعادة تعيين كلمة
                    المرور.
                  </AppText>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.form,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formTranslateY }],
                    },
                  ]}
                >
                  <Input
                    label="رقم الهاتف"
                    required
                    value={phone}
                    onChangeText={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    onSubmitEditing={handleSendCode}
                    placeholder="9XX XXX XXX"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    returnKeyType="send"
                    icon="call-outline"
                    iconSize={22}
                    prefix="+963"
                    prefixWidth={88}
                    maxLength={9}
                    error={errors.phone}
                    disabled={isSubmitting || isNavigating}
                    containerStyle={styles.phoneInput}
                  />

                  {errors.general ? (
                    <View style={styles.generalError}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#B74424"
                      />

                      <AppText style={styles.generalErrorText}>
                        {errors.general}
                      </AppText>
                    </View>
                  ) : null}

                  <Button
                    title="إرسال رمز التحقق"
                    onPress={handleSendCode}
                    variant="custom"
                    size="large"
                    icon="send-outline"
                    iconPosition="end"
                    iconSize={22}
                    disabled={isNavigating}
                    fullWidth
                    backgroundColor="#FF8849"
                    borderColor="#FF8849"
                    borderWidth={0}
                    textColor="#603016"
                    radius={16}
                    style={[
                      styles.submitButton,
                      {
                        height: buttonHeight,
                        minHeight: buttonHeight,
                      },
                    ]}
                    textStyle={styles.submitButtonText}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.footer,
                    {
                      opacity: footerOpacity,
                      transform: [{ translateY: footerTranslateY }],
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="العودة إلى تسجيل الدخول"
                    disabled={isSubmitting || isNavigating}
                    onPress={navigateToLogin}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.loginLink,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.loginLinkText}>تسجيل الدخول</AppText>
                  </Pressable>
                  <AppText style={styles.footerText}>
                    تذكرت كلمة المرور؟
                  </AppText>
                </Animated.View>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
