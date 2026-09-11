import { COLORS } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

/**
 * نسخة الويب — بدون react-native-maps (ما بيدعم الويب، بيوقف الـ bundle).
 * نفس الـ props ونفس الـ API متل EntityLocationSection.tsx، Metro بياخدها
 * تلقائياً على الويب. معاينة الخريطة هون شكل ثابت بس، والمستخدم لسا قادر
 * يحدد/يعدّل الموقع من نافذة الاختيار (EntityRegistrationModals).
 */
export default function EntityLocationSection({ form }: { form: RegisterEntityForm }) {
  const {
    entityTitle,
    serviceGovernorateId,
    serviceGovernorate,
    serviceRegionId,
    serviceDistrict,
    showServiceGovernorates,
    setShowServiceGovernorates,
    showServiceRegions,
    setShowServiceRegions,
    selectServiceGovernorate,
    selectServiceRegion,
    selectedLocation,
    errors,
    openMapPicker,
    renderError,
    renderSectionHeader,
    locationLookups,
  } = form;
  return (<>
{renderSectionHeader("الموقع ونطاق الخدمة", true)}

<LocationLookupSelect
  label="المحافظة"
  placeholder="اختر المحافظة"
  required
  value={serviceGovernorateId}
  selectedLabel={serviceGovernorate}
  options={locationLookups.governorateOptions}
  visible={showServiceGovernorates}
  loading={locationLookups.loadingGovernorates}
  error={errors.serviceGovernorate}
  onOpen={() => {
    setShowServiceRegions(false);
    setShowServiceGovernorates(true);
  }}
  onClose={() => setShowServiceGovernorates(false)}
  onSelect={selectServiceGovernorate}
/>

<LocationLookupSelect
  label="المنطقة / الحي"
  placeholder={serviceGovernorateId ? "اختر المنطقة / الحي" : "اختر المحافظة أولًا"}
  required
  value={serviceRegionId}
  selectedLabel={serviceDistrict}
  options={locationLookups.regionOptions}
  visible={showServiceRegions}
  loading={locationLookups.loadingRegions}
  disabled={!serviceGovernorateId}
  error={errors.serviceDistrict}
  onOpen={() => {
    setShowServiceGovernorates(false);
    setShowServiceRegions(true);
  }}
  onClose={() => setShowServiceRegions(false)}
  onSelect={selectServiceRegion}
/>

{locationLookups.error ? (
  <AppText style={styles.helperText}>{locationLookups.error}</AppText>
) : null}

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
