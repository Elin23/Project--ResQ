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

export default function EntityManagerSection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
  return (<>
{renderSectionHeader("المعلومات الشخصية")}

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
    <Ionicons name="calendar-outline" size={22} color="#4D514A" />
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
      />
    </View>
  </View>
  {renderError(errors.phone)}
</View>
  </>);
}
