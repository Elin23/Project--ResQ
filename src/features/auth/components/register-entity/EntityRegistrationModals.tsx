import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { COLORS, PALETTE, MAP_STYLE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityRegistrationModals({ form }: { form: RegisterEntityForm }) {
  const { entityTitle, temporaryBirthDate, showBirthDatePicker, setShowBirthDatePicker, showMapPicker, setShowMapPicker, mapRegion, setMapRegion, temporaryLocation, setTemporaryLocation, isLocating, maximumBirthDate, minimumBirthDate, handleBirthDateChange, confirmBirthDate, handleMapPress, useCurrentLocation, confirmMapLocation } = form;
  return (<>
<Modal
  visible={showMapPicker}
  animationType="slide"
  onRequestClose={() => setShowMapPicker(false)}
>
  <SafeAreaView style={styles.mapModalSafeArea} edges={["top", "bottom"]}>
    <View style={styles.mapModalHeader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="إغلاق الخريطة"
        onPress={() => setShowMapPicker(false)}
        style={({ pressed }) => [
          styles.mapModalHeaderButton,
          pressed && styles.mapModalHeaderButtonPressed,
        ]}
      >
        <Ionicons name="close" size={25} color={COLORS.icon} />
      </Pressable>

      <AppText style={styles.mapModalTitle}>
        تحديد موقع {entityTitle}
      </AppText>

      <View style={styles.mapModalHeaderSpacer} />
    </View>

    <View style={styles.mapPickerWrap}>
      <MapView
      customMapStyle={MAP_STYLE}
        style={styles.mapPicker}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {temporaryLocation ? (
          <Marker
            coordinate={temporaryLocation}
            draggable
            onDragEnd={(event) =>
              setTemporaryLocation(event.nativeEvent.coordinate)
            }
          />
        ) : null}
      </MapView>

      <View style={styles.mapInstructionCard}>
        <Ionicons
          name="information-circle-outline"
          size={19}
          color={COLORS.primaryStrong}
        />
        <AppText style={styles.mapInstructionText}>
          اضغط على الخريطة أو اسحب العلامة لتحديد الموقع بدقة.
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="استخدام موقعي الحالي"
        onPress={useCurrentLocation}
        disabled={isLocating}
        style={({ pressed }) => [
          styles.currentLocationButton,
          pressed && styles.currentLocationButtonPressed,
          isLocating && styles.currentLocationButtonDisabled,
        ]}
      >
        <Ionicons name="navigate-outline" size={21} color={PALETTE.green700} />
        <AppText style={styles.currentLocationButtonText}>
          {isLocating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"}
        </AppText>
      </Pressable>
    </View>

    <View style={styles.mapModalFooter}>
      <Button
        title="تأكيد الموقع"
        onPress={confirmMapLocation}
        variant="custom"
        size="large"
        fullWidth
        disabled={!temporaryLocation}
        backgroundColor={temporaryLocation ? PALETTE.orange500 : COLORS.divider}
        borderColor={temporaryLocation ? PALETTE.orange500 : COLORS.divider}
        borderWidth={0}
        textColor={temporaryLocation ? PALETTE.neutral0 : COLORS.placeholder}
        radius={17}
        style={styles.confirmLocationButton}
        textStyle={styles.submitButtonText}
      />
    </View>
  </SafeAreaView>
</Modal>

<Modal
  visible={Platform.OS === "ios" && showBirthDatePicker}
  transparent
  animationType="fade"
  onRequestClose={() => setShowBirthDatePicker(false)}
>
  <View style={styles.dateModalOverlay}>
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => setShowBirthDatePicker(false)}
    />
    <View style={styles.dateModalCard}>
      <View style={styles.dateModalHeader}>
        <Pressable
          onPress={() => setShowBirthDatePicker(false)}
          style={styles.dateModalAction}
        >
          <AppText style={styles.dateModalCancel}>إلغاء</AppText>
        </Pressable>
        <AppText style={styles.dateModalTitle}>تاريخ الميلاد</AppText>
        <Pressable
          onPress={confirmBirthDate}
          style={styles.dateModalAction}
        >
          <AppText style={styles.dateModalConfirm}>تم</AppText>
        </Pressable>
      </View>
      <DateTimePicker
        value={temporaryBirthDate}
        mode="date"
        display="spinner"
        minimumDate={minimumBirthDate}
        maximumDate={maximumBirthDate}
        onChange={handleBirthDateChange}
        style={styles.iosDatePicker}
      />
    </View>
  </View>
</Modal>
  </>);
}
