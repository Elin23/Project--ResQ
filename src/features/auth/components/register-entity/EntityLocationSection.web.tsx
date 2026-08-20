import { COLORS, PALETTE } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

/**
 * نسخة الويب — بدون react-native-maps (ما بيدعم الويب، بيوقف الـ bundle).
 * نفس الـ props ونفس الـ API متل EntityLocationSection.tsx، Metro بياخدها
 * تلقائياً على الويب. معاينة الخريطة هون شكل ثابت بس، والمستخدم لسا قادر
 * يحدد/يعدّل الموقع من نافذة الاختيار (EntityRegistrationModals).
 */
export default function EntityLocationSection({ form }: { form: RegisterEntityForm }) {
  const { entityTitle, errors, setErrors, serviceGovernorate, setServiceGovernorate, showServiceGovernorates, setShowServiceGovernorates, closeDropdowns, serviceDistrict, setServiceDistrict, selectedLocation, openMapPicker, renderDropdown, renderError, renderSectionHeader, GOVERNORATES } = form;
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
    <Ionicons name="location-outline" size={22} color={PALETTE.neutral700} />
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
      color={PALETTE.neutral700}
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
    <Ionicons name="location-outline" size={22} color={PALETTE.neutral700} />
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
      placeholderTextColor={PALETTE.neutral600}
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
  <View style={styles.mapEmptyState}>
    <Ionicons name="map-outline" size={52} color={COLORS.placeholder} />
    <AppText style={styles.mapEmptyText}>
      {selectedLocation
        ? `الإحداثيات: ${selectedLocation.latitude.toFixed(4)}، ${selectedLocation.longitude.toFixed(4)}`
        : "لم يتم تحديد الموقع بعد"}
    </AppText>
    <AppText style={styles.mapEmptyText}>معاينة الخريطة غير متاحة على الويب</AppText>
  </View>

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
      color={COLORS.textSecondary}
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
