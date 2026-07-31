import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import type { PasswordRequirement } from "../../utils/passwordRequirements";

type Props = {
  requirements: PasswordRequirement[];
  confirmationVisible: boolean;
  passwordsMatch: boolean;
};

export default function PasswordRequirementsCard({
  requirements,
  confirmationVisible,
  passwordsMatch,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#4C3B34" />
        </View>
        <AppText style={styles.title}>متطلبات كلمة المرور</AppText>
      </View>

      <View style={styles.list}>
        {requirements.map((requirement) => (
          <View key={requirement.id} style={styles.row}>
            <Ionicons
              name={requirement.isValid ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={requirement.isValid ? "#13853A" : "#9B8174"}
            />
            <AppText style={[styles.text, requirement.isValid && styles.validText]}>
              {requirement.label}
            </AppText>
          </View>
        ))}

        {confirmationVisible ? (
          <View style={styles.row}>
            <Ionicons
              name={passwordsMatch ? "checkmark-circle" : "close-circle-outline"}
              size={20}
              color={passwordsMatch ? "#13853A" : "#BE4E2C"}
            />
            <AppText style={[styles.text, passwordsMatch && styles.validText]}>
              كلمتا المرور متطابقتان
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", borderRadius: 18, padding: 16, backgroundColor: "#FFF8F3", borderWidth: 1, borderColor: "#F1DED1" },
  header: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 14 },
  headerIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#F7E7DC" },
  title: { flex: 1, textAlign: "right", fontSize: 16, color: "#4C3B34" },
  list: { gap: 10 },
  row: { flexDirection: "row-reverse", alignItems: "center", gap: 9 },
  text: { flex: 1, textAlign: "right", fontSize: 14, color: "#806B60" },
  validText: { color: "#13853A" },
});
