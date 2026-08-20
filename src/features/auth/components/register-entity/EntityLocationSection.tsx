import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AppText from "@/src/components/ui/AppText";
import { COLORS, PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityLocationSection({ form }: { form: RegisterEntityForm }) {
  const { entityTitle, serviceGovernorate, setServiceGovernorate, serviceDistrict, setServiceDistrict, showServiceGovernorates, setShowServiceGovernorates, mapRegion, selectedLocation, errors, setErrors, closeDropdowns, openMapPicker, renderError, renderSectionHeader, renderDropdown, GOVERNORATES } = form;
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
      <Ionicons name="map-outline" size={52} color={COLORS.placeholder} />
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
