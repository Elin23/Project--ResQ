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

export default function EntityDocumentsSection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
  return (<>
{renderSectionHeader("هوية الجهة والثبوتيات", true)}

<Pressable
  onPress={() => pickImage("logo")}
  style={styles.logoUploadCard}
>
  {logo ? (
    <Image source={{ uri: logo }} style={styles.logoPreview} />
  ) : (
    <Ionicons name="image-outline" size={35} color="#7B877B" />
  )}
  <AppText style={styles.logoUploadTitle}>
    شعار {entityTitle} (اختياري)
  </AppText>
  <AppText style={styles.uploadSubtitle}>
    استخدم صورة واضحة بصيغة JPG أو PNG
  </AppText>
</Pressable>

{renderUploadCard(
  "license",
  isClinic ? "صورة ترخيص العيادة" : "شهادة الترخيص الرسمية",
  "صيغة JPG أو PNG وبجودة واضحة",
  licenseDocument,
  true,
)}
{renderError(errors.licenseDocument)}

{renderUploadCard(
  "manager",
  "تفويض مدير الحساب",
  "اختياري إذا لم يكن مقدم الطلب صاحب الترخيص",
  managerDocument,
)}

{renderUploadCard(
  "extra",
  isClinic
    ? "ترخيص الطبيب المسؤول"
    : "النظام الداخلي أو سياسة الجمعية",
  isClinic
    ? "اختياري عند توفره"
    : "اختياري ويساعد في تسريع التحقق",
  extraDocument,
)}
  </>);
}
