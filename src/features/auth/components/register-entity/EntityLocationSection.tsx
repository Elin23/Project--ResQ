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

export default function EntityLocationSection({ form }: { form: RegisterEntityForm }) {
  const { router, entityType, isClinic, entityTitle, horizontalPadding, contentWidth, fullName, setFullName, email, setEmail, birthDate, setBirthDate, temporaryBirthDate, setTemporaryBirthDate, phone, setPhone, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, logo, setLogo, licenseDocument, setLicenseDocument, managerDocument, setManagerDocument, extraDocument, setExtraDocument, password, setPassword, confirmPassword, setConfirmPassword, informationConfirmed, setInformationConfirmed, verificationConfirmed, setVerificationConfirmed, termsAccepted, setTermsAccepted, showBirthDatePicker, setShowBirthDatePicker, showServiceGovernorates, setShowServiceGovernorates, showCategories, setShowCategories, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, selectedLocation, setSelectedLocation, temporaryLocation, setTemporaryLocation, isLocating, errors, setErrors, isSubmitting, submitAttempted, maximumBirthDate, minimumBirthDate, formattedBirthDate, categories, activityOptions, animalOptions, passwordStrength, passwordStrengthLabel, passwordStrengthColor, canSubmit, closeDropdowns, handleBack, openBirthDatePicker, handleBirthDateChange, confirmBirthDate, toggleValue, pickImage, openMapPicker, handleMapPress, useCurrentLocation, confirmMapLocation, validateForm, handleSubmit, renderError, renderSectionHeader, renderDropdown, renderChips, renderUploadCard, GOVERNORATES } = form;
  return (<>
{renderSectionHeader("الموقع ونطاق الخدمة", true)}

<View style={styles.fieldGroup}>
  <Pressable
    onPress={() => {
      closeDropdowns();
      setShowServiceGovernorates((current) => !current);
    }}
    style={[
      styles.inputContainer,
      errors.serviceGovernorate && styles.inputContainerError,
    ]}
  >
    <Ionicons name="location-outline" size={22} color="#4D514A" />
    <AppText
      style={[
        styles.selectText,
        !serviceGovernorate && styles.selectPlaceholder,
      ]}
    >
      {serviceGovernorate || "المحافظة"}
    </AppText>
    <Ionicons
      name={
        showServiceGovernorates
          ? "chevron-up-outline"
          : "chevron-down-outline"
      }
      size={20}
      color="#4D514A"
    />
  </Pressable>
  {showServiceGovernorates
    ? renderDropdown(GOVERNORATES, serviceGovernorate, (item) => {
        setServiceGovernorate(item);
        setShowServiceGovernorates(false);
        setErrors((current) => ({
          ...current,
          serviceGovernorate: undefined,
        }));
      })
    : null}
  {renderError(errors.serviceGovernorate)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.serviceDistrict && styles.inputContainerError,
    ]}
  >
    <Ionicons name="location-outline" size={22} color="#4D514A" />
    <TextInput
      value={serviceDistrict}
      onChangeText={(value) => {
        setServiceDistrict(value);
        setErrors((current) => ({
          ...current,
          serviceDistrict: undefined,
        }));
      }}
      placeholder="المنطقة / الحي"
      placeholderTextColor="#777B75"
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.serviceDistrict)}
</View>

<View
  style={[
    styles.mapCard,
    errors.mapLocation && styles.mapCardError,
  ]}
>
  <MapView
    style={styles.mapPreview}
    region={{
      latitude: selectedLocation?.latitude ?? mapRegion.latitude,
      longitude:
        selectedLocation?.longitude ?? mapRegion.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    }}
    scrollEnabled={false}
    zoomEnabled={false}
    rotateEnabled={false}
    pitchEnabled={false}
    pointerEvents="none"
  >
    {selectedLocation ? (
      <Marker coordinate={selectedLocation} />
    ) : null}
  </MapView>

  {!selectedLocation ? (
    <View style={styles.mapEmptyState}>
      <Ionicons name="map-outline" size={52} color="#8F9A8E" />
      <AppText style={styles.mapEmptyText}>
        لم يتم تحديد الموقع بعد
      </AppText>
    </View>
  ) : null}

  <Pressable
    accessibilityRole="button"
    accessibilityLabel="تحديد الموقع على الخريطة"
    onPress={openMapPicker}
    style={({ pressed }) => [
      styles.locationButton,
      pressed && styles.locationButtonPressed,
    ]}
  >
    <Ionicons
      name={
        selectedLocation ? "create-outline" : "locate-outline"
      }
      size={17}
      color="#4E5B50"
    />
    <AppText style={styles.locationButtonText}>
      {selectedLocation
        ? "تعديل الموقع على الخريطة"
        : "تحديد الموقع على الخريطة"}
    </AppText>
  </Pressable>
</View>

{selectedLocation ? (
  <AppText style={styles.coordinateText}>
    الإحداثيات: {selectedLocation.latitude.toFixed(6)}،{" "}
    {selectedLocation.longitude.toFixed(6)}
  </AppText>
) : null}

{renderError(errors.mapLocation)}

<AppText style={styles.helperText}>
  اختر موقع {entityTitle} بدقة، وسيظهر هذا الموقع للمستخدمين على
  الخريطة بعد اعتماد الطلب.
</AppText>
  </>);
}
