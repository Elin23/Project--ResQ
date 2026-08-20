import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityManagerSection({ form }: { form: RegisterEntityForm }) {
  const { fullName, setFullName, email, setEmail, birthDate, temporaryBirthDate, phone, setPhone, normalizeSyrianMobile, showBirthDatePicker, errors, setErrors, maximumBirthDate, minimumBirthDate, formattedBirthDate, openBirthDatePicker, handleBirthDateChange, renderError, renderSectionHeader } = form;
  return (<>
{renderSectionHeader("المعلومات الشخصية")}

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.fullName && styles.inputContainerError,
    ]}
  >
    <Ionicons name="person-outline" size={21} color={PALETTE.neutral700} />
    <TextInput
      value={fullName}
      onChangeText={(value) => {
        setFullName(value);
        setErrors((current) => ({
          ...current,
          fullName: undefined,
        }));
      }}
      placeholder="الاسم الكامل"
      placeholderTextColor={PALETTE.neutral600}
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.fullName)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.email && styles.inputContainerError,
    ]}
  >
    <Ionicons name="mail-outline" size={21} color={PALETTE.neutral700} />
    <TextInput
      value={email}
      onChangeText={(value) => {
        setEmail(value);
        setErrors((current) => ({
          ...current,
          email: undefined,
        }));
      }}
      placeholder="البريد الإلكتروني"
      placeholderTextColor={PALETTE.neutral600}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.email)}
</View>

<View style={styles.fieldGroup}>
  <Pressable
    onPress={openBirthDatePicker}
    style={({ pressed }) => [
      styles.inputContainer,
      errors.birthDate && styles.inputContainerError,
      pressed && styles.pressedField,
    ]}
  >
    <Ionicons name="calendar-outline" size={22} color={PALETTE.neutral700} />
    <AppText
      style={[
        styles.selectText,
        !birthDate && styles.selectPlaceholder,
      ]}
    >
      {formattedBirthDate || "تاريخ الميلاد"}
    </AppText>
    <Ionicons
      name="chevron-down-outline"
      size={19}
      color={COLORS.textMuted}
    />
  </Pressable>
  {renderError(errors.birthDate)}
</View>

{Platform.OS === "android" && showBirthDatePicker ? (
  <DateTimePicker
    value={temporaryBirthDate}
    mode="date"
    display="default"
    minimumDate={minimumBirthDate}
    maximumDate={maximumBirthDate}
    onChange={handleBirthDateChange}
  />
) : null}

<View style={styles.fieldGroup}>
  <View style={styles.phoneRow}>
    <View style={styles.countryCodeBox}>
      <AppText style={styles.countryCodeText}>+963</AppText>
    </View>
    <View
      style={[
        styles.inputContainer,
        styles.phoneInputContainer,
        errors.phone && styles.inputContainerError,
      ]}
    >
      <Ionicons name="call-outline" size={21} color={PALETTE.neutral700} />
      <TextInput
        value={phone}
        onChangeText={(value) => {
          setPhone(normalizeSyrianMobile(value));
          setErrors((current) => ({
            ...current,
            phone: undefined,
          }));
        }}
        placeholder="رقم الهاتف"
        placeholderTextColor={PALETTE.neutral600}
        keyboardType="phone-pad"
        textAlign="right"
        style={styles.input}
      />
    </View>
  </View>
  {renderError(errors.phone)}
</View>
  </>);
}
