import { Animated, Pressable, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { loginStyles as styles } from "../../screens/Login.styles";

type Props = {
  opacity: Animated.Value;
  translateY: Animated.Value;
  disabled: boolean;
  buttonHeight: number;
  onContinueAsGuest: () => void;
  onRegister: () => void;
};

export function LoginFooter({ opacity, translateY, disabled, buttonHeight, onContinueAsGuest, onRegister }: Props) {
  return (
    <Animated.View style={[styles.footer, { opacity, transform: [{ translateY }] }]}> 
      <View style={styles.divider}><View style={styles.dividerLine} /><AppText style={styles.dividerText}>أو</AppText><View style={styles.dividerLine} /></View>
      <Button title="المتابعة كزائر" onPress={onContinueAsGuest} variant="custom" size="large" icon="people-outline" iconPosition="end" iconSize={22} disabled={disabled} fullWidth backgroundColor="#FAFAFE" borderColor="#2B8A4B" borderWidth={1.5} textColor="#24723E" radius={17} style={[styles.guestButton, { height: buttonHeight, minHeight: buttonHeight }]} textStyle={styles.guestButtonText} />
      <View style={styles.registerRow}>
        <AppText style={styles.registerPrompt}>ليس لديك حساب؟</AppText>
        <Pressable accessibilityRole="button" accessibilityLabel="إنشاء حساب جديد" disabled={disabled} onPress={onRegister} hitSlop={8} style={({ pressed }) => [styles.registerButton, pressed && styles.linkPressed]}>
          <AppText style={styles.registerText}>إنشاء حساب</AppText>
        </Pressable>
      </View>
    </Animated.View>
  );
}
