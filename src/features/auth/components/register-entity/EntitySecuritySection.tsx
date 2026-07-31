import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntitySecuritySection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
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
    />
    <Pressable
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
        color="#596059"
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
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
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
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
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
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
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
  backgroundColor="#FF8849"
  borderColor="#FF8849"
  borderWidth={0}
  textColor="#FFFFFF"
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
