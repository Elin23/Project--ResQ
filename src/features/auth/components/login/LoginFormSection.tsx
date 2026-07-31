import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import type { LoginFormErrors } from "../../utils/authValidation";
import { loginStyles as styles } from "../../screens/Login.styles";

type Props = {
  opacity: Animated.Value;
  translateY: Animated.Value;
  email: string;
  password: string;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  disabled: boolean;
  buttonHeight: number;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
};

export function LoginFormSection(props: Props) {
  return (
    <Animated.View style={[styles.form, { opacity: props.opacity, transform: [{ translateY: props.translateY }] }]}> 
      <Input label="البريد الإلكتروني" required value={props.email} onChangeText={props.onEmailChange} onBlur={props.onEmailBlur} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" returnKeyType="next" icon="mail-outline" iconSize={22} error={props.errors.email} disabled={props.disabled} containerStyle={styles.emailInput} />
      <Input label="كلمة المرور" required value={props.password} onChangeText={props.onPasswordChange} onBlur={props.onPasswordBlur} onSubmitEditing={props.onSubmit} placeholder="أدخل كلمة المرور" autoCapitalize="none" autoCorrect={false} autoComplete="password" returnKeyType="done" password iconSize={22} error={props.errors.password} disabled={props.disabled} containerStyle={styles.passwordInput} />
      <Pressable accessibilityRole="button" accessibilityLabel="نسيت كلمة المرور" disabled={props.disabled} onPress={props.onForgotPassword} hitSlop={8} style={({ pressed }) => [styles.forgotPasswordButton, pressed && styles.linkPressed]}>
        <AppText style={styles.forgotPasswordText}>نسيت كلمة المرور؟</AppText>
      </Pressable>
      {props.errors.general ? (
        <View style={styles.generalError}>
          <Ionicons name="alert-circle-outline" size={20} color="#B74424" />
          <AppText style={styles.generalErrorText}>{props.errors.general}</AppText>
        </View>
      ) : null}
      <Button title="تسجيل الدخول" onPress={props.onSubmit} variant="custom" size="large" icon="log-in-outline" iconPosition="end" iconSize={23} loading={props.isSubmitting} loadingText="جاري تسجيل الدخول..." disabled={props.disabled && !props.isSubmitting} fullWidth backgroundColor="#FF8849" borderColor="#FF8849" borderWidth={0} textColor="#5F2B12" radius={17} style={[styles.loginButton, { height: props.buttonHeight, minHeight: props.buttonHeight }]} textStyle={styles.loginButtonText} />
    </Animated.View>
  );
}
