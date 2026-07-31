import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { COLORS, SPACING } from "@/src/theme";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppText weight="bold" size={24} style={styles.title}>
        نافذة ResQ
      </AppText>
      <AppText color={COLORS.textSecondary} style={styles.description}>
        يمكن استخدام هذا المسار لاحقًا للنوافذ العامة داخل التطبيق.
      </AppText>
      <Button title="إغلاق" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: { marginBottom: SPACING.sm },
  description: { marginBottom: SPACING.lg },
});
