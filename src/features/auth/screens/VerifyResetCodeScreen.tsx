import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { OtpCodeInput } from "../components/password-reset";
import { RESET_CODE_LENGTH } from "../utils/passwordResetValidation";
import styles from "./VerifyResetCode.styles";

import { useVerifyResetCode } from "../hooks/useVerifyResetCode";
export default function VerifyResetCodeScreen() {
  const {
    width,
    isCompact,
    horizontalPadding,
    contentWidth,
    titleSize,
    descriptionSize,
    illustrationSize,
    buttonHeight,
    code,
    errors,
    isSubmitting,
    isNavigating,
    resendSeconds,
    formattedTimer,
    verificationStatus,
    codeInputRef,
    screenOpacity,
    maskedPhone,
    handleCodeChange,
    handleBack,
    handleChangePhone,
    handleResendCode,
    handleVerifyCode,
  } = useVerifyResetCode();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
          <View
            pointerEvents="none"
            style={[
              styles.topGlow,
              {
                width: width * 1.08,
                height: width * 1.08,
                borderRadius: width,
                top: -width * 0.78,
                right: -width * 0.3,
                opacity: 0.1,
              },
            ]}
          />

          <View
            pointerEvents="none"
            style={[
              styles.bottomGlow,
              {
                width: width * 1.18,
                height: width * 1.18,
                borderRadius: width,
                bottom: -width * 0.88,
                left: -width * 0.4,
                opacity: 0.1,
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
              accessibilityLabel="العودة"
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
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 0 : 8,
                paddingBottom: isCompact ? 24 : 36,
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
              <View
                style={[
                  styles.illustrationContainer,
                  {
                    width: illustrationSize,
                    height: illustrationSize,
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
                    styles.phoneCard,
                    {
                      width: illustrationSize * 0.5,
                      height: illustrationSize * 0.8,
                      borderRadius: illustrationSize * 0.08,
                    },
                  ]}
                >
                  <View style={styles.phoneSpeaker} />

                  <View style={styles.phoneScreen}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={illustrationSize * 0.26}
                      color="#E97835"
                    />

                    <View style={styles.screenKey}>
                      <Ionicons
                        name="key-outline"
                        size={illustrationSize * 0.13}
                        color="#693619"
                      />
                    </View>
                  </View>

                  <View style={styles.phoneHomeIndicator} />
                </View>

                <View style={styles.codeBubble}>
                  <Ionicons name="key" size={18} color="#6D381B" />
                </View>

                <View style={styles.sparkleOne}>
                  <Ionicons name="sparkles" size={18} color="#EF9A36" />
                </View>
              </View>

              <View style={styles.header}>
                <AppText
                  style={[
                    styles.title,
                    {
                      fontSize: titleSize,
                      lineHeight: titleSize * 1.35,
                    },
                  ]}
                >
                  أدخل رمز التحقق
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
                  أرسلنا رمزًا مكوّنًا من 6 أرقام إلى رقم الهاتف التالي:
                </AppText>
              </View>

              <View style={styles.form}>
                <View style={styles.phoneInfoCard}>
                  <View style={styles.phoneInfoIcon}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={24}
                      color="#402E27"
                    />
                  </View>

                  <AppText style={styles.phoneNumber}>{maskedPhone}</AppText>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="تغيير رقم الهاتف"
                    disabled={isSubmitting || isNavigating}
                    onPress={handleChangePhone}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.changePhoneButton,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.changePhoneText}>تغيير</AppText>
                  </Pressable>
                </View>

                <OtpCodeInput
                  ref={codeInputRef}
                  value={code}
                  length={RESET_CODE_LENGTH}
                  status={verificationStatus}
                  disabled={
                    isSubmitting ||
                    isNavigating ||
                    verificationStatus === "success"
                  }
                  onChangeText={handleCodeChange}
                  onSubmit={handleVerifyCode}
                />

                {verificationStatus === "success" ? (
                  <Animated.View style={styles.successMessage}>
                    <Ionicons
                      name="checkmark-circle"
                      size={19}
                      color="#13853A"
                    />

                    <AppText style={styles.successMessageText}>
                      تم التحقق من الرمز بنجاح
                    </AppText>
                  </Animated.View>
                ) : null}

                {errors.code ? (
                  <View style={styles.codeError}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#B74424"
                    />

                    <AppText style={styles.codeErrorText}>
                      {errors.code}
                    </AppText>
                  </View>
                ) : null}

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
                  title="تحقق من الرمز"
                  onPress={handleVerifyCode}
                  variant="custom"
                  size="large"
                  icon="shield-checkmark-outline"
                  iconPosition="end"
                  iconSize={22}
                  loading={isSubmitting}
                  loadingText="جاري التحقق..."
                  disabled={
                    isNavigating ||
                    code.length !== RESET_CODE_LENGTH ||
                    verificationStatus === "success"
                  }
                  fullWidth
                  backgroundColor={
                    code.length === RESET_CODE_LENGTH ? "#FF8849" : "#AFAFB2"
                  }
                  borderColor={
                    code.length === RESET_CODE_LENGTH ? "#FF8849" : "#AFAFB2"
                  }
                  borderWidth={0}
                  textColor={
                    code.length === RESET_CODE_LENGTH ? "#603016" : "#FFFFFF"
                  }
                  radius={16}
                  style={[
                    styles.verifyButton,
                    {
                      height: buttonHeight,
                      minHeight: buttonHeight,
                    },
                  ]}
                  textStyle={[
                    styles.verifyButtonText,
                    code.length !== RESET_CODE_LENGTH && styles.disabledButtonText,
                  ]}
                />
              </View>

              <View style={styles.footer}>
                <AppText style={styles.resendQuestion}>لم يصلك الرمز؟</AppText>

                {resendSeconds > 0 ? (
                  <AppText style={styles.resendTimer}>
                    يمكنك إعادة الإرسال خلال {formattedTimer}
                  </AppText>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="إعادة إرسال رمز التحقق"
                    disabled={isSubmitting || isNavigating}
                    onPress={handleResendCode}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.resendButton,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.resendButtonText}>
                      إعادة إرسال رمز التحقق
                    </AppText>
                  </Pressable>
                )}

                <View style={styles.helpMessage}>
                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color="#258442"
                  />

                  <AppText style={styles.helpMessageText}>
                    لم تستلم الرسالة؟ تأكد من صحة الرقم ومن توفر تغطية الشبكة.
                  </AppText>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
