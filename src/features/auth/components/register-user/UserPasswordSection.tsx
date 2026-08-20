import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterUser.styles";
import type { RegisterUserForm } from "../../hooks/useRegisterUserForm";

export default function UserPasswordSection({ form }: { form: RegisterUserForm }) {
  const { password,setPassword,passwordRequirements,showPassword,setShowPassword,passwordStrength,passwordStrengthLabel,passwordStrengthColor,confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword,errors,setErrors,renderError,handleSubmit } = form;
  return (<>
<View style={[styles.sectionHeader, styles.passwordHeader]}>
  <View style={styles.sectionMarker} />
  <AppText style={styles.sectionTitle}>كلمة المرور</AppText>
</View>

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
      returnKeyType="next"
    />

    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
      }
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
      {
        color: passwordStrengthColor,
      },
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
      returnKeyType="done"
      onSubmitEditing={handleSubmit}
    />

    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        showConfirmPassword
          ? "إخفاء تأكيد كلمة المرور"
          : "إظهار تأكيد كلمة المرور"
      }
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
  </>);
}
