import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { styles } from "../../screens/RegisterUser.styles";
import type { RegisterUserForm } from "../../hooks/useRegisterUserForm";

export default function UserBirthDateModal({ form }: { form: RegisterUserForm }) {
 const {showBirthDatePicker,setShowBirthDatePicker,confirmBirthDate,temporaryBirthDate,minimumBirthDate,maximumBirthDate,handleBirthDateChange}=form;
 return (
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
          hitSlop={8}
          style={({ pressed }) => [
            styles.dateModalAction,
            pressed && styles.dateModalActionPressed,
          ]}
        >
          <AppText style={styles.dateModalCancel}>إلغاء</AppText>
        </Pressable>

        <AppText style={styles.dateModalTitle}>تاريخ الميلاد</AppText>

        <Pressable
          onPress={confirmBirthDate}
          hitSlop={8}
          style={({ pressed }) => [
            styles.dateModalAction,
            pressed && styles.dateModalActionPressed,
          ]}
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
 );
}
