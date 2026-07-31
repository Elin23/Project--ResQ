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

export default function EntityProfileSection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
  return (<>
{renderSectionHeader(
  isClinic ? "بيانات العيادة الرسمية" : "بيانات المنظمة الرسمية",
  true,
)}

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.entityName && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={entityName}
      onChangeText={(value) => {
        setEntityName(value);
        setErrors((current) => ({
          ...current,
          entityName: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "الاسم المعتمد للعيادة"
          : "الاسم المعتمد للمنظمة"
      }
      placeholderTextColor="#777B75"
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.entityName)}
</View>

<View style={styles.fieldGroup}>
  <Pressable
    onPress={() => {
      closeDropdowns();
      setShowCategories((current) => !current);
    }}
    style={[
      styles.inputContainer,
      errors.entityCategory && styles.inputContainerError,
    ]}
  >
    <AppText
      style={[
        styles.selectText,
        !entityCategory && styles.selectPlaceholder,
      ]}
    >
      {entityCategory ||
        (isClinic ? "نوع العيادة" : "نوع الكيان")}
    </AppText>
    <Ionicons
      name={
        showCategories
          ? "chevron-up-outline"
          : "chevron-down-outline"
      }
      size={20}
      color="#4D514A"
    />
  </Pressable>
  {showCategories
    ? renderDropdown(categories, entityCategory, (item) => {
        setEntityCategory(item);
        setShowCategories(false);
        setErrors((current) => ({
          ...current,
          entityCategory: undefined,
        }));
      })
    : null}
  {renderError(errors.entityCategory)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.licenseNumber && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={licenseNumber}
      onChangeText={(value) => {
        setLicenseNumber(value);
        setErrors((current) => ({
          ...current,
          licenseNumber: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "رقم ترخيص العيادة"
          : "رقم الترخيص، مثال: RGE-2024-XXXX"
      }
      placeholderTextColor="#777B75"
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.licenseNumber)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.issuingAuthority && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={issuingAuthority}
      onChangeText={(value) => {
        setIssuingAuthority(value);
        setErrors((current) => ({
          ...current,
          issuingAuthority: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "جهة الإصدار، مثال: نقابة الأطباء البيطريين"
          : "جهة الإصدار، مثال: وزارة الشؤون الاجتماعية"
      }
      placeholderTextColor="#777B75"
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.issuingAuthority)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.textAreaContainer,
      errors.description && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={description}
      onChangeText={(value) => {
        setDescription(value.slice(0, 500));
        setErrors((current) => ({
          ...current,
          description: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "نبذة عن العيادة وخبرتها والخدمات التي تقدمها..."
          : "تعريف بإيجاز عن أهداف الجمعية وتاريخها..."
      }
      placeholderTextColor="#777B75"
      textAlign="right"
      textAlignVertical="top"
      multiline
      maxLength={500}
      style={styles.textArea}
    />
  </View>
  <AppText style={styles.counterText}>
    {description.length} / 500
  </AppText>
  {renderError(errors.description)}
</View>
  </>);
}
