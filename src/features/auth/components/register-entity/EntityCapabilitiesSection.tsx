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

export default function EntityCapabilitiesSection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
  return (<>
{renderSectionHeader(
  isClinic
    ? "الخدمات والحيوانات التي تعالجها"
    : "الأنشطة والخدمات المقدمة",
  true,
)}

<AppText style={styles.subLabel}>
  {isClinic ? "الخدمات المتوفرة" : "نوع الأنشطة"}
</AppText>
{renderChips(activityOptions, selectedActivities, (id) =>
  toggleValue(
    id,
    selectedActivities,
    setSelectedActivities,
    "activities",
  ),
)}
{renderError(errors.activities)}

<AppText style={[styles.subLabel, styles.subLabelSpacing]}>
  الحيوانات التي تخدمها {entityTitle}
</AppText>
{renderChips(animalOptions, selectedAnimals, (id) =>
  toggleValue(id, selectedAnimals, setSelectedAnimals, "animals"),
)}
{renderError(errors.animals)}

{isClinic ? (
  <>
    <View style={styles.switchCard}>
      <View style={styles.switchTextWrap}>
        <AppText style={styles.switchTitle}>
          هل العيادة مفتوحة 24 ساعة؟
        </AppText>
        <AppText style={styles.switchSubtitle}>
          فعّل الخيار فقط إذا كانت الخدمة متاحة طوال اليوم.
        </AppText>
      </View>
      <Switch
        value={open24Hours}
        onValueChange={setOpen24Hours}
        trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
        thumbColor="#FFFFFF"
      />
    </View>

    {!open24Hours ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.inputContainer,
            errors.workingHours && styles.inputContainerError,
          ]}
        >
          <Ionicons
            name="time-outline"
            size={21}
            color="#4D514A"
          />
          <TextInput
            value={workingHours}
            onChangeText={(value) => {
              setWorkingHours(value);
              setErrors((current) => ({
                ...current,
                workingHours: undefined,
              }));
            }}
            placeholder="أوقات الدوام، مثال: 9 صباحاً - 9 مساءً"
            placeholderTextColor="#777B75"
            textAlign="right"
            style={styles.input}
          />
        </View>
        {renderError(errors.workingHours)}
      </View>
    ) : null}

    <View style={styles.switchCard}>
      <View style={styles.switchTextWrap}>
        <AppText style={styles.switchTitle}>
          هل تتوفر زيارات منزلية؟
        </AppText>
        <AppText style={styles.switchSubtitle}>
          يمكن للمستخدمين طلب زيارة بيطرية للمنزل.
        </AppText>
      </View>
      <Switch
        value={homeVisits}
        onValueChange={setHomeVisits}
        trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
        thumbColor="#FFFFFF"
      />
    </View>

    <View style={styles.switchCard}>
      <View style={styles.switchTextWrap}>
        <AppText style={styles.switchTitle}>
          استقبال حالات إسعافية؟
        </AppText>
        <AppText style={styles.switchSubtitle}>
          يظهر هذا الخيار للمستخدمين ضمن معلومات العيادة.
        </AppText>
      </View>
      <Switch
        value={emergencyService}
        onValueChange={setEmergencyService}
        trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
        thumbColor="#FFFFFF"
      />
    </View>
  </>
) : (
  <>
    <View style={styles.switchCard}>
      <View style={styles.switchTextWrap}>
        <AppText style={styles.switchTitle}>
          هل تتوفر لديكم منشأة إيواء؟
        </AppText>
        <AppText style={styles.switchSubtitle}>
          أضف تفاصيل السعة إذا كانت الجمعية تمتلك مأوى.
        </AppText>
      </View>
      <Switch
        value={hasShelter}
        onValueChange={setHasShelter}
        trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
        thumbColor="#FFFFFF"
      />
    </View>

    {hasShelter ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.inputContainer,
            errors.shelterCapacity && styles.inputContainerError,
          ]}
        >
          <TextInput
            value={shelterCapacity}
            onChangeText={(value) => {
              setShelterCapacity(
                value.replace(/\D/g, "").slice(0, 4),
              );
              setErrors((current) => ({
                ...current,
                shelterCapacity: undefined,
              }));
            }}
            placeholder="سعة منشأة الإيواء"
            placeholderTextColor="#777B75"
            keyboardType="number-pad"
            textAlign="right"
            style={styles.input}
          />
        </View>
        {renderError(errors.shelterCapacity)}
      </View>
    ) : null}

    <View style={styles.switchCard}>
      <View style={styles.switchTextWrap}>
        <AppText style={styles.switchTitle}>
          تستقبلون متطوعين؟
        </AppText>
        <AppText style={styles.switchSubtitle}>
          يمكن للمستخدمين إرسال طلبات انضمام للجمعية.
        </AppText>
      </View>
      <Switch
        value={acceptsVolunteers}
        onValueChange={setAcceptsVolunteers}
        trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
        thumbColor="#FFFFFF"
      />
    </View>

    {acceptsVolunteers ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.textAreaContainer,
            errors.volunteerRequirements &&
              styles.inputContainerError,
          ]}
        >
          <TextInput
            value={volunteerRequirements}
            onChangeText={(value) => {
              setVolunteerRequirements(value.slice(0, 350));
              setErrors((current) => ({
                ...current,
                volunteerRequirements: undefined,
              }));
            }}
            placeholder="أدخل شروط أو متطلبات انضمام المتطوعين..."
            placeholderTextColor="#777B75"
            multiline
            maxLength={350}
            textAlign="right"
            textAlignVertical="top"
            style={styles.textArea}
          />
        </View>
        {renderError(errors.volunteerRequirements)}
      </View>
    ) : null}
  </>
)}
  </>);
}
