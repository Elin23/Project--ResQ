import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";
import { styles } from "../../screens/RegisterUser.styles";
import { SYRIAN_GOVERNORATES as GOVERNORATES } from "../../constants/governorates";
import type { RegisterUserForm } from "../../hooks/useRegisterUserForm";

export default function UserPersonalInfoSection({ form }: { form: RegisterUserForm }) {
  const { fullName,setFullName,email,setEmail,birthDate,formattedBirthDate,openBirthDatePicker,phone,setPhone,governorate,setGovernorate,showGovernorates,setShowGovernorates,showBirthDatePicker,temporaryBirthDate,minimumBirthDate,maximumBirthDate,handleBirthDateChange,errors,setErrors,renderError } = form;
  return (<>
<View style={styles.sectionHeader}>
  <View style={styles.sectionMarker} />
  <AppText style={styles.sectionTitle}>المعلومات الشخصية</AppText>
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.fullName && styles.inputContainerError,
    ]}
  >
    <Ionicons name="person-outline" size={21} color="#4D514A" />

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
      placeholderTextColor="#777B75"
      textAlign="right"
      style={styles.input}
      returnKeyType="next"
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
    <Ionicons name="mail-outline" size={21} color="#4D514A" />

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
      placeholderTextColor="#777B75"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      textAlign="right"
      style={styles.input}
      returnKeyType="next"
    />
  </View>

  {renderError(errors.email)}
</View>

<View style={styles.fieldGroup}>
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="اختيار تاريخ الميلاد"
    onPress={openBirthDatePicker}
    style={({ pressed }) => [
      styles.inputContainer,
      errors.birthDate && styles.inputContainerError,
      pressed && styles.dateFieldPressed,
    ]}
  >
    <Ionicons name="calendar-outline" size={22} color="#4D514A" />

    <AppText
      style={[
        styles.dateValue,
        !birthDate && styles.datePlaceholder,
      ]}
    >
      {formattedBirthDate || "تاريخ الميلاد"}
    </AppText>

    <Ionicons
      name="chevron-down-outline"
      size={19}
      color="#626861"
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
      <Ionicons name="call-outline" size={21} color="#4D514A" />

      <TextInput
        value={phone}
        onChangeText={(value) => {
          setPhone(value.replace(/\D/g, "").slice(0, 9));
          setErrors((current) => ({
            ...current,
            phone: undefined,
          }));
        }}
        placeholder="رقم الهاتف"
        placeholderTextColor="#777B75"
        keyboardType="phone-pad"
        textAlign="right"
        style={styles.input}
        returnKeyType="next"
      />
    </View>
  </View>

  {renderError(errors.phone)}
</View>

<View style={styles.fieldGroup}>
  <Pressable
    onPress={() => setShowGovernorates((current) => !current)}
    style={[
      styles.inputContainer,
      errors.governorate && styles.inputContainerError,
    ]}
  >
    <Ionicons name="location-outline" size={22} color="#4D514A" />

    <AppText
      style={[
        styles.selectText,
        !governorate && styles.selectPlaceholder,
      ]}
    >
      {governorate || "المحافظة"}
    </AppText>

    <Ionicons
      name={
        showGovernorates
          ? "chevron-up-outline"
          : "chevron-down-outline"
      }
      size={20}
      color="#4D514A"
    />
  </Pressable>

  {showGovernorates ? (
    <View style={styles.dropdown}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.dropdownContent}
      >
        {GOVERNORATES.map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              setGovernorate(item);
              setShowGovernorates(false);
              setErrors((current) => ({
                ...current,
                governorate: undefined,
              }));
            }}
            style={({ pressed }) => [
              styles.dropdownItem,
              governorate === item && styles.selectedDropdownItem,
              pressed && styles.dropdownItemPressed,
            ]}
          >
            <AppText style={styles.dropdownItemText}>
              {item}
            </AppText>

            {governorate === item ? (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#16833A"
              />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  ) : null}

  {renderError(errors.governorate)}
</View>
  </>);
}
