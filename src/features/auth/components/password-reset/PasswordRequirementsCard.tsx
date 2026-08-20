import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import type { PasswordRequirement } from "../../utils/passwordRequirements";

import { TYPOGRAPHY, RADIUS, COLORS } from "@/src/theme";
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
          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.icon} />
        </View>
        <AppText style={styles.title}>متطلبات كلمة المرور</AppText>
      </View>

      <View style={styles.list}>
        {requirements.map((requirement) => (
          <View key={requirement.id} style={styles.row}>
            <Ionicons
              name={requirement.isValid ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={requirement.isValid ? COLORS.secondaryStrong : COLORS.iconMuted}
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
              color={passwordsMatch ? COLORS.secondaryStrong : COLORS.primaryStrong}
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
  card: { width: "100%", borderRadius: RADIUS.lg, padding: 16, backgroundColor: COLORS.dangerSoft, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: 10, marginBottom: 14 },
  headerIcon: { width: 36, height: 36, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.divider },
  title: { flex: 1, textAlign: "right", fontSize: TYPOGRAPHY.h3.fontSize, color: COLORS.icon },
  list: { gap: 10 },
  row: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: 9 },
  text: { flex: 1, textAlign: "right", fontSize: TYPOGRAPHY.body.fontSize, color: COLORS.textMuted },
  validText: { color: COLORS.secondaryStrong },
});
