import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { COLORS, PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntitySecuritySection({ form }: { form: RegisterEntityForm }) {
  const { router, isClinic, entityTitle, password, setPassword, passwordRequirements, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, errors, setErrors, isSubmitting, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, handleSubmit, renderError, renderSectionHeader } = form;
  return (<>
{renderSectionHeader("كلمة المرور", true)}

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.password && styles.inputContainerError,
    ]}
  >
    <Ionicons
      name="lock-closed-outline"
      size={22}
      color={PALETTE.neutral700}
    />
    <TextInput
      value={password}
      onChangeText={(value) => {
        setPassword(value);
        setErrors((current) => ({
          ...current,
          password: undefined,
        }));
      }}
      placeholder="كلمة المرور الجديدة"
      placeholderTextColor={PALETTE.neutral600}
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      autoCorrect={false}
      textAlign="right"
      style={styles.input}
    />
    <Pressable
      onPress={() => setShowPassword((current) => !current)}
      hitSlop={8}
    >
      <Ionicons
        name={showPassword ? "eye-off-outline" : "eye-outline"}
        size={23}
        color={COLORS.textMuted}
      />
    </Pressable>
  </View>
  {renderError(errors.password)}
</View>

<View style={styles.passwordStrengthHeader}>
  <AppText style={styles.passwordStrengthTitle}>
    قوة كلمة المرور
  </AppText>
  <AppText
    style={[
      styles.passwordStrengthLabel,
      { color: passwordStrengthColor },
    ]}
  >
    {passwordStrengthLabel}
  </AppText>
</View>

<View style={styles.passwordBars}>
  {[1, 2, 3].map((item) => (
    <View
      key={item}
      style={[
        styles.passwordBar,
        item <= passwordStrength && {
          backgroundColor: passwordStrengthColor,
        },
      ]}
    />
  ))}
</View>

<View style={styles.requirements}>
  {passwordRequirements.map((requirement) => (
    <View key={requirement.id} style={styles.requirementRow}>
      <Ionicons
        name={
          requirement.isValid
            ? "checkmark-circle"
            : "checkmark-circle-outline"
        }
        size={18}
        color={requirement.isValid ? PALETTE.green700 : COLORS.textMuted}
      />
      <AppText style={styles.requirementText}>
        {requirement.label}
      </AppText>
    </View>
  ))}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.confirmPassword && styles.inputContainerError,
    ]}
  >
    <Ionicons
      name="lock-closed-outline"
      size={22}
      color={PALETTE.neutral700}
    />
    <TextInput
      value={confirmPassword}
      onChangeText={(value) => {
        setConfirmPassword(value);
        setErrors((current) => ({
          ...current,
          confirmPassword: undefined,
        }));
      }}
      placeholder="تأكيد كلمة المرور"
      placeholderTextColor={PALETTE.neutral600}
      secureTextEntry={!showConfirmPassword}
      autoCapitalize="none"
      autoCorrect={false}
      textAlign="right"
      style={styles.input}
    />
    <Pressable
      onPress={() =>
        setShowConfirmPassword((current) => !current)
      }
      hitSlop={8}
    >
      <Ionicons
        name={
          showConfirmPassword ? "eye-off-outline" : "eye-outline"
        }
        size={23}
        color={COLORS.textMuted}
      />
    </Pressable>
  </View>
  {renderError(errors.confirmPassword)}
</View>

<View style={styles.confirmationCard}>
  <Pressable
    onPress={() => {
      setInformationConfirmed((current) => !current);
      setErrors((current) => ({
        ...current,
        information: undefined,
      }));
    }}
    style={styles.checkboxRow}
  >
    <View
      style={[
        styles.checkbox,
        informationConfirmed && styles.checkboxSelected,
      ]}
    >
      {informationConfirmed ? (
        <Ionicons name="checkmark" size={16} color={PALETTE.neutral0} />
      ) : null}
    </View>
    <AppText style={styles.checkboxText}>
      أقر أن جميع البيانات والوثائق المقدمة صحيحة وأتحمل مسؤولية
      المعلومات.
    </AppText>
  </Pressable>
  {renderError(errors.information)}

  <Pressable
    onPress={() => {
      setVerificationConfirmed((current) => !current);
      setErrors((current) => ({
        ...current,
        verification: undefined,
      }));
    }}
    style={styles.checkboxRow}
  >
    <View
      style={[
        styles.checkbox,
        verificationConfirmed && styles.checkboxSelected,
      ]}
    >
      {verificationConfirmed ? (
        <Ionicons name="checkmark" size={16} color={PALETTE.neutral0} />
      ) : null}
    </View>
    <AppText style={styles.checkboxText}>
      أدرك أن ظهور {entityTitle} وميزاتها يتطلب مراجعة واعتماد
      فريق ResQ.
    </AppText>
  </Pressable>
  {renderError(errors.verification)}

  <Pressable
    onPress={() => {
      setTermsAccepted((current) => !current);
      setErrors((current) => ({ ...current, terms: undefined }));
    }}
    style={styles.checkboxRow}
  >
    <View
      style={[
        styles.checkbox,
        termsAccepted && styles.checkboxSelected,
      ]}
    >
      {termsAccepted ? (
        <Ionicons name="checkmark" size={16} color={PALETTE.neutral0} />
      ) : null}
    </View>
    <AppText style={styles.checkboxText}>
      أوافق على{" "}
      <AppText style={styles.linkText}>
        شروط استخدام الجهة
      </AppText>{" "}
      و<AppText style={styles.linkText}>سياسة الخصوصية</AppText>.
    </AppText>
  </Pressable>
  {renderError(errors.terms)}
</View>

<Button
  title={
    isClinic
      ? "إرسال طلب تسجيل العيادة"
      : "إرسال طلب تسجيل الجمعية"
  }
  onPress={handleSubmit}
  variant="custom"
  size="large"
  fullWidth
  loading={isSubmitting}
  loadingText="جاري إرسال الطلب..."
  disabled={isSubmitting}
  backgroundColor={PALETTE.orange500}
  borderColor={PALETTE.orange500}
  borderWidth={0}
  textColor={PALETTE.neutral0}
  radius={17}
  style={styles.submitButton}
  textStyle={styles.submitButtonText}
/>

{!canSubmit && !isSubmitting ? (
  <AppText style={styles.submitHelperText}>
    يمكنك الضغط على الزر الآن، وسنوضح لك الحقول التي تحتاج إلى
    تصحيح.
  </AppText>
) : null}

<Pressable
  onPress={() => router.replace("/login")}
  style={({ pressed }) => [
    styles.loginLink,
    pressed && styles.loginLinkPressed,
  ]}
>
  <AppText style={styles.loginText}>
    لديك حساب بالفعل؟{" "}
    <AppText style={styles.loginHighlight}>تسجيل الدخول</AppText>
  </AppText>
</Pressable>
  </>);
}
