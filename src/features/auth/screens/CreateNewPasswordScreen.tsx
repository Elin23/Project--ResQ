import { COLORS, PALETTE } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { PasswordRequirementsCard } from "../components/password-reset";
import styles from "./CreateNewPassword.styles";

import { useCreateNewPasswordForm } from "../hooks/useCreateNewPasswordForm";
export default function CreateNewPasswordScreen() {
  const {
    isCompact,
    horizontalPadding,
    contentWidth,
    titleSize,
    subtitleSize,
    illustrationSize,
    buttonHeight,
    password,
    confirmPassword,
    errors,
    isSubmitting,
    isNavigating,
    screenOpacity,
    illustrationOpacity,
    illustrationScale,
    headerOpacity,
    formOpacity,
    requirementsOpacity,
    buttonOpacity,
    passwordRequirements,
    doPasswordsMatch,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleBack,
    handleSavePassword,
  } = useCreateNewPasswordForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
          <ScreenHeader
            title="كلمة مرور جديدة"
            onBack={handleBack}
            horizontalPadding={horizontalPadding}
            style={styles.pageHeader}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 10 : 18,
                paddingBottom: isCompact ? 96 : 120,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator
            bounces
            overScrollMode="always"
            nestedScrollEnabled
            onScrollBeginDrag={Keyboard.dismiss}
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
                    transform: [{ scale: illustrationScale }],
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
                    styles.iconCard,
                    {
                      width: illustrationSize * 0.68,
                      height: illustrationSize * 0.68,
                      borderRadius: illustrationSize * 0.14,
                    },
                  ]}
                >
                  <View style={styles.shieldWrapper}>
                    <Ionicons
                      name="shield"
                      size={illustrationSize * 0.32}
                      color={COLORS.primary}
                    />

                    <View style={styles.keyIcon}>
                      <Ionicons
                        name="key-outline"
                        size={illustrationSize * 0.16}
                        color={COLORS.icon}
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: headerOpacity,
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
                  إنشاء كلمة مرور جديدة
                </AppText>

                <AppText
                  style={[
                    styles.subtitle,
                    {
                      fontSize: subtitleSize,
                      lineHeight: subtitleSize * 1.75,
                    },
                  ]}
                >
                  أنشئ كلمة مرور قوية وجديدة لحماية حسابك.
                </AppText>
              </Animated.View>

              <Animated.View style={[styles.form, { opacity: formOpacity }]}>
                <Input
                  label="كلمة المرور الجديدة"
                  required
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="أدخل كلمة المرور الجديدة"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="next"
                  password
                  iconSize={22}
                  error={errors.password}
                  disabled={isSubmitting || isNavigating}
                  containerStyle={styles.passwordInput}
                />

                <Input
                  label="تأكيد كلمة المرور"
                  required
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  onSubmitEditing={handleSavePassword}
                  placeholder="أعد إدخال كلمة المرور"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="done"
                  password
                  iconSize={22}
                  error={errors.confirmPassword}
                  disabled={isSubmitting || isNavigating}
                  containerStyle={styles.confirmPasswordInput}
                />

                {errors.general ? (
                  <View style={styles.generalError}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={COLORS.warning}
                    />

                    <AppText style={styles.generalErrorText}>
                      {errors.general}
                    </AppText>
                  </View>
                ) : null}
              </Animated.View>

              <Animated.View
                style={[
                  styles.requirementsCard,
                  {
                    opacity: requirementsOpacity,
                  },
                ]}
              >
                <PasswordRequirementsCard
                  requirements={passwordRequirements}
                  confirmationVisible={confirmPassword.length > 0}
                  passwordsMatch={doPasswordsMatch}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    opacity: buttonOpacity,
                  },
                ]}
              >
                <Button
                  title="حفظ كلمة المرور"
                  onPress={handleSavePassword}
                  variant="custom"
                  size="large"
                  icon="lock-closed-outline"
                  iconPosition="end"
                  iconSize={22}
                  loading={isSubmitting}
                  loadingText="جاري حفظ كلمة المرور..."
                  disabled={isNavigating}
                  fullWidth
                  backgroundColor={PALETTE.orange500}
                  borderColor={PALETTE.orange500}
                  borderWidth={0}
                  textColor={COLORS.icon}
                  radius={17}
                  style={[
                    styles.saveButton,
                    {
                      height: buttonHeight,
                      minHeight: buttonHeight,
                    },
                  ]}
                  textStyle={styles.saveButtonText}
                />
              </Animated.View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
