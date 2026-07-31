import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";

type RequestKind = "clinic" | "organization";

export default function RegistrationPendingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountType?: string;
    entityType?: string;
  }>();

  const requestKind: RequestKind =
    params.entityType === "clinic" ? "clinic" : "organization";

  const content = useMemo(() => {
    if (requestKind === "clinic") {
      return {
        title: "تم إرسال طلب تسجيل العيادة",
        description:
          "تم تأكيد رقم هاتف مسؤول العيادة. ستتم مراجعة بيانات العيادة ووثائقها قبل اعتمادها وإظهارها على الخريطة.",
        status: "العيادة قيد المراجعة",
        icon: "medkit-outline" as const,
      };
    }

    return {
      title: "تم إرسال طلب تسجيل الجمعية",
      description:
        "تم تأكيد رقم هاتف مسؤول الجمعية. ستتم مراجعة بيانات الجمعية ووثائقها قبل اعتمادها وتفعيل ميزاتها.",
      status: "الجمعية قيد المراجعة",
      icon: "business-outline" as const,
    };
  }, [requestKind]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.iconHalo}>
            <View style={styles.iconCircle}>
              <Ionicons name={content.icon} size={44} color="#B95F20" />
            </View>
          </View>

          <AppText style={styles.title}>{content.title}</AppText>
          <AppText style={styles.description}>{content.description}</AppText>

          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="time-outline" size={24} color="#B95F20" />
            </View>

            <View style={styles.statusTextWrap}>
              <AppText style={styles.statusLabel}>حالة الطلب</AppText>
              <AppText style={styles.statusValue}>{content.status}</AppText>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="notifications-outline" size={22} color="#16833A" />
            <AppText style={styles.infoText}>
              سيصلك إشعار عند قبول الطلب أو رفضه، وقد يتم التواصل معك لطلب
              معلومات إضافية.
            </AppText>
          </View>

          <Button
            title="متابعة إلى التطبيق"
            onPress={() => router.replace("/(tabs)" as never)}
            variant="custom"
            size="large"
            fullWidth
            backgroundColor="#FF8849"
            borderColor="#FF8849"
            borderWidth={0}
            textColor="#603016"
            radius={17}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <Pressable
            onPress={() => router.replace("/login" as never)}
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
    backgroundColor: "#FBFAFE",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FBFAFE",
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
    borderRadius: 75,
    backgroundColor: "#FFF2E9",
  },
  iconCircle: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 46,
    borderWidth: 1.5,
    borderColor: "#E7B28E",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 27,
    lineHeight: 38,
    color: "#24201E",
    textAlign: "center",
    writingDirection: "rtl",
  },
  description: {
    maxWidth: 400,
    marginTop: 10,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 25,
    color: "#6A625E",
    textAlign: "center",
    writingDirection: "rtl",
  },
  statusCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8C2A7",
    backgroundColor: "#FFF5ED",
  },
  statusIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#FFE5D3",
  },
  statusTextWrap: {
    flex: 1,
  },
  statusLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#8A674F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  statusValue: {
    marginTop: 3,
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#A6531B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  infoCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBE0CF",
    backgroundColor: "#F1F9F3",
  },
  infoText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    color: "#3C6645",
    textAlign: "left",
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
    fontSize: 16,
    textAlign: "center",
  },
  secondaryLink: {
    marginTop: 17,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondaryLinkPressed: {
    opacity: 0.55,
  },
  secondaryText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#FF7B32",
    textAlign: "center",
  },
});
