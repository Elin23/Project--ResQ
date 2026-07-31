import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "../../screens/RegisterUser.styles";
import type { RegisterUserForm } from "../../hooks/useRegisterUserForm";

export default function UserPasswordSection({ form }: { form: RegisterUserForm }) {
  const { password,setPassword,showPassword,setShowPassword,passwordStrength,passwordStrengthLabel,passwordStrengthColor,confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword,errors,setErrors,renderError,handleSubmit } = form;
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
      color="#4D514A"
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
      placeholderTextColor="#777B75"
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
        color="#596059"
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
  <View style={styles.requirementRow}>
    <Ionicons
      name={
        password.length >= 8
          ? "checkmark-circle"
          : "checkmark-circle-outline"
      }
      size={18}
      color={password.length >= 8 ? "#16833A" : "#60665F"}
    />

    <AppText style={styles.requirementText}>
      8 أحرف على الأقل
    </AppText>
  </View>

  <View style={styles.requirementRow}>
    <Ionicons
      name={
        /\d/.test(password)
          ? "checkmark-circle"
          : "checkmark-circle-outline"
      }
      size={18}
      color={/\d/.test(password) ? "#16833A" : "#60665F"}
    />

    <AppText style={styles.requirementText}>
      رقم واحد على الأقل
    </AppText>
  </View>
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
      color="#4D514A"
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
      placeholderTextColor="#777B75"
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
        color="#596059"
      />
    </Pressable>
  </View>

  {renderError(errors.confirmPassword)}
</View>
  </>);
}
