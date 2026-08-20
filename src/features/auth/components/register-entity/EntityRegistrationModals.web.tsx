import { COLORS, PALETTE } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

/**
 * نسخة الويب — بدون react-native-maps (ما بيدعم الويب، بيوقف الـ bundle).
 * نفس الـ props ونفس الـ API متل EntityRegistrationModals.tsx. منطق تأكيد
 * الموقع وزر "استخدام موقعي الحالي" شغالين متل ما هنن (ما إلهن علاقة
 * بالخريطة نفسها)، بس معاينة الخريطة التفاعلية مو متوفرة هون.
 */
export default function EntityRegistrationModals({ form }: { form: RegisterEntityForm }) {
  const { entityTitle, temporaryBirthDate, showBirthDatePicker, setShowBirthDatePicker, showMapPicker, setShowMapPicker, temporaryLocation, isLocating, useCurrentLocation, confirmMapLocation, confirmBirthDate, handleBirthDateChange, minimumBirthDate, maximumBirthDate } = form;
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
      <View style={[styles.mapPicker, webStyles.mapPlaceholder]}>
        <Ionicons name="map-outline" size={48} color={COLORS.placeholder} />
        <AppText style={styles.mapEmptyText}>
          {temporaryLocation
            ? `الإحداثيات: ${temporaryLocation.latitude.toFixed(4)}، ${temporaryLocation.longitude.toFixed(4)}`
            : "معاينة الخريطة غير متاحة على الويب"}
        </AppText>
      </View>

      <View style={styles.mapInstructionCard}>
        <Ionicons
          name="information-circle-outline"
          size={19}
          color={COLORS.primaryStrong}
        />
        <AppText style={styles.mapInstructionText}>
          معاينة الخريطة غير متاحة على الويب — استخدم زر استخدام موقعي الحالي
          لتحديد الموقع، أو جرّب من تطبيق الجوال لتحديد نقطة بدقة.
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

const webStyles = StyleSheet.create({
  mapPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.disabledSurface,
  },
});
