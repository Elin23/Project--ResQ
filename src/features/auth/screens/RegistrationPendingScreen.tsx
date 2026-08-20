import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { ROUTES } from "@/src/navigation/routes";
import { TYPOGRAPHY, RADIUS, COLORS, FONTS, PALETTE } from "@/src/theme";

export default function RegistrationPendingScreen() {
  const router = useRouter();
  const content = {
    title: "تم إرسال طلب تسجيل الجمعية",
    description: "تم تأكيد رقم هاتف مسؤول الجمعية. ستتم مراجعة بيانات الجمعية ووثائقها قبل اعتمادها وتفعيل ميزاتها.",
    status: "الجمعية قيد المراجعة",
    icon: "business-outline" as const,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.iconHalo}>
            <View style={styles.iconCircle}>
              <Ionicons name={content.icon} size={44} color={COLORS.primaryStrong} />
            </View>
          </View>

          <AppText style={styles.title}>{content.title}</AppText>
          <AppText style={styles.description}>{content.description}</AppText>

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="time-outline" size={24} color={COLORS.primaryStrong} />
            </View>

            <View style={styles.statusTextWrap}>
              <AppText style={styles.statusLabel}>حالة الطلب</AppText>
              <AppText style={styles.statusValue}>{content.status}</AppText>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="notifications-outline" size={22} color={PALETTE.green700} />
            <AppText style={styles.infoText}>
              طلب الجمعية مرتبط بهذا الحساب. يمكنك استخدام التصفح والخريطة والإشعارات أثناء المراجعة، وستظهر نتيجة الاعتماد في مركز الإشعارات عند وصولها.
            </AppText>
          </View>

          <Button
            title="دخول التطبيق أثناء المراجعة"
            onPress={() => router.replace(ROUTES.userHome)}
            variant="custom"
            size="large"
            fullWidth
            backgroundColor={PALETTE.orange500}
            borderColor={PALETTE.orange500}
            borderWidth={0}
            textColor={COLORS.icon}
            radius={17}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <Pressable
            onPress={() => router.push(ROUTES.notifications)}
            style={({ pressed }) => [styles.secondaryLink, pressed && styles.secondaryLinkPressed]}
          >
            <AppText style={styles.secondaryText}>فتح مركز الإشعارات</AppText>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={({ pressed }) => [
              styles.secondaryLink,
              pressed && styles.secondaryLinkPressed,
            ]}
          >
            <AppText style={styles.secondaryText}>
              العودة إلى تسجيل الدخول
            </AppText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  content: {
    width: "100%",
    maxWidth: 460,
    alignItems: "center",
  },
  iconHalo: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderRadius: RADIUS["2xl"],
    backgroundColor: COLORS.primarySoft,
  },
  iconCircle: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS["2xl"],
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
    backgroundColor: PALETTE.neutral0,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.h1.fontSize,
    lineHeight: 33,
    color: COLORS.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  description: {
    maxWidth: 400,
    marginTop: 10,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    lineHeight: 25,
    color: COLORS.textMuted,
    textAlign: "center",
    writingDirection: "rtl",
  },
  statusCard: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.dangerSoft,
  },
  statusIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusLabel: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.textMuted,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statusValue: {
    marginTop: 3,
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    color: COLORS.primaryStrong,
    textAlign: "right",
    writingDirection: "rtl",
  },
  infoCard: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondarySoft,
  },
  infoText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: "right",
    writingDirection: "rtl",
  },
  primaryButton: {
    width: "100%",
    height: 58,
    minHeight: 58,
    marginTop: 28,
  },
  primaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.h3.fontSize,
    textAlign: "center",
  },
  secondaryLink: {
    marginTop: 17,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  secondaryLinkPressed: {
    opacity: 0.55,
  },
  secondaryText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primary,
    textAlign: "center",
  },
});
