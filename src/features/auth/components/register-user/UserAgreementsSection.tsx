import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "../../screens/RegisterUser.styles";
import type { RegisterUserForm } from "../../hooks/useRegisterUserForm";

export default function UserAgreementsSection({ form }: { form: RegisterUserForm }) {
  const { acceptedTerms,setAcceptedTerms,acceptedUpdates,setAcceptedUpdates,errors,setErrors,renderError,handleSubmit,isSubmitting,canSubmit,router } = form;
  return (<>
<Pressable
  onPress={() => {
    setAcceptedTerms((current) => !current);
    setErrors((current) => ({
      ...current,
      terms: undefined,
    }));
  }}
  style={styles.checkboxRow}
>
  <View
    style={[
      styles.checkbox,
      acceptedTerms && styles.checkboxSelected,
    ]}
  >
    {acceptedTerms ? (
      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
    ) : null}
  </View>

  <AppText style={styles.checkboxText}>
    أوافق على{" "}
    <AppText style={styles.linkText}>شروط الاستخدام</AppText> و
    <AppText style={styles.linkText}>سياسة الخصوصية</AppText>{" "}
    لخدمة ResQ.
  </AppText>
</Pressable>

{renderError(errors.terms)}

<Pressable
  onPress={() => setAcceptedUpdates((current) => !current)}
  style={styles.checkboxRow}
>
  <View
    style={[
      styles.checkbox,
      acceptedUpdates && styles.checkboxSelected,
    ]}
  >
    {acceptedUpdates ? (
      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
    ) : null}
  </View>

  <AppText style={styles.checkboxText}>
    أرغب في تلقي تحديثات وأخبار عن الحيوانات التي تحتاج للمساعدة
    في منطقتي.
  </AppText>
</Pressable>

<View style={styles.noticeCard}>
  <Ionicons name="shield" size={23} color="#FF7B32" />

  <AppText style={styles.noticeText}>
    بياناتك في أمان. نستخدم رقم هاتفك وموقعك فقط للتواصل معك بشأن
    البلاغات التي ترسلها لضمان سرعة الاستجابة.
  </AppText>
</View>

<Button
  title="إنشاء الحساب"
  onPress={handleSubmit}
  variant="custom"
  size="large"
  fullWidth
  loading={isSubmitting}
  loadingText="جاري إنشاء الحساب..."
  disabled={!canSubmit}
  backgroundColor={canSubmit ? "#FF8849" : "#FFB990"}
  borderColor={canSubmit ? "#FF8849" : "#FFB990"}
  borderWidth={0}
  textColor="#FFFFFF"
  radius={17}
  style={styles.submitButton}
  textStyle={styles.submitButtonText}
/>

<Pressable
  onPress={() => router.replace("/login" as never)}
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
