import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export default function GuestHomeIntro() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="paw" size={22} color={COLORS.brown} />
      </View>

      <View style={styles.content}>
        <AppText variant="h2" weight="bold" style={styles.title}>
          ساهم في إنقاذ الحيوانات من حولك
        </AppText>
        <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.subtitle}>
          أرسل بلاغاً عن حالة تحتاج للمساعدة، واستكشف الجمعيات والعيادات ونقاط الإطعام القريبة.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  iconWrap: {
    width: 42,
    height: 42,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.peach,
  },
  content: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    width: "100%",
  },
  subtitle: {
    width: "100%",
    marginTop: SPACING.xs,
  },
});
